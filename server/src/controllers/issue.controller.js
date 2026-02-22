const prisma = require("../lib/prisma");
const { generateBetween, needsRebalance, rebalanceRanks } = require("../utils/lexorank.utils");
const { auditLog, AUDIT_ACTIONS } = require("../services/audit.service");
const { logError, logInfo } = require("../lib/logger");

/**
 * Error codes for issue operations
 */
const ERROR_CODES = {
  ISSUE_NOT_FOUND: 'ISSUE_NOT_FOUND',
  COLUMN_NOT_FOUND: 'COLUMN_NOT_FOUND',
  INVALID_COLUMN: 'INVALID_COLUMN',
  INVALID_ASSIGNEE: 'INVALID_ASSIGNEE',
  INVALID_POSITION: 'INVALID_POSITION',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Standard error response helper
 * @param {string} code - Error code
 * @param {string} message - Human readable message
 * @param {number} status - HTTP status code
 */
const errorResponse = (code, message, status = 400) => ({
  success: false,
  error: { code, message }
});

/**
 * Select fields for user relations (consistent across all queries)
 */
const userSelect = {
  id: true,
  email: true,
  username: true,
  avatar: true
};

/**
 * Get all issues for a project with pagination and filtering
 * @route GET /api/projects/:projectId/issues
 */
const getIssues = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { columnId, assigneeId, reporterId, type, priority, page, limit, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    // Build filter
    const where = { projectId };
    if (columnId) where.columnId = columnId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (reporterId) where.reporterId = reporterId;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and issues in parallel
    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        include: {
          reporter: { select: userSelect },
          assignee: { select: userSelect },
          column: {
            select: { id: true, name: true, position: true }
          }
        },
        orderBy: [
          { columnId: 'asc' },
          { position: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.issue.count({ where })
    ]);

    logInfo('Issues fetched successfully', {
      projectId,
      userId,
      count: issues.length,
      total,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: issues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError('Error fetching issues', error, {
      projectId: req.params.projectId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to fetch issues',
      500
    ));
  }
};

/**
 * Get a single issue by ID
 * @route GET /api/issues/:issueId
 */
const getIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Issue is already attached by authorization middleware
    const issue = req.issue || await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: {
          select: { id: true, name: true, key: true, ownerId: true }
        },
        column: {
          select: { id: true, name: true, position: true }
        },
        reporter: { select: userSelect },
        assignee: { select: userSelect }
      }
    });

    if (!issue) {
      return res.status(404).json(errorResponse(
        ERROR_CODES.ISSUE_NOT_FOUND,
        'Issue not found',
        404
      ));
    }

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    logError('Error fetching issue', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to fetch issue',
      500
    ));
  }
};

/**
 * Create a new issue
 * @route POST /api/projects/:projectId/issues
 */
