const {Router} = require("express");
const projectMemberRouter = Router({mergeParams: true});

const projectMemberController = require("../controllers/project-member.controller");

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware");

// NOTE: Member addition is handled exclusively through the invitation system
// This ensures proper audit trail, email notifications, and acceptance workflow
projectMemberRouter.get("/", requireProjectMember, projectMemberController.getProjectMembers);
projectMemberRouter.put("/:memberId", requireProjectMember, requireProjectRole(["OWNER"]), projectMemberController.updateMemberRole);
projectMemberRouter.delete("/:memberId", requireProjectMember, projectMemberController.removeProjectMember);

module.exports = projectMemberRouter;
