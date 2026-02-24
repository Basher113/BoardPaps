const prisma = require("../lib/prisma");
const { logInfo, logError, logWarn } = require("../lib/logger");
const {
  sendInvitationEmail,
  sendInvitationAcceptedEmail,
  sendInvitationDeclinedEmail,
  isEmailEnabled,
} = require("./email.service");
const { auditLog, AUDIT_ACTIONS } = require("./audit.service");

const INVITATION_EXPIRY_DAYS = parseInt(process.env.INVITATION_EXPIRY_DAYS || '6');

/**
 * Custom error classes for invitation operations
 */
class InvitationError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

const INVITATION_ERRORS = {
  NOT_FOUND: new InvitationError('Invitation not found', 'NOT_FOUND', 404),
  ALREADY_MEMBER: new InvitationError('User is already a member of this project', 'ALREADY_MEMBER', 400),
  PENDING_EXISTS: new InvitationError('An invitation is already pending for this user', 'PENDING_EXISTS', 400),
  SELF_INVITE: new InvitationError('You cannot invite yourself', 'SELF_INVITE', 400),
  NOT_PENDING: (status) => new InvitationError(`Invitation has already been ${status.toLowerCase()}`, 'NOT_PENDING', 400),
  EXPIRED: new InvitationError('Invitation has expired', 'EXPIRED', 400),
  NOT_AUTHORIZED: new InvitationError('This invitation was not sent to you', 'NOT_AUTHORIZED', 403),
  WRONG_PROJECT: new InvitationError('Invitation does not belong to this project', 'WRONG_PROJECT', 400),
  CANCEL_NOT_ALLOWED: new InvitationError('You can only cancel invitations you sent, or you must be a project owner/admin', 'CANCEL_NOT_ALLOWED', 403),
  RESEND_NOT_ALLOWED: new InvitationError('You can only resend invitations you sent, or you must be a project owner/admin', 'RESEND_NOT_ALLOWED', 403),
};

/**
 * Normalize email address to lowercase and trim whitespace
 * @param {string} email - Email address to normalize
 * @returns {string} Normalized email
 */
const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

/**
 * Calculate expiration date for invitation
 * @returns {Date} Expiration date
 */
const calculateExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);
  return expiresAt;
};

// ==================== INVITATION CREATION ====================

/**
 * Validate that user can be invited to a project
 * @param {string} email - Email to invite
 * @param {string} projectId - Project ID
 * @param {string} invitedById - ID of user sending invitation
 * @throws {InvitationError} If validation fails
 */
const validateInvitationEligibility = async (email, projectId, invitedById) => {
  const normalizedEmail = normalizeEmail(email);

  // Check if the invited email belongs to an existing user
  const invitedUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (invitedUser) {
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: invitedUser.id,
          projectId,
        },
      },
    });

    if (existingMember) {
      throw INVITATION_ERRORS.ALREADY_MEMBER;
    }
  }

  // Check for existing pending invitation
  const existingInvitation = await prisma.invitation.findUnique({
    where: {
      email_projectId_status: {
        email: normalizedEmail,
        projectId,
        status: "PENDING",
      },
    },
  });

  if (existingInvitation) {
    throw INVITATION_ERRORS.PENDING_EXISTS;
  }

  // Prevent self-invitation
  const currentUser = await prisma.user.findUnique({
    where: { id: invitedById },
  });

  if (currentUser && currentUser.email === normalizedEmail) {
    throw INVITATION_ERRORS.SELF_INVITE;
  }

  return normalizedEmail;
};

/**
 * Create a new invitation
 * @param {Object} params - Invitation parameters
 * @param {string} params.projectId - Project ID
 * @param {string} params.email - Email to invite
 * @param {string} params.role - Role to assign
 * @param {string} params.message - Optional personal message
 * @param {string} params.invitedById - ID of user sending invitation
 * @returns {Promise<Object>} Created invitation
 */
