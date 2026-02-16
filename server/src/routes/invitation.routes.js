const { Router } = require("express");
const invitationController = require("../controllers/invitation.controller");
const { requireProjectMember, requireProjectRole } = require("../middlewares/projectMember.middleware");
const { validateBody } = require("../middlewares/validation.middleware");
const { invitationSchema } = require("../validations/invitation.schema");
const { invitationLimiter } = require("../middlewares/rateLimiter.middleware");

const invitationRouter = Router({mergeParams: true});

// Public route - invitation preview by token (no auth required)
// Must be before /:invitationId routes to avoid conflict
invitationRouter.get(
  "/preview/:token",
  invitationController.getInvitationPreview
);

// Project-scoped routes (require membership)
invitationRouter.get(
  "/",
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  invitationController.getProjectInvitations
);

invitationRouter.post(
  "/",
  invitationLimiter,
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  validateBody(invitationSchema),
  invitationController.sendInvitation
);

// Resend invitation endpoint
invitationRouter.post(
  "/:invitationId/resend",
  invitationLimiter,
  requireProjectMember,
  invitationController.resendInvitation
);

invitationRouter.delete(
  "/:invitationId",
  requireProjectMember,
  requireProjectRole(["OWNER", "ADMIN"]),
  invitationController.cancelInvitation
);

module.exports = invitationRouter;

