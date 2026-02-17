const prisma = require("../lib/prisma");
const { logInfo, logError } = require("../lib/logger");
const { auditLog, AUDIT_ACTIONS } = require("../services/audit.service");


const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requesterId = req.user.id;

    // Check requester is a project member
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: requesterId,
          projectId,
        },
      },
    });

    if (!requester) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        user: { username: "asc" },
      },
    });

    res.json({ success: true, data: members });
  } catch (error) {
    logError("Get project members error", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project members",
    });
  }
};

// NOTE: addProjectMember has been removed.
// All member additions must go through the invitation system for security,
// audit trail, and proper email notifications.

const updateMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user.id;

    // Check if user is OWNER
    const currentUserMembership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (!currentUserMembership || currentUserMembership.role !== "OWNER") {
      return res.status(403).json({ 
        success: false, 
        message: "Only the project owner can change member roles" 
      });
    }

    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role. Must be OWNER, ADMIN, or MEMBER" 
      });
    }

    // Prevent changing own role
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    if (targetMember.userId === userId) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot change your own role" 
      });
    }

    const previousRole = targetMember.role;

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: { id: true, username: true, email: true, avatar: true }
        }
      }
    });

    // Audit log for role change
    await auditLog(AUDIT_ACTIONS.MEMBER_ROLE_CHANGED, {
      userId,
      projectId,
      targetType: 'PROJECT_MEMBER',
      targetId: memberId,
      metadata: {
        targetUserId: targetMember.userId,
        previousRole,
        newRole: role
      }
    });

    logInfo(`Member role changed`, {
      projectId,
      memberId,
      previousRole,
      newRole: role,
      changedBy: userId
    });

    res.json({ success: true, data: updatedMember });
  } catch (error) {
    logError("Update member role error", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update member role" 
    });
  }
};



// Remove member from project
const removeProjectMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const requesterId = req.user.id;

    // Get requester membership
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: requesterId,
          projectId,
        },
      },
    });

    if (!requester) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not a member of this project" 
      });
    }

    // Get target member
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    // Cannot remove OWNER
    if (targetMember.role === "OWNER") {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot remove the project owner" 
      });
    }

    // Check permissions
    const isOwner = requester.role === "OWNER";
    const isAdmin = requester.role === "ADMIN";
    const isRemovingSelf = targetMember.userId === requesterId;
    const isTargetAdmin = targetMember.role === "ADMIN";

    // Owner can remove anyone except themselves
    // Admin can remove members or themselves
    // Member can only remove themselves
    if (!isOwner && !isAdmin && !isRemovingSelf) {
      return res.status(403).json({ 
        success: false, 
        message: "You do not have permission to remove this member" 
      });
    }

    // Admin cannot remove other admins
    if (isAdmin && isTargetAdmin && !isRemovingSelf) {
      return res.status(403).json({ 
        success: false, 
        message: "Admins cannot remove other admins" 
      });
    }

    await prisma.projectMember.delete({
      where: { id: memberId }
    });

    // Audit log for member removal
    const action = isRemovingSelf ? AUDIT_ACTIONS.MEMBER_LEFT : AUDIT_ACTIONS.MEMBER_REMOVED;
    await auditLog(action, {
      userId: requesterId,
      projectId,
      targetType: 'PROJECT_MEMBER',
      targetId: memberId,
      metadata: {
        removedUserId: targetMember.userId,
        removedRole: targetMember.role,
        removedBy: isRemovingSelf ? 'self' : requesterId
      }
    });

    logInfo(`Member ${isRemovingSelf ? 'left' : 'removed from'} project`, {
      projectId,
      memberId,
      removedUserId: targetMember.userId,
      removedBy: isRemovingSelf ? 'self' : requesterId
    });

    res.json({ 
      success: true, 
      message: "Member removed successfully" 
    });
  } catch (error) {
    logError("Remove project member error", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to remove member from project" 
    });
  }
};


module.exports = { getProjectMembers, updateMemberRole, removeProjectMember }
