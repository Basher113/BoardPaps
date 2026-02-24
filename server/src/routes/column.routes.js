const { Router } = require("express");
const columnController = require("../controllers/column.controllers");
const columnRouter = Router({ mergeParams: true });

const { requireProjectMember, requireProjectRole } = require("../middlewares/projectMember.middleware");
const { validateBody, validateParams } = require("../middlewares/validation.middleware");
const { projectActionLimiter } = require("../middlewares/rateLimiter.middleware");
const { 
  createColumnSchema, 
  updateColumnSchema, 
  reorderColumnsSchema 
} = require("../validations/column.schema");

// ==================== READ OPERATIONS ====================
// All project members can read columns

/**
 * @route GET /api/projects/:projectId/columns
 * @desc Get all columns for a project
 * @access Project Member
 */
columnRouter.get(
  "/",
  requireProjectMember,
  columnController.getColumns
);

/**
 * @route GET /api/projects/:projectId/columns/:columnId
 * @desc Get a single column by ID
 * @access Project Member
 */
columnRouter.get(
  "/:columnId",
  requireProjectMember,
  columnController.getColumn
);

// ==================== WRITE OPERATIONS ====================
// Only ADMIN and OWNER can create/update columns

/**
 * @route POST /api/projects/:projectId/columns
 * @desc Create a new column
 * @access Admin, Owner
 */
columnRouter.post(
  "/",
  requireProjectMember,
  requireProjectRole(["ADMIN", "OWNER"]),
  projectActionLimiter,
  validateBody(createColumnSchema),
  columnController.createColumn
);

/**
 * @route PUT /api/projects/:projectId/columns/sync
 * @desc Sync all columns (bulk create/update/delete)
 * @access Admin, Owner
 */
columnRouter.put(
  "/sync",
  requireProjectMember,
  requireProjectRole(["ADMIN", "OWNER"]),
  projectActionLimiter,
  columnController.syncColumns
);

/**
 * @route PATCH /api/projects/:projectId/columns/reorder
 * @desc Reorder multiple columns
 * @access Admin, Owner
 */
columnRouter.patch(
  "/reorder",
  requireProjectMember,
  requireProjectRole(["ADMIN", "OWNER"]),
  projectActionLimiter,
  validateBody(reorderColumnsSchema),
  columnController.reorderColumns
);

/**
 * @route PUT /api/projects/:projectId/columns/:columnId
 * @desc Update a column
 * @access Admin, Owner
 */
columnRouter.put(
  "/:columnId",
  requireProjectMember,
  requireProjectRole(["ADMIN", "OWNER"]),
  projectActionLimiter,
  validateBody(updateColumnSchema),
  columnController.updateColumn
);

/**
 * @route DELETE /api/projects/:projectId/columns/:columnId
 * @desc Delete a column (Admin or Owner can delete)
 * @access Admin, Owner
 */
columnRouter.delete(
  "/:columnId",
  requireProjectMember,
  requireProjectRole(["ADMIN", "OWNER"]),
  projectActionLimiter,
  columnController.deleteColumn
);

module.exports = columnRouter;
