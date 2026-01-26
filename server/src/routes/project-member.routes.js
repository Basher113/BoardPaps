const {Router} = require("express");
const projectMemberRouter = Router();

const projectMemberController = require("../controllers/project-member.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware");

projectMemberRouter.get("/", requireProjectMember, projectMemberController.getProjectMembers)
projectMemberRouter.post("/", requireProjectMember, requireProjectRole(["OWNER", "ADMIN"]), projectMemberController.addProjectMember);
projectMemberRouter.put("/:userId", requireProjectMember, requireProjectRole(["OWNER", "ADMIN"]), projectMemberController.updateProjectMember);
projectMemberRouter.delete("/:userId", requireProjectMember, requireProjectRole(["OWNER"]), projectMemberController.removeProjectMember);

module.exports = projectMemberRouter;