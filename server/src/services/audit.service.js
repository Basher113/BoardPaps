const { logInfo, logError } = require("../lib/logger");
const prisma = require("../lib/prisma");

/**
 * Audit Service
 * 
 * Provides structured audit logging for sensitive operations.
 * All audit logs are persisted to the database and logged to Winston.
 */

// Action types for audit logging (matches Prisma enum)
const AUDIT_ACTIONS = {
  // Project actions
  PROJECT_CREATED: 'PROJECT_CREATED',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
  PROJECT_DELETED: 'PROJECT_DELETED',
  PROJECT_ARCHIVED: 'PROJECT_ARCHIVED',
  PROJECT_RESTORED: 'PROJECT_RESTORED',
  OWNERSHIP_TRANSFERRED: 'OWNERSHIP_TRANSFERRED',
  
  // Member actions
  MEMBER_ROLE_CHANGED: 'MEMBER_ROLE_CHANGED',
  MEMBER_REMOVED: 'MEMBER_REMOVED',
  MEMBER_LEFT: 'MEMBER_LEFT',
  
  // Invitation actions
  INVITATION_CREATED: 'INVITATION_CREATED',
  INVITATION_ACCEPTED: 'INVITATION_ACCEPTED',
  INVITATION_DECLINED: 'INVITATION_DECLINED',
  INVITATION_CANCELLED: 'INVITATION_CANCELLED',
  INVITATION_RESENT: 'INVITATION_RESENT',
};

/**
 * Create an audit log entry
 * 
 * @param {string} action - The action type from AUDIT_ACTIONS
 * @param {object} details - Audit details
 * @param {string} details.userId - ID of the user performing the action
 * @param {string} details.projectId - ID of the project (if applicable)
 * @param {string} details.targetType - Type of target (PROJECT, PROJECT_MEMBER, INVITATION, etc.)
 * @param {string} details.targetId - ID of the target object
 * @param {object} details.metadata - Additional context-specific data
 */
const auditLog = async (action, details) => {
  try {
    const { userId, projectId, targetType, targetId, metadata } = details;
    
    // Create database record
    const auditRecord = await prisma.auditLog.create({
      data: {
        action,
        userId,
        projectId,
        targetType,
        targetId,
        metadata,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });
    
    // Also log to Winston for file/console output
    logInfo(`AUDIT: ${action}`, {
      auditId: auditRecord.id,
      userId,
      projectId,
      targetType,
      targetId,
      metadata,
      timestamp: auditRecord.createdAt.toISOString(),
    });
    
    return auditRecord;
  } catch (error) {
    // Log error but don't throw - audit logging should not break operations
    logError('Audit logging error', error);
    console.error('Audit logging error:', error);
    return null;
  }
};

/**
 * Get audit logs for a project
 * 
 * @param {string} projectId - Project ID to get logs for
 * @param {object} options - Query options
 * @param {number} options.limit - Maximum number of logs to return (default: 50)
 * @param {number} options.offset - Offset for pagination (default: 0)
 * @param {string} options.action - Filter by action type
 * @param {string} options.userId - Filter by user ID
 */
const getProjectAuditLogs = async (projectId, options = {}) => {
  try {
    const { limit = 50, offset = 0, action, userId } = options;
    
    const where = { projectId };
    if (action) where.action = action;
    if (userId) where.userId = userId;
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, email: true, avatar: true }
          }
        }
      }),
      prisma.auditLog.count({ where })
    ]);
    
    return { logs, total };
  } catch (error) {
    logError('Get audit logs error', error);
    return { logs: [], total: 0 };
  }
};

/**
 * Get audit logs for a user
 * 
 * @param {string} userId - User ID to get logs for
 * @param {object} options - Query options
 * @param {number} options.limit - Maximum number of logs to return
 * @param {number} options.offset - Offset for pagination
 */
const getUserAuditLogs = async (userId, options = {}) => {
  try {
    const { limit = 50, offset = 0 } = options;
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: { id: true, name: true, key: true }
          }
        }
      }),
      prisma.auditLog.count({ where: { userId } })
    ]);
    
    return { logs, total };
  } catch (error) {
    logError('Get user audit logs error', error);
    return { logs: [], total: 0 };
  }
};

module.exports = {
  auditLog,
  getProjectAuditLogs,
  getUserAuditLogs,
  AUDIT_ACTIONS,
};