const createIssue = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, type, priority, columnId, assigneeId, dueDate } = req.body;
    const userId = req.user.id;

    // Use transaction for data consistency
    const issue = await prisma.$transaction(async (tx) => {
      // Get project with key for issue key generation
      const project = await tx.project.findUnique({
        where: { id: projectId },
        select: { key: true }
      });

      if (!project) {
        throw new Error(ERROR_CODES.COLUMN_NOT_FOUND);
      }

      // Verify column belongs to the project and get existing issues
      const column = await tx.column.findUnique({
        where: { id: columnId },
        include: {
          issues: {
            select: { position: true },
            orderBy: { position: 'asc' }
          }
        }
      });

      if (!column || column.projectId !== projectId) {
        throw new Error(ERROR_CODES.INVALID_COLUMN);
      }

      // If assigneeId provided, verify they're a member
      if (assigneeId) {
        const [projectOwner, member] = await Promise.all([
          tx.project.findUnique({
            where: { id: projectId },
            select: { ownerId: true }
          }),
          tx.projectMember.findUnique({
            where: {
              userId_projectId: { userId: assigneeId, projectId }
            }
          })
        ]);

        const isMember = projectOwner.ownerId === assigneeId || !!member;
        if (!isMember) {
          throw new Error(ERROR_CODES.INVALID_ASSIGNEE);
        }
      }

      // Calculate new rank using lexorank
      const existingRanks = column.issues.map(i => i.position);
      const prevRank = existingRanks.length > 0 
        ? existingRanks[existingRanks.length - 1] 
        : null;
      const newRank = generateBetween(prevRank, null);

      // Generate issue key: Get the highest issue number for this project
      const lastIssue = await tx.issue.findFirst({
        where: { projectId },
        select: { issueKey: true },
        orderBy: { createdAt: 'desc' }
      });

      let nextIssueNumber = 1;
      if (lastIssue) {
        // Extract number from issue key (e.g., "PROJ-123" -> 123)
        const match = lastIssue.issueKey.match(/-(\d+)$/);
        if (match) {
          nextIssueNumber = parseInt(match[1], 10) + 1;
        }
      }
      const issueKey = `${project.key}-${nextIssueNumber}`;

      // Create the issue
      return tx.issue.create({
        data: {
          issueKey,
          title: title.trim(),
          description: description?.trim() || null,
          type,
          priority,
          position: newRank,
          projectId,
          columnId,
          reporterId: userId,
          assigneeId: assigneeId || null,
          dueDate: dueDate || null
        },
        include: {
          reporter: { select: userSelect },
          assignee: { select: userSelect },
          column: {
            select: { id: true, name: true, position: true }
          }
        }
      });
    });

    // Audit log for issue creation
    await auditLog(AUDIT_ACTIONS.ISSUE_CREATED, {
      userId,
      projectId,
      targetType: 'ISSUE',
      targetId: issue.id,
      metadata: {
        issueKey: issue.issueKey,
        issueTitle: issue.title,
        issueType: issue.type,
        issuePriority: issue.priority,
        columnId,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null
      }
    });

    logInfo('Issue created successfully', {
      issueId: issue.id,
      issueKey: issue.issueKey,
      projectId,
      userId,
      title: issue.title
    });

    return res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    // Handle known errors
    if (error.message === ERROR_CODES.INVALID_COLUMN) {
      return res.status(400).json(errorResponse(
        ERROR_CODES.INVALID_COLUMN,
        'Invalid column for this project'
      ));
    }
    if (error.message === ERROR_CODES.INVALID_ASSIGNEE) {
      return res.status(400).json(errorResponse(
        ERROR_CODES.INVALID_ASSIGNEE,
        'Assignee must be a project member'
      ));
    }

    logError('Error creating issue', error, {
      projectId: req.params.projectId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to create issue',
      500
    ));
  }
};

/**
 * Update an issue
 * @route PUT /api/issues/:issueId
 */
const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { title, description, type, priority, assigneeId, columnId, dueDate } = req.body;
    const userId = req.user.id;

    // Issue is already attached by authorization middleware
    const existingIssue = req.issue;

    // Build update data (validation already done by Zod schema)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (type !== undefined) updateData.type = type;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    // Handle assignee update
    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        updateData.assigneeId = null;
      } else {
        // Verify assignee is a project member
        const [project, member] = await Promise.all([
          prisma.project.findUnique({
            where: { id: existingIssue.projectId },
            select: { ownerId: true }
          }),
          prisma.projectMember.findUnique({
            where: {
              userId_projectId: { userId: assigneeId, projectId: existingIssue.projectId }
            }
          })
        ]);

        const isMember = project.ownerId === assigneeId || !!member;
        if (!isMember) {
          return res.status(400).json(errorResponse(
            ERROR_CODES.INVALID_ASSIGNEE,
            'Assignee must be a project member'
          ));
        }
        updateData.assigneeId = assigneeId;
      }
    }

    // Handle columnId update (moving issue to different column)
    if (columnId !== undefined) {
      const newColumn = await prisma.column.findUnique({
        where: { id: columnId }
      });

      if (!newColumn || newColumn.projectId !== existingIssue.projectId) {
        return res.status(400).json(errorResponse(
          ERROR_CODES.INVALID_COLUMN,
          'Invalid column for this project'
        ));
      }

      updateData.columnId = columnId;
    }

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
      include: {
        reporter: { select: userSelect },
        assignee: { select: userSelect },
        column: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    // Audit log for issue update - only for significant changes
    const significantFields = ['priority', 'assigneeId', 'type', 'dueDate'];
    const hasSignificantChanges = significantFields.some(field =>
      updateData[field] !== undefined && updateData[field] !== existingIssue[field]
    );

    if (hasSignificantChanges) {
      await auditLog(AUDIT_ACTIONS.ISSUE_UPDATED, {
        userId,
        projectId: existingIssue.projectId,
        targetType: 'ISSUE',
        targetId: issueId,
        metadata: {
          issueKey: issue.issueKey,
          issueTitle: issue.title,
          changes: Object.keys(updateData).filter(f => significantFields.includes(f)),
          previousValues: {
            priority: existingIssue.priority,
            assigneeId: existingIssue.assigneeId,
            type: existingIssue.type,
            dueDate: existingIssue.dueDate
          }
        }
      });
    }

    logInfo('Issue updated successfully', {
      issueId,
      projectId: existingIssue.projectId,
      userId,
      changes: Object.keys(updateData)
    });

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    logError('Error updating issue', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to update issue',
      500
    ));
  }
};

