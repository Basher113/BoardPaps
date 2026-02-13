const {Router} = require("express");
const projectMemberRouter = Router({mergeParams: true});

const projectMemberController = require("../controllers/project-member.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware");

projectMemberRouter.get("/", requireProjectMember, projectMemberController.getProjectMembers);
projectMemberRouter.post("/", requireProjectMember, requireProjectRole(["OWNER", "ADMIN"]), projectMemberController.addProjectMember);
projectMemberRouter.put("/:memberId", requireProjectMember, requireProjectRole(["OWNER"]), projectMemberController.updateMemberRole);
projectMemberRouter.delete("/:memberId", requireProjectMember, projectMemberController.removeProjectMember);

module.exports = projectMemberRouter;
