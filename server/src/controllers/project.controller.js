const prisma = require("../lib/prisma");
const { logInfo, logError } = require("../lib/logger");
const { auditLog, getProjectAuditLogs: fetchProjectAuditLogs, AUDIT_ACTIONS } = require("../services/audit.service");
const {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  paginatedResponse
} = require("../utils/apiResponse");

const createProject = async (req, res) => {
  try {
    const { name, key, description } = req.body;
    const ownerId = req.user.id;

    const project = await prisma.project.create({
      data: {
        name,
        key,
        description: description || null,
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

    // Audit log for project creation
    await auditLog(AUDIT_ACTIONS.PROJECT_CREATED, {
      userId: ownerId,
      projectId: project.id,
      targetType: 'PROJECT',
      targetId: project.id,
      metadata: { name, key }
    });

    logInfo(`Project created: ${key}`, { projectId: project.id, ownerId });

    return createdResponse(res, project, 'Project created successfully');
  } catch (error) {
    logError("Create project error", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: `Project key "${req.body.key}" is already taken. Please choose a different key.`,
        error: 'DUPLICATE_KEY'
      });
    }
    
    return errorResponse(res, "Failed to create project");
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
    logInfo("Get my projects info", projects);
    return successResponse(res, projectsWithRole, 'Projects fetched successfully');
  } catch (error) {
    logError("Get my projects error", error);
    return errorResponse(res, "Failed to fetch projects");
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
                },
                _count: {
                  select: { comments: true }
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
      return notFoundResponse(res, 'Project');
    }

    return successResponse(res, project, 'Project fetched successfully');
  } catch (error) {
    logError('Error fetching project', error);
    return errorResponse(res, 'Failed to fetch project');
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
      return forbiddenResponse(res, "You are not a member of this project");
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
        columns: {
          orderBy: { position: 'asc' },
          include: {
            _count: {
              select: { issues: true }
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
      return notFoundResponse(res, 'Project');
    }

    return successResponse(res, project, 'Project settings fetched successfully');
  } catch (error) {
    logError("Get project settings error", error);
    return errorResponse(res, "Failed to fetch project settings");
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
      return forbiddenResponse(res, "You do not have permission to update this project");
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { 
        name, 
        key: key?.toUpperCase(), 
        description: description || null 
      },
      include: {
        owner: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    // Audit log for project update
    await auditLog(AUDIT_ACTIONS.PROJECT_UPDATED, {
      userId,
      projectId,
      targetType: 'PROJECT',
      targetId: projectId,
      metadata: { name, key, description }
    });

    logInfo(`Project updated: ${key}`, { projectId, userId });

    return successResponse(res, project, 'Project updated successfully');
  } catch (error) {
    logError("Update project error", error);
    return errorResponse(res, "Failed to update project");
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
      return forbiddenResponse(res, "Only the project owner can change member roles");
    }

    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return errorResponse(res, "Invalid role. Must be OWNER, ADMIN, or MEMBER", 400);
    }

    // Prevent changing own role
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return notFoundResponse(res, 'Member');
    }

    if (targetMember.userId === userId) {
      return errorResponse(res, "You cannot change your own role", 400);
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

    logInfo(`Member role changed in project`, { 
      projectId, 
      memberId, 
      previousRole, 
      newRole: role, 
      changedBy: userId 
    });

    return successResponse(res, updatedMember, 'Member role updated successfully');
  } catch (error) {
    logError("Update member role error", error);
    return errorResponse(res, "Failed to update member role");
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
      return forbiddenResponse(res, "You are not a member of this project");
    }

    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (!targetMember) {
      return notFoundResponse(res, 'Member');
    }

    // Cannot remove OWNER
    if (targetMember.role === "OWNER") {
      return errorResponse(res, "Cannot remove the project owner", 400);
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
      return forbiddenResponse(res, "You do not have permission to remove this member");
    }

    // Admin cannot remove other admins
    if (isAdmin && isTargetAdmin && !isRemovingSelf) {
      return forbiddenResponse(res, "Admins cannot remove other admins");
    }

    // Get the user's email to clean up their invitations
    const targetUser = await prisma.user.findUnique({
      where: { id: targetMember.userId },
      select: { email: true }
    });

    // Delete member and their ACCEPTED invitations in a transaction
    await prisma.$transaction([
      prisma.projectMember.delete({
        where: { id: memberId }
      }),
      // Delete any ACCEPTED invitations for this user in this project
      // This allows them to be re-invited in the future
      prisma.invitation.deleteMany({
        where: {
          projectId: projectId,
          email: targetUser?.email,
          status: "ACCEPTED"
        }
      })
    ]);

    // Audit log for member removal
    const action = isRemovingSelf ? AUDIT_ACTIONS.MEMBER_LEFT : AUDIT_ACTIONS.MEMBER_REMOVED;
    await auditLog(action, {
      userId,
      projectId,
      targetType: 'PROJECT_MEMBER',
      targetId: memberId,
      metadata: {
        removedUserId: targetMember.userId,
        removedRole: targetMember.role,
        removedBy: isRemovingSelf ? 'self' : userId
      }
    });

    logInfo(`Member ${isRemovingSelf ? 'left' : 'removed from'} project`, {
      projectId,
      memberId,
      removedUserId: targetMember.userId,
      removedBy: isRemovingSelf ? 'self' : userId
    });

    return successResponse(res, null, "Member removed successfully");
  } catch (error) {
    logError("Remove member error", error);
    return errorResponse(res, "Failed to remove member");
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
      return forbiddenResponse(res, "Only the project owner can transfer ownership");
    }

    // Check if new owner is a member of the project
    const newOwnerMembership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: newOwnerId, projectId }
      }
    });

    if (!newOwnerMembership) {
      return errorResponse(res, "New owner must be a project member", 400);
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

    // Audit log for ownership transfer
    await auditLog(AUDIT_ACTIONS.OWNERSHIP_TRANSFERRED, {
      userId,
      projectId,
      targetType: 'PROJECT',
      targetId: projectId,
      metadata: {
        previousOwnerId: userId,
        newOwnerId
      }
    });

    logInfo(`Project ownership transferred`, {
      projectId,
      previousOwner: userId,
      newOwner: newOwnerId
    });

    return successResponse(res, null, "Project ownership transferred successfully");
  } catch (error) {
    logError("Transfer ownership error", error);
    return errorResponse(res, "Failed to transfer ownership");
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is OWNER
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true, key: true, name: true }
    });

    if (!project) {
      return notFoundResponse(res, 'Project');
    }

    if (project.ownerId !== userId) {
      return forbiddenResponse(res, "Only the project owner can delete this project");
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    // Audit log for project deletion
    await auditLog(AUDIT_ACTIONS.PROJECT_DELETED, {
      userId,
      projectId,
      targetType: 'PROJECT',
      targetId: projectId,
      metadata: { key: project.key, name: project.name }
    });

    logInfo(`Project deleted: ${project.key}`, { projectId, userId });

    return successResponse(res, null, "Project deleted successfully");
  } catch (error) {
    logError("Delete project error", error);
    return errorResponse(res, "Failed to delete project");
  }
};

const visitProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    await prisma.project.update({
      where: { id: projectId },
      data: { lastVisitedAt: new Date() }
    });

    return successResponse(res, null, 'Last visited updated');
  } catch (error) {
    logError("Visit project error", error);
    return errorResponse(res, "Failed to update last visited");
  }
};

// Get audit logs for a project
const getProjectAuditLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, offset = 0, action, userId } = req.query;
    const currentUserId = req.user.id;

    // Check if user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: currentUserId, projectId }
      }
    });

    if (!membership) {
      return forbiddenResponse(res, "You are not a member of this project");
    }

    // Only OWNER and ADMIN can view audit logs
    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return forbiddenResponse(res, "Only project owners and admins can view audit logs");
    }

    const { logs, total } = await fetchProjectAuditLogs(projectId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      action,
      userId
    });

    return paginatedResponse(res, logs, parseInt(offset) / parseInt(limit) + 1, parseInt(limit), total, 'Audit logs fetched successfully');
  } catch (error) {
    logError("Get project audit logs error", error);
    return errorResponse(res, "Failed to fetch audit logs");
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
  transferOwnership,
  getProjectAuditLogs
};
