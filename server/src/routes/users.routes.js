const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");
const usersController = require("../controllers/users.controller");
const { validateBody } = require("../middlewares/validation.middleware");
const { profileSchema } = require("../validations/settings.schema");
const { uploadAvatar } = require("../middlewares/upload.middleware");
const {requireAuth} = require('@clerk/express');
const { invitationActionLimiter } = require("../middlewares/rateLimiter.middleware");

const usersRouter = Router();

// Get me
usersRouter.get("/me", requireAuth(), usersController.getCurrentUserDataController);


// ==================== INVITATIONS ====================

// User-scoped invitation routes - all require authentication
usersRouter.get(
  "/me/invitations",
  requireAuth(),
  invitationController.getMyInvitations
);

usersRouter.get(
  "/me/invitations/count",
  requireAuth(),
  invitationController.getMyInvitationsCount
);

usersRouter.post(
  "/me/invitations/:invitationId/accept",
  invitationActionLimiter,
  requireAuth(),
  invitationController.acceptInvitation
);

usersRouter.post(
  "/me/invitations/:invitationId/decline",
  invitationActionLimiter,
  requireAuth(),
  invitationController.declineInvitation
);

// ==================== PROFILE ====================

usersRouter.get("/me/profile", requireAuth(), usersController.getProfile);
usersRouter.put("/me/profile", requireAuth(), validateBody(profileSchema), usersController.updateProfile);

// ==================== AVATAR ====================

usersRouter.put("/me/avatar", requireAuth(), uploadAvatar.single("avatar"), usersController.updateAvatar);
usersRouter.delete("/me/avatar", requireAuth(), usersController.deleteAvatar);

// ==================== SECURITY ====================

// Password change is handled client-side via Clerk's user.updatePassword()
// This provides better security as Clerk handles password verification

usersRouter.delete("/me", requireAuth(), usersController.deleteAccount);

module.exports = usersRouter;
