const {Router} = require("express");
const projectController = require("../controllers/project.controller");

const projectRouter = Router();

projectRouter.get("/", projectController.getMyProjects);
projectRouter.post("/", projectController.createProject);
projectRouter.patch("/:projectId", projectController.updateProject);
projectRouter.put("/:projectId", projectController.updateProject);
projectRouter.delete("/:projectId", projectController.deleteProject);

module.exports = projectRouter;