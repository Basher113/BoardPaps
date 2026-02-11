const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");
const settingsController = require("../controllers/settings.controller");
const { validateBody } = require("../middlewares/validation.middleware");
const { profileSchema, changePasswordSchema } = require("../validations/settings.schema");
const { uploadAvatar } = require("../middlewares/upload.middleware");

const usersRouter = Router();

// ==================== INVITATIONS ====================

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

// ==================== PROFILE ====================

usersRouter.get("/me/profile", settingsController.getProfile);
usersRouter.put("/me/profile", validateBody(profileSchema), settingsController.updateProfile);

// ==================== AVATAR ====================

usersRouter.put("/me/avatar", uploadAvatar.single("avatar"), settingsController.updateAvatar);
usersRouter.delete("/me/avatar", settingsController.deleteAvatar);

// ==================== SECURITY ====================

usersRouter.put("/me/change-password", validateBody(changePasswordSchema), settingsController.changePassword);
usersRouter.get("/me/sessions", settingsController.getSessions);
usersRouter.delete("/me/sessions/:sessionId", settingsController.revokeSession);
usersRouter.delete("/me/sessions", settingsController.revokeAllSessions);
usersRouter.delete("/me", settingsController.deleteAccount);

module.exports = usersRouter;
