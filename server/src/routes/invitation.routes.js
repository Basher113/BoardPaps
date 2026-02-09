const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");
const { requireProjectMember, requireProjectRole } = require("../middlewares/projectMember.middleware");
const { validateBody } = require("../middlewares/validation.middleware");
const { invitationSchema } = require("../validations/invitation.schema");

const invitationRouter = Router({mergeParams: true});

// Project-scoped routes (require membership)
invitationRouter.get(
  "/",
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  invitationController.getProjectInvitations
);

invitationRouter.post(
  "/",
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  validateBody(invitationSchema),
  invitationController.sendInvitation
);

invitationRouter.delete(
  "/:invitationId",
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  invitationController.cancelInvitation
);

module.exports = invitationRouter;

