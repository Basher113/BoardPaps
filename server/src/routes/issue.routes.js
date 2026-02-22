const { Router } = require("express");
const issueRouter = Router({ mergeParams: true });

// Middleware imports
const { requireProjectMember } = require("../middlewares/projectMember.middleware");
const { validateBody, validateParams, validateQuery } = require("../middlewares/validation.middleware");
const { canViewIssue, canEditIssue, canMoveIssue, canDeleteIssue } = require("../middlewares/issueAuthorization.middleware");
const {
  issueCreateLimiter,
  issueUpdateLimiter,
  issueMoveLimiter,
  issueDeleteLimiter
} = require("../middlewares/rateLimiter.middleware");

// Validation schemas
const {
  projectIssuesParamsSchema,
  issueParamsSchema,
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
  getIssuesQuerySchema
} = require("../validations/issue.schema");

// Controller
const issueController = require("../controllers/issue.controller");

// Sub-routes
const commentRoutes = require("./comment.routes");

// ==================== ISSUE ROUTES ====================

/**
 * @route GET /api/projects/:projectId/issues
 * @desc Get all issues for a project with pagination and filtering
 * @access Project members only
 */
issueRouter.get("/",
  requireProjectMember,
  validateParams(projectIssuesParamsSchema),
  validateQuery(getIssuesQuerySchema),
  issueController.getIssues
);

/**
 * @route GET /api/projects/:projectId/issues/:issueId
 * @desc Get a single issue by ID
 * @access Project members only
 */
issueRouter.get("/:issueId",
  requireProjectMember,
  validateParams(issueParamsSchema),
  canViewIssue,
  issueController.getIssue
);

/**
 * @route POST /api/projects/:projectId/issues
 * @desc Create a new issue
 * @access Project members only
 * @rateLimit 50 issues per hour per user
 */
issueRouter.post("/",
  issueCreateLimiter,
  requireProjectMember,
  validateParams(projectIssuesParamsSchema),
  validateBody(createIssueSchema),
  issueController.createIssue
);

/**
 * @route PUT /api/projects/:projectId/issues/:issueId
 * @desc Update an issue
 * @access Issue assignee, reporter, project admin, or owner
 * @rateLimit 100 updates per hour per user
 */
issueRouter.put("/:issueId",
  issueUpdateLimiter,
  requireProjectMember,
  validateParams(issueParamsSchema),
  canEditIssue,
  validateBody(updateIssueSchema),
  issueController.updateIssue
);

/**
 * @route PATCH /api/projects/:projectId/issues/:issueId/move
 * @desc Move an issue to a different column or reorder within the same column
 * @access Issue assignee, reporter, project admin, or owner
 * @rateLimit 200 moves per hour per user (higher for drag/drop operations)
 */
issueRouter.patch("/:issueId/move",
  issueMoveLimiter,
  requireProjectMember,
  validateParams(issueParamsSchema),
  canMoveIssue,
  validateBody(moveIssueSchema),
  issueController.moveIssue
);

/**
 * @route DELETE /api/projects/:projectId/issues/:issueId
 * @desc Delete an issue
 * @access Issue assignee, reporter, project admin, or owner
 * @rateLimit 20 deletes per hour per user
 */
issueRouter.delete("/:issueId",
  issueDeleteLimiter,
  requireProjectMember,
  validateParams(issueParamsSchema),
  canDeleteIssue,
  issueController.deleteIssue
);

// ==================== COMMENT ROUTES ====================

/**
 * @route /api/projects/:projectId/issues/:issueId/comments
 * @desc Nested routes for issue comments
 * @access Project members only
 */
issueRouter.use("/:issueId/comments", commentRoutes);

module.exports = issueRouter;