const prisma = require("../prisma/client");

const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requesterId = req.user.id;

    // 🔐 Check requester is a project member
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
            email: true
          }
        }
      }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 🔐 RBAC: only OWNER can change roles
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId,
        },
      },
    });

    if (!requester || requester.role !== "OWNER") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.id === userId && role !== "OWNER") {
      return res.status(400).json({
        message: "Owner cannot demote themselves",
      });
    }

    const member = await prisma.projectMember.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update member role" });
  }
};

// Remove member from project
const removeProjectMember = async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.projectMember.delete({
        where: { id }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


module.exports = {getProjectMembers, addProjectMember, updateProjectMember, removeProjectMember}