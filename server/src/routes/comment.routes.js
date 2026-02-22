const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });

// Middleware imports
const { requireProjectMember } = require("../middlewares/projectMember.middleware");
const { validateBody, validateParams, validateQuery } = require("../middlewares/validation.middleware");
const { canViewIssue } = require("../middlewares/issueAuthorization.middleware");

// Validation schemas
const {
  issueCommentParamsSchema,
  commentParamsSchema,
  createCommentSchema,
  getCommentsQuerySchema
} = require("../validations/comment.schema");

// Controller
const commentController = require("../controllers/comment.controller");

// ==================== COMMENT ROUTES ====================

/**
 * @route GET /api/projects/:projectId/issues/:issueId/comments
 * @desc Get all comments for an issue with pagination
 * @access Project members only
 */
commentRouter.get("/",
  requireProjectMember,
  validateParams(issueCommentParamsSchema),
  canViewIssue,
  validateQuery(getCommentsQuerySchema),
  commentController.getComments
);

/**
 * @route POST /api/projects/:projectId/issues/:issueId/comments
 * @desc Create a new comment on an issue
 * @access Project members only
 */
commentRouter.post("/",
  requireProjectMember,
  validateParams(issueCommentParamsSchema),
  canViewIssue,
  validateBody(createCommentSchema),
  commentController.createComment
);

/**
 * @route DELETE /api/projects/:projectId/issues/:issueId/comments/:commentId
 * @desc Delete a comment (author, project admin, or owner only)
 * @access Project members only (with authorization)
 */
commentRouter.delete("/:commentId",
  requireProjectMember,
  validateParams(commentParamsSchema),
  commentController.deleteComment
);

module.exports = commentRouter;
