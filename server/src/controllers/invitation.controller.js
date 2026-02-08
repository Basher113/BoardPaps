const prisma = require("../lib/prisma");

const INVITATION_EXPIRY_DAYS = 7;

/**
 * Create/send an invitation to join a project
 * Only OWNER or ADMIN can invite users
 */
const sendInvitation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const invitedById = req.user.id;
    
    console.log("invitation");
    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: "", // We'll need to find user by email first
          projectId,
        },
      },
    });

    // First, check if the invited email belongs to an existing user
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (invitedUser) {
      const actualExistingMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: invitedUser.id,
            projectId,
          },
        },
      });

      if (actualExistingMember) {
        return res.status(400).json({
          success: false,
          message: "User is already a member of this project",
        });
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        email_projectId_status: {
          email,
          projectId,
          status: "PENDING",
        },
      },
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: "An invitation is already pending for this user",
      });
    }

    // Prevent self-invitation
    const currentUser = await prisma.user.findUnique({
      where: { id: invitedById },
    });

    if (currentUser && currentUser.email === email) {
      return res.status(400).json({
        success: false,
        message: "You cannot invite yourself",
      });
    }

    // Create invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    const invitation = await prisma.invitation.create({
      data: {
        email,
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

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send invitation",
    });
  }
};

/**
 * Get all pending invitations for a project
 * Only OWNER or ADMIN can view
 */
const getProjectInvitations = async (req, res) => {
  try {
    const { projectId } = req.params;

    const invitations = await prisma.invitation.findMany({
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

    res.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invitations",
    });
  }
};

/**
 * Get current user's pending invitations
 */
const getMyInvitations = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const invitations = await prisma.invitation.findMany({
      where: {
        email: userEmail,
        status: "PENDING",
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

    res.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("Error fetching user invitations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invitations",
    });
  }
};

/**
 * Get pending invitation count for current user
 */
const getMyInvitationsCount = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const count = await prisma.invitation.count({
      where: {
        email: userEmail,
        status: "PENDING",
      },
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Error counting invitations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to count invitations",
    });
  }
};

/**
 * Accept an invitation
 */
const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Get the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invitation.email !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "This invitation was not sent to you",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Invitation has already been ${invitation.status.toLowerCase()}`,
      });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invitation has expired",
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: invitation.projectId,
        },
      },
    });

    if (existingMember) {
      // Update invitation status but don't create duplicate membership
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      });

      return res.json({
        success: true,
        message: "You are already a member of this project",
      });
    }

    // Create membership and update invitation status
    await prisma.$transaction([
      prisma.projectMember.create({
        data: {
          userId,
          projectId: invitation.projectId,
          role: invitation.role,
        },
      }),
      prisma.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      }),
    ]);

    res.json({
      success: true,
      message: `You have joined ${invitation.project.name} as ${invitation.role}`,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept invitation",
    });
  }
};

/**
 * Decline an invitation
 */
const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userEmail = req.user.email;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invitation.email !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "This invitation was not sent to you",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Invitation has already been ${invitation.status.toLowerCase()}`,
      });
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "DECLINED" },
    });

    res.json({
      success: true,
      message: `You have declined the invitation to join ${invitation.project.name}`,
    });
  } catch (error) {
    console.error("Error declining invitation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decline invitation",
    });
  }
};

/**
 * Cancel/revoke an invitation
 * Only OWNER or ADMIN can cancel
 */
const cancelInvitation = async (req, res) => {
  try {
    const { projectId, invitationId } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invitation.projectId !== projectId) {
      return res.status(400).json({
        success: false,
        message: "Invitation does not belong to this project",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Can only cancel pending invitations",
      });
    }

    await prisma.invitation.delete({
      where: { id: invitationId },
    });

    res.json({
      success: true,
      message: "Invitation cancelled",
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel invitation",
    });
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
};
