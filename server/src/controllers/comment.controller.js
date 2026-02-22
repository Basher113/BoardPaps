const prisma = require("../lib/prisma");
const { auditLog, AUDIT_ACTIONS } = require("../services/audit.service");
const { logError, logInfo } = require("../lib/logger");

/**
 * Error codes for comment operations
 */
const ERROR_CODES = {
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  ISSUE_NOT_FOUND: 'ISSUE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
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
 * Get all comments for an issue with pagination
 * @route GET /api/projects/:projectId/issues/:issueId/comments
 */
const getComments = async (req, res) => {
  try {
    
    const { issueId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    // Calculate pagination
    const skip = (page - 1) * parseInt(limit);

    // Get total count and comments in parallel
    const [comments, total] = await Promise.all([
      prisma.issueComment.findMany({
        where: { issueId },
        include: {
          author: { select: userSelect }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.issueComment.count({ where: { issueId } })
    ]);

    logInfo('Comments fetched successfully', {
      issueId,
      userId,
      count: comments.length,
      total,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(error);
    logError('Error fetching comments', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to fetch comments',
      500
    ));
  }
};

/**
 * Create a new comment on an issue
 * @route POST /api/projects/:projectId/issues/:issueId/comments
 */
const createComment = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Verify issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { id: true, projectId: true, title: true }
    });

    if (!issue) {
      return res.status(404).json(errorResponse(
        ERROR_CODES.ISSUE_NOT_FOUND,
        'Issue not found',
        404
      ));
    }

    // Create the comment
    const comment = await prisma.issueComment.create({
      data: {
        content: content.trim(),
        issueId,
        authorId: userId
      },
      include: {
        author: { select: userSelect }
      }
    });

    // Audit log for comment creation
    await auditLog(AUDIT_ACTIONS.COMMENT_ADDED, {
      userId,
      projectId: issue.projectId,
      targetType: 'ISSUE_COMMENT',
      targetId: comment.id,
      metadata: {
        issueId,
        issueTitle: issue.title,
        commentLength: content.length
      }
    });

    logInfo('Comment created successfully', {
      commentId: comment.id,
      issueId,
      projectId: issue.projectId,
      userId
    });

    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    logError('Error creating comment', error, {
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to create comment',
      500
    ));
  }
};

/**
 * Delete a comment
 * @route DELETE /api/projects/:projectId/issues/:issueId/comments/:commentId
 */
const deleteComment = async (req, res) => {
  try {
    const { issueId, commentId } = req.params;
    const userId = req.user.id;

    // Get the comment with issue info
    const comment = await prisma.issueComment.findUnique({
      where: { id: commentId },
      include: {
        issue: {
          select: { id: true, projectId: true, title: true }
        }
      }
    });

    if (!comment) {
      return res.status(404).json(errorResponse(
        ERROR_CODES.COMMENT_NOT_FOUND,
        'Comment not found',
        404
      ));
    }

    // Verify the comment belongs to the specified issue
    if (comment.issueId !== issueId) {
      return res.status(400).json(errorResponse(
        ERROR_CODES.COMMENT_NOT_FOUND,
        'Comment does not belong to this issue',
        400
      ));
    }

    // Check if user is the comment author or has project admin/owner role
    const isAuthor = comment.authorId === userId;
    
    if (!isAuthor) {
      // Check if user is project owner or admin
      const projectMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: comment.issue.projectId
          }
        },
        select: { role: true }
      });

      const project = await prisma.project.findUnique({
        where: { id: comment.issue.projectId },
        select: { ownerId: true }
      });

      const isProjectOwner = project.ownerId === userId;
      const isProjectAdmin = projectMember?.role === 'ADMIN';

      if (!isProjectOwner && !isProjectAdmin) {
        return res.status(403).json(errorResponse(
          ERROR_CODES.UNAUTHORIZED,
          'You can only delete your own comments',
          403
        ));
      }
    }

    // Delete the comment
    await prisma.issueComment.delete({
      where: { id: commentId }
    });

    // Audit log for comment deletion
    await auditLog(AUDIT_ACTIONS.COMMENT_DELETED, {
      userId,
      projectId: comment.issue.projectId,
      targetType: 'ISSUE_COMMENT',
      targetId: commentId,
      metadata: {
        issueId,
        issueTitle: comment.issue.title,
        wasAuthor: isAuthor
      }
    });

    logInfo('Comment deleted successfully', {
      commentId,
      issueId,
      projectId: comment.issue.projectId,
      userId,
      wasAuthor: isAuthor
    });

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    logError('Error deleting comment', error, {
      commentId: req.params.commentId,
      issueId: req.params.issueId,
      userId: req.user?.id
    });
    return res.status(500).json(errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Failed to delete comment',
      500
    ));
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  ERROR_CODES
};