const createInvitation = async ({ projectId, email, role, message, invitedById }) => {
  const normalizedEmail = await validateInvitationEligibility(email, projectId, invitedById);
  const expiresAt = calculateExpiryDate();

  const invitation = await prisma.invitation.create({
    data: {
      email: normalizedEmail,
      message: message?.trim()?.substring(0, 250) || null,
      projectId,
      role,
      invitedById,
      expiresAt,
    },
    include: {
      project: {
        select: { id: true, name: true, key: true },
      },
      invitedBy: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  // Send email notification (non-blocking)
  await sendInvitationNotification(invitation);

  // Audit log
  await auditLog(AUDIT_ACTIONS.INVITATION_CREATED, {
    userId: invitedById,
    projectId,
    targetType: 'INVITATION',
    targetId: invitation.id,
    metadata: {
      email: normalizedEmail,
      role,
    },
  });

  logInfo('Invitation sent', {
    invitationId: invitation.id,
    email: normalizedEmail,
    projectId,
    invitedBy: invitedById,
    emailSent: isEmailEnabled()
  });

  return invitation;
};

/**
 * Send invitation email notification (non-blocking)
 * @param {Object} invitation - Invitation object
 */
const sendInvitationNotification = async (invitation) => {
  if (!isEmailEnabled()) return;

  sendInvitationEmail(invitation, invitation.project, invitation.invitedBy)
    .then((result) => {
      if (!result.success) {
        logWarn('Failed to send invitation email', {
          invitationId: invitation.id,
          error: result.error
        });
      }
    })
    .catch((err) => {
      logError('Exception sending invitation email', err, {
        invitationId: invitation.id
      });
    });
};

// ==================== INVITATION RETRIEVAL ====================

/**
 * Get all pending invitations for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} List of invitations
 */
const getProjectInvitations = async (projectId) => {
  return prisma.invitation.findMany({
    where: {
      projectId,
      status: "PENDING",
    },
    include: {
      invitedBy: {
        select: { id: true, username: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get all invitations for a user by email (pending, accepted, declined)
 * @param {string} userEmail - User's email
 * @returns {Promise<Array>} List of invitations
 */
const getUserInvitations = async (userEmail) => {
  const normalizedEmail = normalizeEmail(userEmail);

  return prisma.invitation.findMany({
    where: {
      email: normalizedEmail,
    },
    include: {
      project: {
        select: { id: true, name: true, key: true },
      },
      invitedBy: {
        select: { id: true, username: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get pending invitation count for a user by email
 * @param {string} userEmail - User's email
 * @returns {Promise<number>} Count of pending invitations
 */
const getUserInvitationCount = async (userEmail) => {
  const normalizedEmail = normalizeEmail(userEmail);

  return prisma.invitation.count({
    where: {
      email: normalizedEmail,
      status: "PENDING",
    },
  });
};

/**
 * Get invitation by ID with validation
 * @param {string} invitationId - Invitation ID
 * @param {Object} options - Options
 * @param {boolean} options.checkExpired - Check if invitation is expired
 * @param {boolean} options.checkPending - Check if invitation is pending
 * @returns {Promise<Object>} Invitation object
 * @throws {InvitationError} If invitation not found or invalid
 */
const getInvitationById = async (invitationId, { checkExpired = false, checkPending = false } = {}) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      project: { select: { id: true, name: true, key: true } },
      invitedBy: { select: { id: true, username: true, email: true } },
    },
  });

  if (!invitation) {
    throw INVITATION_ERRORS.NOT_FOUND;
  }

  if (checkPending && invitation.status !== "PENDING") {
    throw INVITATION_ERRORS.NOT_PENDING(invitation.status);
  }

  if (checkExpired && new Date() > invitation.expiresAt) {
    throw INVITATION_ERRORS.EXPIRED;
  }

  return invitation;
};

/**
 * Get invitation by token (for preview)
 * @param {string} token - Invitation token
 * @returns {Promise<Object>} Invitation preview data
 */
const getInvitationByToken = async (token) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      project: {
        select: { id: true, name: true, key: true },
      },
      invitedBy: {
        select: { username: true },
      },
    },
  });

  if (!invitation) {
    throw INVITATION_ERRORS.NOT_FOUND;
  }

  if (invitation.status !== "PENDING") {
    throw INVITATION_ERRORS.NOT_PENDING(invitation.status);
  }

  if (new Date() > invitation.expiresAt) {
    throw INVITATION_ERRORS.EXPIRED;
  }

  // Return limited information for security
  return {
    project: {
      name: invitation.project.name,
      key: invitation.project.key,
    },
    role: invitation.role,
    invitedBy: invitation.invitedBy.username,
    expiresAt: invitation.expiresAt,
  };
};

// ==================== INVITATION ACCEPTANCE ====================

/**
 * Accept an invitation
 * @param {string} invitationId - Invitation ID
 * @param {Object} user - User accepting the invitation
 * @returns {Promise<Object>} Result with message
 */
const acceptInvitation = async (invitationId, user) => {
  const userId = user.id;
  const userEmail = normalizeEmail(user.email);

  const invitation = await getInvitationById(invitationId, { checkPending: true, checkExpired: true });

  // Verify the invitation belongs to this user
  if (invitation.email !== userEmail) {
    throw INVITATION_ERRORS.NOT_AUTHORIZED;
  }

  // Use transaction to prevent race conditions
  try {
    await prisma.$transaction(async (tx) => {
      // Check if user is already a member inside transaction
      const existingMember = await tx.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: invitation.projectId,
          },
        },
      });

      if (existingMember) {
        // Delete the pending invitation since user is already a member
        await tx.invitation.delete({
          where: { id: invitationId },
        });

        throw new Error("ALREADY_MEMBER");
      }

      // Check if there's already an ACCEPTED invitation for this email+project
      // (handles duplicate acceptance attempts)
      const existingAccepted = await tx.invitation.findFirst({
        where: {
          email: invitation.email,
          projectId: invitation.projectId,
          status: "ACCEPTED",
        },
      });

      if (existingAccepted) {
        // Delete the pending invitation since one is already accepted
        await tx.invitation.delete({
          where: { id: invitationId },
        });

        throw new Error("ALREADY_ACCEPTED");
      }

      // Create membership and update invitation status

      await tx.projectMember.create({
        data: {
          userId,
          projectId: invitation.projectId,
          role: invitation.role,
        },
      });

      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      });

      
    });

    // Send email notification to inviter (non-blocking)
    await sendAcceptanceNotification(invitation, user);

    // Audit log
    await auditLog(AUDIT_ACTIONS.INVITATION_ACCEPTED, {
      userId,
      projectId: invitation.projectId,
      targetType: 'INVITATION',
      targetId: invitationId,
      metadata: {
        email: invitation.email,
        role: invitation.role,
      },
    });

    logInfo('Invitation accepted', {
      invitationId,
      projectId: invitation.projectId,
      userId,
      role: invitation.role
    });

    return {
      success: true,
      message: `You have joined ${invitation.project.name} as ${invitation.role}`,
    };
  } catch (txError) {
    if (txError.message === "ALREADY_MEMBER") {
      return {
        success: true,
        message: "You are already a member of this project",
      };
    }

    if (txError.message === "ALREADY_ACCEPTED") {
      // This can happen when a user was removed from a project but their
      // ACCEPTED invitation still exists. Delete the old ACCEPTED invitation
      // and allow the user to accept the new invitation.
      await prisma.invitation.deleteMany({
        where: {
          email: invitation.email,
          projectId: invitation.projectId,
          status: "ACCEPTED",
        },
      });

      // Retry the acceptance
      return acceptInvitation(invitationId, user);
    }

    throw txError;
  }
};

/**
 * Send acceptance notification email (non-blocking)
 * @param {Object} invitation - Invitation object
 * @param {Object} acceptedBy - User who accepted
 */
const sendAcceptanceNotification = async (invitation, acceptedBy) => {
  if (!isEmailEnabled() || !invitation.invitedById) return;

  const inviter = await prisma.user.findUnique({
    where: { id: invitation.invitedById },
  });

  if (inviter) {
    sendInvitationAcceptedEmail(invitation, invitation.project, inviter, acceptedBy)
      .catch((err) => {
        logError('Exception sending invitation accepted email', err, {
          invitationId: invitation.id
        });
      });
  }
};

// ==================== INVITATION DECLINE ====================

/**
 * Decline an invitation
 * @param {string} invitationId - Invitation ID
 * @param {Object} user - User declining the invitation
 * @returns {Promise<Object>} Result with message
 */
const declineInvitation = async (invitationId, user) => {
  const userEmail = normalizeEmail(user.email);

  const invitation = await getInvitationById(invitationId, { checkPending: true });

  // Verify the invitation belongs to this user
  if (invitation.email !== userEmail) {
    throw INVITATION_ERRORS.NOT_AUTHORIZED;
  }

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: "DECLINED" },
  });

  // Send email notification to inviter (non-blocking)
  await sendDeclineNotification(invitation);

  // Audit log
  await auditLog(AUDIT_ACTIONS.INVITATION_DECLINED, {
    userId: user.id,
    projectId: invitation.projectId,
    targetType: 'INVITATION',
    targetId: invitationId,
    metadata: {
      email: invitation.email,
      role: invitation.role,
    },
  });

  logInfo('Invitation declined', { invitationId, projectId: invitation.projectId });

  return {
    success: true,
    message: `You have declined the invitation to join ${invitation.project.name}`,
  };
};

