const { z } = require('zod');

// ==================== PARAMS SCHEMAS ====================

/**
 * Schema for validating route parameters with projectId and issueId
 */
const issueCommentParamsSchema = z.object({
  projectId: z.uuid('Invalid project ID format'),
  issueId: z.uuid('Invalid issue ID format'),
});

/**
 * Schema for validating route parameters with projectId, issueId, and commentId
 */
const commentParamsSchema = z.object({
  projectId: z.uuid('Invalid project ID format'),
  issueId: z.uuid('Invalid issue ID format'),
  commentId: z.uuid('Invalid comment ID format'),
});

// ==================== BODY SCHEMAS ====================

/**
 * Schema for creating a new comment
 */
const createCommentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Comment content is required')
    .max(5000, 'Comment must be 5000 characters or less'),
});

/**
 * Schema for updating an existing comment
 */
const updateCommentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Comment content cannot be empty')
    .max(5000, 'Comment must be 5000 characters or less'),
});

// ==================== QUERY SCHEMAS ====================

/**
 * Schema for querying comments with pagination
 */
const getCommentsQuerySchema = z.object({
  // Pagination
  page: z.coerce
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(50),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt'])
    .default('createdAt'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .default('asc'), // Oldest first for comments
});

module.exports = {
  // Params schemas
  issueCommentParamsSchema,
  commentParamsSchema,
  
  // Body schemas
  createCommentSchema,
  updateCommentSchema,
  
  // Query schemas
  getCommentsQuerySchema,
};
