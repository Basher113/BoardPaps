const prisma = require("../lib/prisma");


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

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch project members",
    });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { userId, projectId, role } = req.body;
    const member = await prisma.projectMember.create({
      data: { userId, projectId, role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          }
        }
      }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
      return res.status(403).json({ message: "Only the project owner can change member roles" });
    }

    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent changing own role
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (targetMember.userId === userId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: { id: true, username: true, email: true, avatar: true }
        }
      }
    });

    res.json(updatedMember);
  } catch (error) {
    console.error("Update Member Role Error:", error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    // Get target member
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Cannot remove OWNER
    if (targetMember.role === "OWNER") {
      return res.status(400).json({ message: "Cannot remove the project owner" });
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
      return res.status(403).json({ message: "You do not have permission to remove this member" });
    }

    // Admin cannot remove other admins
    if (isAdmin && isTargetAdmin && !isRemovingSelf) {
      return res.status(403).json({ message: "Admins cannot remove other admins" });
    }

    await prisma.projectMember.delete({
      where: { id: memberId }
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = {getProjectMembers, addProjectMember, updateMemberRole, removeProjectMember}