/**
 * Send decline notification email (non-blocking)
 * @param {Object} invitation - Invitation object
 */
const sendDeclineNotification = async (invitation) => {
  if (!isEmailEnabled() || !invitation.invitedById) return;

  const inviter = await prisma.user.findUnique({
    where: { id: invitation.invitedById },
  });

  if (inviter) {
    sendInvitationDeclinedEmail(invitation, invitation.project, inviter)
      .catch((err) => {
        logError('Exception sending invitation declined email', err, {
          invitationId: invitation.id
        });
      });
  }
};

// ==================== INVITATION CANCEL ====================

/**
 * Cancel an invitation
 * @param {string} projectId - Project ID
 * @param {string} invitationId - Invitation ID
 * @param {Object} user - User cancelling the invitation
 * @param {string} userRole - User's role in the project
 * @returns {Promise<Object>} Result with message
 */
const cancelInvitation = async (projectId, invitationId, user, userRole) => {
  const userId = user.id;

  const invitation = await getInvitationById(invitationId);

  if (invitation.projectId !== projectId) {
    throw INVITATION_ERRORS.WRONG_PROJECT;
  }

  if (invitation.status !== "PENDING") {
    throw INVITATION_ERRORS.NOT_PENDING(invitation.status);
  }

  // Authorization check: must be OWNER, ADMIN, or the original inviter
  const isOwner = userRole === "OWNER";
  const isAdmin = userRole === "ADMIN";
  const isInviter = invitation.invitedById === userId;

  if (!isOwner && !isAdmin && !isInviter) {
    throw INVITATION_ERRORS.CANCEL_NOT_ALLOWED;
  }

  await prisma.invitation.delete({
    where: { id: invitationId },
  });

  logInfo('Invitation cancelled', { invitationId, projectId, cancelledBy: userId });

  return {
    success: true,
    message: "Invitation cancelled",
  };
};

