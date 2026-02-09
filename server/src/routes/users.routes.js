const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");

const usersRouter = Router();

// User-scoped invitation routes
usersRouter.get(
  "/me/invitations",
  invitationController.getMyInvitations
);

usersRouter.get(
  "/me/invitations/count",
  invitationController.getMyInvitationsCount
);

usersRouter.post(
  "/me/invitations/:invitationId/accept",
  invitationController.acceptInvitation
);

usersRouter.post(
  "/me/invitations/:invitationId/decline",
  invitationController.declineInvitation
);

module.exports = usersRouter;
