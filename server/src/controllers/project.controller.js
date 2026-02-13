const prisma = require("../lib/prisma");

const createProject = async (req, res) => {
  try {
    const { name, key } = req.body;
    const ownerId = req.user.id;

    const project = await prisma.project.create({
      data: {
        name,
        key,
        ownerId,
        members: {
          create: { userId: ownerId, role: "OWNER" },
        },
        columns: {
          create: [
            { name: 'To Do', position: 0 },
            { name: 'In Progress', position: 1 },
            { name: 'Done', position: 2 }
          ]
        }
      },
      include: {
        columns: {
          orderBy: { position: 'asc' }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: { id: true, username: true, avatar: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true }
            }
          }
        },
        _count: {
          select: {
            columns: true,
            issues: true
          }
        }
      },
      orderBy: { lastVisitedAt: 'desc' },
    });

    // Add user's role to each project
    const projectsWithRole = projects.map(project => {
      const isOwner = project.ownerId === userId;
      const membership = project.members.find(m => m.userId === userId);
      return {
        ...project,
        userRole: isOwner ? 'OWNER' : membership?.role === 'MEMBER' ? 'MEMBER' : 'ADMIN'
      };
    });

    res.json(projectsWithRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { id: true, email: true, username: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, username: true, avatar: true }
            }
          }
        },
        columns: {
          orderBy: { position: 'asc' },
          include: {
            issues: {
              orderBy: { position: 'asc' },
              include: {
                reporter: {
                  select: { id: true, email: true, username: true, avatar: true }
                },
                assignee: {
                  select: { id: true, email: true, username: true, avatar: true }
                }
              }
            },
            _count: {
              select: { issues: true }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
};

// GET /api/projects/:projectId/settings
const getProjectSettings = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { id: true, username: true, email: true, avatar: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, email: true, avatar: true }
            }
          }
        },
        invitations: {
          where: { status: "PENDING" },
          include: {
            invitedBy: {
              select: { id: true, username: true }
            }
          }
        },
        _count: {
          select: {
            columns: true,
            issues: true,
            members: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Get Project Settings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/projects/:projectId
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, key, description } = req.body;
    const userId = req.user.id;

    // Check if user has permission (OWNER or ADMIN)
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return res.status(403).json({ message: "You do not have permission to update this project" });
    }

    if (!name || !key) {
      return res.status(400).json({ message: "Name and key are required" });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { name, key: key.toUpperCase(), description },
      include: {
        owner: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/projects/:projectId/members/:memberId/role
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

// DELETE /api/projects/:projectId/members/:memberId
const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.user.id;

    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

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
    const isOwner = membership.role === "OWNER";
    const isAdmin = membership.role === "ADMIN";
    const isRemovingSelf = targetMember.userId === userId;
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
    console.error("Remove Member Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/projects/:projectId/transfer
const transferOwnership = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { newOwnerId } = req.body;
    const userId = req.user.id;

    // Check if current user is OWNER
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (!membership || membership.role !== "OWNER") {
      return res.status(403).json({ message: "Only the project owner can transfer ownership" });
    }

    // Check if new owner is a member of the project
    const newOwnerMembership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: newOwnerId, projectId }
      }
    });

    if (!newOwnerMembership) {
      return res.status(400).json({ message: "New owner must be a project member" });
    }

    // Use transaction to update both memberships
    await prisma.$transaction([
      prisma.projectMember.update({
        where: { id: membership.id },
        data: { role: "ADMIN" }
      }),
      prisma.projectMember.update({
        where: { id: newOwnerMembership.id },
        data: { role: "OWNER" }
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { ownerId: newOwnerId }
      })
    ]);

    res.json({ message: "Project ownership transferred successfully" });
  } catch (error) {
    console.error("Transfer Ownership Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is OWNER
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Only the project owner can delete this project" });
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const visitProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    await prisma.project.update({
      where: { id: projectId },
      data: { lastVisitedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update last visited" });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  visitProject,
  getProjectSettings,
  updateMemberRole,
  removeMember,
  transferOwnership
};
