const { logError } = require("../lib/logger");
const invitationService = require("../services/invitation.service");
const { InvitationError, INVITATION_ERRORS } = invitationService;

/**
 * Handle invitation errors and send appropriate response
 * @param {Error} error - Error object
 * @param {Response} res - Express response object
 */
const handleInvitationError = (error, res) => {
  if (error instanceof InvitationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
  
  logError('Unexpected error in invitation controller', error);
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};

/**
 * Create/send an invitation to join a project
 * Only OWNER or ADMIN can invite users
 * @route POST /projects/:projectId/invitations
 */
const sendInvitation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role, message } = req.body;
    const invitedById = req.user.id;

    const invitation = await invitationService.createInvitation({
      projectId,
      email,
      role,
      message,
      invitedById,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Get all pending invitations for a project
 * Only OWNER or ADMIN can view
 * @route GET /projects/:projectId/invitations
 */
const getProjectInvitations = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const invitations = await invitationService.getProjectInvitations(projectId);

    return res.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Get current user's pending invitations
 * @route GET /invitations
 */
const getMyInvitations = async (req, res) => {
  try {
    const invitations = await invitationService.getUserInvitations(req.user.email);

    return res.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Get pending invitation count for current user
 * @route GET /invitations/count
 */
const getMyInvitationsCount = async (req, res) => {
  try {
    const count = await invitationService.getUserInvitationCount(req.user.email);

    return res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Accept an invitation by ID
 * @route POST /invitations/:invitationId/accept
 */
const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const result = await invitationService.acceptInvitation(invitationId, req.user);

    return res.json(result);
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Decline an invitation
 * @route POST /invitations/:invitationId/decline
 */
const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    
    const result = await invitationService.declineInvitation(invitationId, req.user);

    return res.json(result);
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Cancel/revoke an invitation
 * Only OWNER, ADMIN, or the original inviter can cancel
 * @route DELETE /projects/:projectId/invitations/:invitationId
 */
const cancelInvitation = async (req, res) => {
  try {
    const { projectId, invitationId } = req.params;
    const userRole = req.projectMember?.role;

    const result = await invitationService.cancelInvitation(
      projectId,
      invitationId,
      req.user,
      userRole
    );

    return res.json(result);
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Get invitation preview by token (public endpoint for unauthenticated users)
 * Returns limited information about the invitation
 * @route GET /invitations/preview/:token
 */
const getInvitationPreview = async (req, res) => {
  try {
    const { token } = req.params;

    const preview = await invitationService.getInvitationByToken(token);

    return res.json({
      success: true,
      data: preview,
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

/**
 * Resend an invitation (reset expiration and send new email)
 * Only OWNER, ADMIN, or the original inviter can resend
 * @route POST /projects/:projectId/invitations/:invitationId/resend
 */
const resendInvitation = async (req, res) => {
  try {
    const { projectId, invitationId } = req.params;
    const userRole = req.projectMember?.role;

    const invitation = await invitationService.resendInvitation(
      projectId,
      invitationId,
      req.user,
      userRole
    );

    return res.json({
      success: true,
      data: invitation,
      message: "Invitation resent successfully",
    });
  } catch (error) {
    return handleInvitationError(error, res);
  }
};

module.exports = {
  sendInvitation,
  getProjectInvitations,
  getMyInvitations,
  getMyInvitationsCount,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  getInvitationPreview,
  resendInvitation,
};
