const {Router} = require("express");
const projectController = require("../controllers/project.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware")
const columnRouter = require("./column.routes");
const issueRouter = require("./issue.routes");
const invitationRouter = require("./invitation.routes");
const projectMemberRouter = require("./project-member.routes");

const projectRouter = Router();

projectRouter.get("/", projectController.getMyProjects);
projectRouter.post("/", projectController.createProject);
projectRouter.get("/:projectId", requireProjectMember,
  projectController.getProject
);
projectRouter.patch("/:projectId/visit", requireProjectMember, 
  projectController.visitProject
);
projectRouter.put("/:projectId", requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]),
  projectController.updateProject
);
projectRouter.delete("/:projectId", requireProjectMember, requireProjectRole(["OWNER"]), 
  projectController.deleteProject
);

// Project Settings endpoint
projectRouter.get("/:projectId/settings", requireProjectMember,
  projectController.getProjectSettings
);

// Transfer ownership
projectRouter.put("/:projectId/transfer", requireProjectMember, requireProjectRole(["OWNER"]),
  projectController.transferOwnership
);

// Nested routes
projectRouter.use("/:projectId/columns", columnRouter);
projectRouter.use("/:projectId/issues", issueRouter);
projectRouter.use("/:projectId/invitations", invitationRouter);
projectRouter.use("/:projectId/members", projectMemberRouter);

module.exports = projectRouter;
