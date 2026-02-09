const {Router} = require("express");
const projectController = require("../controllers/project.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware")
const columnRouter = require("./column.routes");
const issueRouter = require("./issue.routes");
const invitationRouter = require("./invitation.routes");

const projectRouter = Router();

projectRouter.get("/", projectController.getMyProjects);
projectRouter.post("/", projectController.createProject);
projectRouter.get("/:projectId", requireProjectMember,
  projectController.getProject
);
projectRouter.patch("/:projectId", requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), 
  projectController.updateProject
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

// Nested routes
projectRouter.use("/:projectId/columns", columnRouter);
projectRouter.use("/:projectId/issues", issueRouter);
projectRouter.use("/:projectId/invitations", invitationRouter);

module.exports = projectRouter;