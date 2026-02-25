const { z } = require('zod');
const { sanitizeText } = require('../utils/sanitize');

// ==================== ENUMS ====================

const issueTypeEnum = z.enum(['TASK', 'BUG', 'STORY', 'EPIC', 'FEATURE', 'IMPROVEMENT'], {
  errorMap: () => ({ message: 'Valid issue type is required (TASK, BUG, STORY, EPIC, FEATURE, IMPROVEMENT)' })
});

const issuePriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
  errorMap: () => ({ message: 'Valid priority is required (LOW, MEDIUM, HIGH, CRITICAL)' })
});

// ==================== PARAMS SCHEMAS ====================

/**
 * Schema for validating route parameters with projectId
 */
const projectIssuesParamsSchema = z.object({
  projectId: z.uuid('Invalid project ID format'),
});

/**
 * Schema for validating route parameters with projectId and issueId
 */
const issueParamsSchema = z.object({
  projectId: z.uuid('Invalid project ID format'),
  issueId: z.uuid('Invalid issue ID format'),
});

// ==================== BODY SCHEMAS ====================

/**
 * Schema for creating a new issue
 */
const createIssueSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Issue title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => sanitizeText(val)),
  
  description: z.string()
    .trim()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .nullable()
    .transform(val => {
      if (!val || val === '') return null;
      return sanitizeText(val);
    }),
  
  type: issueTypeEnum,
  
  priority: issuePriorityEnum,
  
  columnId: z.uuid('Invalid column ID format'),
  
  assigneeId: z.string()
    .uuid('Invalid assignee ID format')
    .optional()
    .nullable(),
  
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Invalid due date format')
    .or(z.date({ message: 'Invalid due date format' }))
    .optional()
    .nullable()
    .transform(val => {
      if (!val) return null;
      if (val instanceof Date) return val;
      return new Date(val);
    }),
  
  position: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
    .optional()
});

/**
 * Schema for updating an existing issue
 */
const updateIssueSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => sanitizeText(val))
    .optional(),
  
  description: z.string()
    .trim()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .nullable()
    .transform(val => {
      if (!val || val === '') return null;
      return sanitizeText(val);
    }),
  
  type: issueTypeEnum.optional(),
  
  priority: issuePriorityEnum.optional(),
  
  assigneeId: z.uuid('Invalid assignee ID format')
    .optional()
    .nullable(),
  
  columnId: z.uuid('Invalid column ID format')
    .optional(),
  
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Invalid due date format')
    .or(z.date({ message: 'Invalid due date format' }))
    .optional()
    .nullable()
    .transform(val => {
      if (!val) return null;
      if (val instanceof Date) return val;
      return new Date(val);
    })
});

/**
 * Schema for moving an issue to a different column or position
 */
const moveIssueSchema = z.object({
  columnId: z.uuid('Invalid column ID format'),
  
  newPosition: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
});

// ==================== QUERY SCHEMAS ====================

/**
 * Schema for querying issues with filters and pagination
 */
const getIssuesQuerySchema = z.object({
  // Filters
  columnId: z.uuid('Invalid column ID format')
    .optional(),
  
  assigneeId: z.uuid('Invalid assignee ID format')
    .optional(),
  
  reporterId: z.uuid('Invalid reporter ID format')
    .optional(),
  
  type: issueTypeEnum.optional(),
  
  priority: issuePriorityEnum.optional(),
  
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
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'type'])
    .default('createdAt'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
});

module.exports = {
  // Enums
  issueTypeEnum,
  issuePriorityEnum,
  
  // Params schemas
  projectIssuesParamsSchema,
  issueParamsSchema,
  
  // Body schemas
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
  
  // Query schemas
  getIssuesQuerySchema
};
