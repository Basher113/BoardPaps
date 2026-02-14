const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");
const settingsController = require("../controllers/settings.controller");
const { validateBody } = require("../middlewares/validation.middleware");
const { profileSchema } = require("../validations/settings.schema");
const { uploadAvatar } = require("../middlewares/upload.middleware");
const {requireAuth} = require('@clerk/express');

const usersRouter = Router();

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
  requireAuth(),
  invitationController.acceptInvitation
);

usersRouter.post(
  "/me/invitations/:invitationId/decline",
  requireAuth(),
  invitationController.declineInvitation
);

// ==================== PROFILE ====================

usersRouter.get("/me/profile", requireAuth(), settingsController.getProfile);
usersRouter.put("/me/profile", requireAuth(), validateBody(profileSchema), settingsController.updateProfile);

// ==================== AVATAR ====================

usersRouter.put("/me/avatar", requireAuth(), uploadAvatar.single("avatar"), settingsController.updateAvatar);
usersRouter.delete("/me/avatar", requireAuth(), settingsController.deleteAvatar);

// ==================== SECURITY ====================

// Password change is handled client-side via Clerk's user.updatePassword()
// This provides better security as Clerk handles password verification

usersRouter.delete("/me", requireAuth(), settingsController.deleteAccount);

module.exports = usersRouter;
