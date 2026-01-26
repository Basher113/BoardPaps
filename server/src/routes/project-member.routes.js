const {Router} = require("express");
const projectMemberRouter = Router();

const projectMemberController = require("../controllers/project-member.controller");

projectMemberRouter.get("/", projectMemberController.getProjectMembers)
projectMemberRouter.post("/", projectMemberController.addProjectMember);
projectMemberRouter.put("/:userId", projectMemberController.updateProjectMember);
projectMemberRouter.delete("/:userId", projectMemberController.removeProjectMember);

module.exports = projectMemberRouter;