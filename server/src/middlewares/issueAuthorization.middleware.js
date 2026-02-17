const prisma = require("../lib/prisma");
const { logError } = require("../lib/logger");

/**
 * Error codes for issue authorization
 */
const ERROR_CODES = {
  ISSUE_NOT_FOUND: 'ISSUE_NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Permission actions for issues
 */
const ISSUE_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  MOVE: 'move',
  DELETE: 'delete'
};

/**
 * Calculate user permissions for an issue
 * @param {Object} issue - Issue object with project and members populated
 * @param {string} userId - User ID to check permissions for
 * @returns {Object} Permission object with boolean flags for each action
 */
const calculatePermissions = (issue, userId) => {
  const userMembership = issue.project.members.find(m => m.userId === userId);
  const isOwner = issue.project.ownerId === userId;
  const isAdmin = userMembership?.role === 'ADMIN';
  const isMember = !!userMembership || isOwner;
  const isAssignee = issue.assigneeId === userId;
  const isReporter = issue.reporterId === userId;

  return {
    isOwner,
    isAdmin,
    isMember,
    isAssignee,
    isReporter,
    canView: isMember,
    canEdit: isOwner || isAdmin || isAssignee || isReporter,
    canMove: isOwner || isAdmin || isAssignee || isReporter,
    canDelete: isOwner || isAdmin || isAssignee || isReporter
  };
};

/**
 * Fetch issue with project and member data for authorization
 * @param {string} issueId - Issue ID to fetch
 * @returns {Promise<Object|null>} Issue with populated relations or null
 */
const fetchIssueForAuth = async (issueId) => {
  return prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: {
        include: {
          members: {
            select: {
              userId: true,
              role: true
            }
          }
        }
      }
    }
  });
};

/**
 * Middleware factory to check issue permissions
 * @param {string} action - Action to check (view, edit, move, delete)
 * @param {Object} options - Additional options
 * @param {boolean} options.attachIssue - Whether to attach issue to req.issue
 * @returns {Function} Express middleware
 */
const checkIssuePermission = (action, options = {}) => {
  const { attachIssue = true } = options;

  return async (req, res, next) => {
    try {
      const { issueId } = req.params;
      const userId = req.user.id;

      // Fetch issue with authorization data
      const issue = await fetchIssueForAuth(issueId);

      if (!issue) {
        return res.status(404).json({
          success: false,
          error: {
            code: ERROR_CODES.ISSUE_NOT_FOUND,
            message: 'Issue not found'
          }
        });
      }

      // Calculate permissions
      const permissions = calculatePermissions(issue, userId);

      // Check if user has permission for the action
      const permissionKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
      
      if (!permissions[permissionKey]) {
        return res.status(403).json({
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: `You do not have permission to ${action} this issue`
          }
        });
      }

      // Attach issue and permissions to request for later use
      if (attachIssue) {
        req.issue = issue;
        req.issuePermissions = permissions;
      }

      next();
    } catch (error) {
      logError('Issue authorization check failed', error, {
        issueId: req.params.issueId,
        userId: req.user?.id,
        action
      });

      return res.status(500).json({
        success: false,
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          message: 'Failed to verify issue permissions'
        }
      });
    }
  };
};

/**
 * Middleware to check if user can view an issue
 */
const canViewIssue = checkIssuePermission(ISSUE_ACTIONS.VIEW);

/**
 * Middleware to check if user can edit an issue
 */
const canEditIssue = checkIssuePermission(ISSUE_ACTIONS.EDIT);

/**
 * Middleware to check if user can move an issue
 */
const canMoveIssue = checkIssuePermission(ISSUE_ACTIONS.MOVE);

/**
 * Middleware to check if user can delete an issue
 */
const canDeleteIssue = checkIssuePermission(ISSUE_ACTIONS.DELETE);

/**
 * Helper function to check permissions without middleware (for use in controllers)
 * @param {string} issueId - Issue ID
 * @param {string} userId - User ID
 * @param {string} action - Action to check
 * @returns {Promise<Object>} Result with permission status and issue data
 */
const checkPermission = async (issueId, userId, action) => {
  try {
    const issue = await fetchIssueForAuth(issueId);
    
    if (!issue) {
      return { hasPermission: false, issue: null, error: 'ISSUE_NOT_FOUND' };
    }

    const permissions = calculatePermissions(issue, userId);
    const permissionKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;

    return {
      hasPermission: permissions[permissionKey],
      issue,
      permissions,
      error: null
    };
  } catch (error) {
    logError('Permission check failed', error, { issueId, userId, action });
    return { hasPermission: false, issue: null, error: 'DATABASE_ERROR' };
  }
};

module.exports = {
  // Constants
  ERROR_CODES,
  ISSUE_ACTIONS,
  
  // Middleware functions
  checkIssuePermission,
  canViewIssue,
  canEditIssue,
  canMoveIssue,
  canDeleteIssue,
  
  // Helper functions
  calculatePermissions,
  checkPermission,
  fetchIssueForAuth
};