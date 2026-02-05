const prisma = require("../lib/prisma");

/**
 * Get all issues for a project
 * @route GET /api/projects/:projectId/issues
 */
const getIssues = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { columnId, assigneeId, reporterId, type, priority } = req.query;

    // Build filter
    const where = { projectId };
    if (columnId) where.columnId = columnId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (reporterId) where.reporterId = reporterId;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    const issues = await prisma.issue.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, email: true, username: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        },
        column: {
          select: { id: true, name: true, position: true }
        }
      },
      orderBy: [
        { columnId: 'asc' },
        { position: 'asc' }
      ]
    });

    return res.status(200).json({
      success: true,
      data: issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch issues'
    });
  }
};

/**
 * Get a single issue by ID
 * @route GET /api/issues/:issueId
 */
const getIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: true,
        column: true,
        reporter: {
          select: { id: true, email: true, username: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        }
      }
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch issue'
    });
  }
};

/**
 * Create a new issue
 * @route POST /api/projects/:projectId/issues
 */
const createIssue = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, type, priority, columnId, assigneeId, } = req.body;
    const userId = req.user.id;

    // Verify column belongs to the project
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        issues: true
      }
    });


    if (!column || column.projectId !== projectId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid column for this project'
      });
    }

    // If assigneeId provided, verify they're a member
    if (assigneeId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          members: true
        }
      });

      const isMember = project.ownerId === assigneeId ||
        project.members.some(member => member.userId === assigneeId);

      if (!isMember) {
        return res.status(400).json({
          success: false,
          error: 'Assignee must be a project member'
        });
      }
    }

    
    const issuePosition = column.issues.length;
    
    await prisma.issue.updateMany({
      where: {
        columnId,
        position: { gte: issuePosition }
      },
      data: {
        position: { increment: 1 }
      }
    });
    

    const issue = await prisma.issue.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        type,
        priority,
        position: issuePosition,
        projectId,
        columnId,
        reporterId: userId,
        assigneeId: assigneeId || null
      },
      include: {
        reporter: {
          select: { id: true, email: true, username: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        },
        column: true
      }
    });

    return res.status(201).json({
      success: true,
      data: issue
    });

  } catch (error) {
    console.error('Error creating issue:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to create issue'
    });
  }
};

/**
 * Update an issue
 * @route PUT /api/issues/:issueId
 */
const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { title, description, type, priority, assigneeId, columnId } = req.body;

    // Build update data
    const updateData = {};

    // VALIDATIONs CHANGE THIS TO ZOD LATER
    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title cannot be empty'
        });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          error: 'Title must be 200 characters or less'
        });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (description && description.length > 5000) {
        return res.status(400).json({
          success: false,
          error: 'Description must be 5000 characters or less'
        });
      }
      updateData.description = description?.trim() || null;
    }

    if (type !== undefined) {
      if (!['TASK', 'BUG', 'STORY', 'EPIC'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid issue type'
        });
      }
      updateData.type = type;
    }

    if (priority !== undefined) {
      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid priority'
        });
      }
      updateData.priority = priority;
    }

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    // Check if user is the assignee or reporter (can edit)
    const userId = req.user.id;
    const canEdit = existingIssue.assigneeId === userId || existingIssue.reporterId === userId;
    
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to edit this issue'
      });
    }

    // Handle assignee update // CAN CHANGE THIS TO MIDDLEWARE INSTEAD
    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        updateData.assigneeId = null;
      } else {
        const isMember = existingIssue.project.ownerId === assigneeId ||
          existingIssue.project.members.some(member => member.userId === assigneeId);

        if (!isMember) {
          return res.status(400).json({
            success: false,
            error: 'Assignee must be a project member'
          });
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
        return res.status(400).json({
          success: false,
          error: 'Invalid column for this project'
        });
      }

      updateData.columnId = columnId;
    }

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
      include: {
        reporter: {
          select: { id: true, email: true, username: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        },
        column: true
      }
    });

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update issue'
    });
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
    console.log("Move")
    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    // Check if user is the assignee (can only move if assigned)
    const userId = req.user.id;
    const canMove = issue.assigneeId === userId;
    
    if (!canMove) {
      return res.status(403).json({
        success: false,
        error: 'Only the assignee can move this issue'
      });
    }

    // Verify new column belongs to the same project
    const newColumn = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        issues: true
      }
    });

    if (!newColumn || newColumn.projectId !== issue.projectId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid column for this project'
      });
    }

    const oldColumnId = issue.columnId;
    const oldPosition = issue.position;
    const isSameColumn = oldColumnId === columnId;

    // Validate new position
    const maxPosition = isSameColumn
    ? await prisma.issue.count({ where: { columnId } }) - 1
    : await prisma.issue.count({ where: { columnId } });

    if (newPosition > maxPosition) {
      return res.status(400).json({
        success: false,
        error: `Position must be between 0 and ${maxPosition}`
      });
    }

    // If nothing changes, return early
    if (isSameColumn && oldPosition === newPosition) {
      return res.status(200).json({
        success: true,
        data: issue
      });
    }

    // Perform the move in a transaction
    await prisma.$transaction(async (tx) => {

      // Make the moving issue position = 10000 so that we can move the other issues position safer
      await tx.issue.update({
        where: { id: issueId },
        data: { position: 10000 } // safe placeholder
      });

      if (isSameColumn) {
        // Reordering within the same column
        if (newPosition > oldPosition) {
          // Moving down: shift issues up
          await tx.issue.updateMany({
            where: {
              columnId,
              position: {
                gt: oldPosition,
                lte: newPosition
              }
            },
            data: {
              position: { decrement: 1 }
            }
          });
        } else {
          // Moving up: shift issues down
          const issuesToShift = await tx.issue.findMany({
            where: { columnId, position: { gte: newPosition, lt: oldPosition } },
            orderBy: { position: 'desc' }
          });

          for (const i of issuesToShift) {
            await tx.issue.update({
              where: { id: i.id },
              data: { position: i.position + 1 }
            });
          }
        }
      } else {
        // Moving to a different column
        // Remove from old column
        await tx.issue.updateMany({
          where: {
            columnId: oldColumnId,
            position: { gt: oldPosition }
          },
          data: {
            position: { decrement: 1 }
          }
        });

        // Make room in new column
        await tx.issue.updateMany({
          where: {
            columnId,
            position: { gte: newPosition }
          },
          data: {
            position: { increment: 1 }
          }
        });
      }

      // Update the issue
      await tx.issue.update({
        where: { id: issueId },
        data: {
          columnId,
          position: newPosition
        }
      });
    });

    // Fetch updated issue
    const updatedIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        reporter: {
          select: { id: true, email: true, username: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        },
        column: true
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedIssue
    });
  } catch (error) {
    console.error('Error moving issue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to move issue'
    });
  }
};

/**
 * Delete an issue
 * @route DELETE /api/issues/:issueId
 */
const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    // Check if user is the assignee or reporter (can delete)
    const userId = req.user.id;
    const canDelete = issue.assigneeId === userId || issue.reporterId === userId;
    
    if (!canDelete) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this issue'
      });
    }

    // Delete issue and adjust positions
    await prisma.$transaction(async (tx) => {
      await tx.issue.delete({
        where: { id: issueId }
      });

      // Shift remaining issues in the column
      await tx.issue.updateMany({
        where: {
          columnId: issue.columnId,
          position: { gt: issue.position }
        },
        data: {
          position: { decrement: 1 }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete issue'
    });
  }
};

module.exports = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  moveIssue,
  deleteIssue
};