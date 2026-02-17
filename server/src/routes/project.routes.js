const {Router} = require("express");
const projectController = require("../controllers/project.controller");
const {requireAuth} = require('@clerk/express');

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware")
const {validateBody} = require("../middlewares/validation.middleware");
const {projectCreateLimiter, projectActionLimiter} = require("../middlewares/rateLimiter.middleware");
const {createProjectSchema, updateProjectSchema} = require("../validations/project.schema");
const columnRouter = require("./column.routes");
const issueRouter = require("./issue.routes");
const invitationRouter = require("./invitation.routes");
const projectMemberRouter = require("./project-member.routes");

const projectRouter = Router();

// All project routes require authentication
projectRouter.get("/", requireAuth(), projectController.getMyProjects);
projectRouter.get("/archived", requireAuth(), projectController.getArchivedProjects);
projectRouter.post("/", requireAuth(), projectCreateLimiter, validateBody(createProjectSchema), projectController.createProject);
projectRouter.get("/:projectId", requireAuth(), requireProjectMember,
  projectController.getProject
);
projectRouter.patch("/:projectId/visit", requireAuth(), requireProjectMember, 
  projectController.visitProject
);
projectRouter.put("/:projectId", requireAuth(), requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), projectActionLimiter, validateBody(updateProjectSchema),
  projectController.updateProject
);
projectRouter.delete("/:projectId", requireAuth(), requireProjectMember, requireProjectRole(["OWNER"]), projectActionLimiter, 
  projectController.deleteProject
);

// Archive/Restore endpoints
projectRouter.post("/:projectId/archive", requireAuth(), requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), projectActionLimiter,
  projectController.archiveProject
);
projectRouter.post("/:projectId/restore", requireAuth(), requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), projectActionLimiter,
  projectController.restoreProject
);

// Project Settings endpoint
projectRouter.get("/:projectId/settings", requireAuth(), requireProjectMember,
  projectController.getProjectSettings
);

// Audit logs endpoint
projectRouter.get("/:projectId/audit-logs", requireAuth(), requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]),
  projectController.getProjectAuditLogs
);

// Transfer ownership
projectRouter.put("/:projectId/transfer", requireAuth(), requireProjectMember, requireProjectRole(["OWNER"]),
  projectController.transferOwnership
);

// Nested routes
projectRouter.use("/:projectId/columns", columnRouter);
projectRouter.use("/:projectId/issues", issueRouter);
projectRouter.use("/:projectId/invitations", invitationRouter);
projectRouter.use("/:projectId/members", projectMemberRouter);

module.exports = projectRouter;