/**
 * Move an issue to a different column or reorder within the same column
 * @route PATCH /api/issues/:issueId/move
 */
const moveIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { columnId, newPosition } = req.body;
    const userId = req.user.id;

    // Issue is already attached by authorization middleware
    const issue = req.issue;

    // Verify new column belongs to the same project
    const newColumn = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        issues: true
      }
    });

    if (!newColumn || newColumn.projectId !== issue.projectId) {
      return res.status(400).json(errorResponse(
        ERROR_CODES.INVALID_COLUMN,
        'Invalid column for this project'
      ));
    }

    const oldColumnId = issue.columnId;
    const oldPosition = issue.position;
    const isSameColumn = oldColumnId === columnId;

    // Validate new position
    const maxPosition = isSameColumn
      ? await prisma.issue.count({ where: { columnId } }) - 1
      : await prisma.issue.count({ where: { columnId } });

    if (newPosition > maxPosition) {
      return res.status(400).json(errorResponse(
        ERROR_CODES.INVALID_POSITION,
        `Position must be between 0 and ${maxPosition}`
      ));
    }

    // If nothing changes, return early
    if (isSameColumn && oldPosition === newPosition) {
      return res.status(200).json({
        success: true,
        data: issue
      });
    }

    // Perform the move using lexorank
    await prisma.$transaction(async (tx) => {
      // Get the target column's issues sorted by position
      const targetColumn = await tx.column.findUnique({
        where: { id: columnId },
        include: {
          issues: {
            orderBy: { position: 'asc' },
            select: { id: true, position: true }
          }
        }
      });

      const issues = targetColumn.issues;

      // Calculate new rank based on target position
      const prevRank = newPosition === 0 ? null : issues[newPosition - 1]?.position;
      const nextRank = issues[newPosition]?.position;

      let newRank = generateBetween(prevRank, nextRank);

      // If ranks are too close, rebalance the column
      if (needsRebalance(prevRank, nextRank)) {
        const allRanks = issues.map(i => i.position);
        const newRanks = rebalanceRanks(allRanks);

        // Update all issues with new ranks
        for (let i = 0; i < issues.length; i++) {
          await tx.issue.update({
            where: { id: issues[i].id },
            data: { position: newRanks[i] }
          });
        }

        // Recalculate ranks after rebalance
        const rebalancedColumn = await tx.column.findUnique({
          where: { id: columnId },
          include: {
            issues: {
              orderBy: { position: 'asc' },
              select: { position: true }
            }
          }
        });

        const rebalancedRanks = rebalancedColumn.issues.map(i => i.position);
        const newPrevRank = newPosition === 0 ? null : rebalancedRanks[newPosition - 1];
        const newNextRank = rebalancedRanks[newPosition];
        newRank = generateBetween(newPrevRank, newNextRank);
      }

      // Update the issue
      await tx.issue.update({
        where: { id: issueId },
        data: {
          columnId,
          position: newRank
        }
      });
    });

    // Fetch updated issue
    const updatedIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        reporter: { select: userSelect },
        assignee: { select: userSelect },
        column: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    logInfo('Issue moved successfully', {
      issueId,
      projectId: issue.projectId,
      userId,
      fromColumn: oldColumnId,
      toColumn: columnId,
      newPosition
    });

    return res.status(200).json({
      success: true,
      data: updatedIssue
    });
  } catch (error) {
    logError('Error moving issue', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to move issue',
      500
    ));
  }
};

/**
 * Delete an issue
 * @route DELETE /api/issues/:issueId
 */
const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user.id;

    // Issue is already attached by authorization middleware
    const issue = req.issue;

    // Delete issue (no position adjustment needed with lexorank)
    await prisma.$transaction(async (tx) => {
      await tx.issue.delete({
        where: { id: issueId }
      });
    });

    // Audit log for issue deletion
    await auditLog(AUDIT_ACTIONS.ISSUE_DELETED, {
      userId,
      projectId: issue.projectId,
      targetType: 'ISSUE',
      targetId: issueId,
      metadata: {
        issueKey: issue.issueKey,
        issueTitle: issue.title,
        issueType: issue.type,
        issuePriority: issue.priority,
        columnId: issue.columnId
      }
    });

    logInfo('Issue deleted successfully', {
      issueId,
      issueKey: issue.issueKey,
      projectId: issue.projectId,
      userId,
      title: issue.title
    });

    return res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    logError('Error deleting issue', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to delete issue',
      500
    ));
  }
};

module.exports = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  moveIssue,
  deleteIssue,
  ERROR_CODES
};