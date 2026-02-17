const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

/**
 * Rate limiter for sending invitations
 * Limits the number of invitations a user can send per hour
 */
const invitationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.INVITATION_RATE_LIMIT || '5'),
  message: {
    success: false,
    message: 'Too many invitations sent. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID as key if authenticated, otherwise fall back to default IP-based key
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    // Fall back to default behavior (uses req.ip internally)
    return ipKeyGenerator(req.ip);
  },
});

/**
 * Rate limiter for invitation actions (accept/decline)
 * Limits the number of accept/decline actions per hour
 */
const invitationActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.INVITATION_ACCEPT_RATE_LIMIT || '10'),
  message: {
    success: false,
    message: 'Too many actions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID as key if authenticated, otherwise fall back to default IP-based key
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    // Fall back to default behavior (uses req.ip internally)
    return ipKeyGenerator(req.ip);
  },
});

/**
 * Rate limiter for project creation
 * Limits the number of projects a user can create per hour
 */
const projectCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.PROJECT_CREATE_RATE_LIMIT || '10'),
  message: {
    success: false,
    message: 'Too many projects created. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    return ipKeyGenerator(req.ip);
  },
});

/**
 * Rate limiter for project actions (update/delete)
 * Limits the number of project modifications per hour
 */
const projectActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.PROJECT_ACTION_RATE_LIMIT || '30'),
  message: {
    success: false,
    message: 'Too many actions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    return ipKeyGenerator(req.ip);
  },
});

/**
 * General API rate limiter
 * Applied globally to all routes
 * Increased limit for kanban board usage (drag/drop operations)
 */
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.GLOBAL_RATE_LIMIT || '500'), // 500 requests per 15 minutes (default)
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID as key if authenticated for more accurate limiting
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    // Fall back to IP-based key for unauthenticated requests
    return ipKeyGenerator(req.ip);
  },
});

module.exports = {
  invitationLimiter,
  invitationActionLimiter,
  projectCreateLimiter,
  projectActionLimiter,
  globalApiLimiter,
};
