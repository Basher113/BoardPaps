const prisma = require("../lib/prisma");
const { logError } = require("../lib/logger");

/**
 * Error codes for project member authorization
 */
const ERROR_CODES = {
  PROJECT_ID_REQUIRED: 'PROJECT_ID_REQUIRED',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Middleware to require project membership
 * Verifies that the user is either:
 * - The project owner
 * - A member of the project (in ProjectMember table)
 * 
 * Attaches req.projectMember with member data (or null for owners)
 * Attaches req.project with project data
 */
const requireProjectMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: {
          code: ERROR_CODES.PROJECT_ID_REQUIRED,
          message: "Project ID is required"
        }
      });
    }

    // Fetch project with owner info
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        name: true,
        key: true
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: ERROR_CODES.PROJECT_NOT_FOUND,
          message: 'Project not found'
        }
      });
    }

    // Check if user is the project owner
    const isOwner = project.ownerId === userId;

    // Check if user is a project member
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    // User must be either owner or a member
    if (!isOwner && !member) {
      return res.status(403).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: "You do not have access to this project"
        }
      });
    }

    // Attach useful data for later use
    req.project = project;
    req.projectMember = member; // Will be null for owners
    req.isProjectOwner = isOwner;

    next();
  } catch (error) {
    logError('Project membership check failed', error, {
      projectId: req.params.projectId,
      userId: req.user?.id
    });

    return res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Project membership check failed"
      }
    });
  }
};

/**
 * Middleware factory to require specific project roles
 * Restricts certain actions to specific project roles (OWNER, ADMIN, etc.)
 * 
 * Note: Project owners are always allowed, regardless of role check
 * 
 * @param {string[]} roles - Array of allowed roles (e.g., ['ADMIN', 'MEMBER'])
 * @returns {Function} Express middleware
 */
const requireProjectRole = (roles) => {
  return (req, res, next) => {
    // Project owners bypass role checks
    if (req.isProjectOwner) {
      return next();
    }

    // Check if user has required role
    if (!req.projectMember || !roles.includes(req.projectMember.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: "You do not have the required role for this action"
        }
      });
    }
    next();
  };
};

/**
 * Helper to check if user is project owner
 * @param {Object} req - Express request with project data attached
 * @returns {boolean}
 */
const isOwner = (req) => {
  return req.isProjectOwner === true;
};

/**
 * Helper to check if user has specific project role
 * @param {Object} req - Express request with project data attached
 * @param {string} role - Role to check
 * @returns {boolean}
 */
const hasRole = (req, role) => {
  return req.isProjectOwner === true || req.projectMember?.role === role;
};

/**
 * Helper to check if user has any of the specified roles
 * @param {Object} req - Express request with project data attached
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
const hasAnyRole = (req, roles) => {
  return req.isProjectOwner === true || roles.includes(req.projectMember?.role);
};

/**
 * Get user's effective role in project
 * Owners have implicit 'OWNER' role
 * @param {Object} req - Express request with project data attached
 * @returns {string|null} Role or null if not a member
 */
const getEffectiveRole = (req) => {
  if (req.isProjectOwner) return 'OWNER';
  return req.projectMember?.role || null;
};

module.exports = {
  // Constants
  ERROR_CODES,
  
  // Middleware functions
  requireProjectMember,
  requireProjectRole,
  
  // Helper functions
  isOwner,
  hasRole,
  hasAnyRole,
  getEffectiveRole
};