// ==================== INVITATION RESEND ====================

/**
 * Resend an invitation
 * @param {string} projectId - Project ID
 * @param {string} invitationId - Invitation ID
 * @param {Object} user - User resending the invitation
 * @param {string} userRole - User's role in the project
 * @returns {Promise<Object>} Updated invitation
 */
const resendInvitation = async (projectId, invitationId, user, userRole) => {
  const userId = user.id;

  const invitation = await getInvitationById(invitationId, {
    includeProject: true,
    includeInvitedBy: true
  });

  if (invitation.projectId !== projectId) {
    throw INVITATION_ERRORS.WRONG_PROJECT;
  }

  if (invitation.status !== "PENDING") {
    throw INVITATION_ERRORS.NOT_PENDING(invitation.status);
  }

  // Authorization check: must be OWNER, ADMIN, or the original inviter
  const isOwner = userRole === "OWNER";
  const isAdmin = userRole === "ADMIN";
  const isInviter = invitation.invitedById === userId;

  if (!isOwner && !isAdmin && !isInviter) {
    throw INVITATION_ERRORS.RESEND_NOT_ALLOWED;
  }

  // Reset expiration date
  const expiresAt = calculateExpiryDate();

  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitationId },
    data: { expiresAt },
    include: {
      project: {
        select: { id: true, name: true, key: true },
      },
      invitedBy: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  // Send email notification (non-blocking)
  await sendInvitationNotification(updatedInvitation);

  // Audit log
  await auditLog(AUDIT_ACTIONS.INVITATION_RESENT, {
    userId,
    projectId,
    targetType: 'INVITATION',
    targetId: invitationId,
    metadata: {
      email: invitation.email,
      role: invitation.role,
    },
  });

  logInfo('Invitation resent', { invitationId, projectId, resentBy: userId });

  return updatedInvitation;
};

module.exports = {
  // Errors
  InvitationError,
  INVITATION_ERRORS,

  // Utilities
  normalizeEmail,
  calculateExpiryDate,

  // CRUD Operations
  createInvitation,
  getProjectInvitations,
  getUserInvitations,
  getUserInvitationCount,
  getInvitationById,
  getInvitationByToken,

  // Actions
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  resendInvitation,

  // Email notifications
  sendInvitationNotification,
  sendAcceptanceNotification,
  sendDeclineNotification,
};
