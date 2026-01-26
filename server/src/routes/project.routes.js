const {Router} = require("express");
const projectController = require("../controllers/project.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware")

const projectRouter = Router();

projectRouter.get("/", projectController.getMyProjects);
projectRouter.post("/", projectController.createProject);
projectRouter.patch("/:projectId", requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), projectController.updateProject);
projectRouter.put("/:projectId", requireProjectMember, requireProjectRole(["ADMIN", "OWNER"]), projectController.updateProject);
projectRouter.delete("/:projectId", requireProjectMember, requireProjectRole(["OWNER"]), projectController.deleteProject);

module.exports = projectRouter;