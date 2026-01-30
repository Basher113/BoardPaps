const { z } = require('zod');

const issueTypeEnum = z.enum(['TASK', 'BUG', 'STORY', 'EPIC'], {
  errorMap: () => ({ message: 'Valid issue type is required (TASK, BUG, STORY, EPIC)' })
});

const issuePriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
  errorMap: () => ({ message: 'Valid priority is required (LOW, MEDIUM, HIGH, CRITICAL)' })
});

const createIssueSchema = z.object({
 
    title: z.string()
      .trim()
      .min(1, 'Issue title is required')
      .max(200, 'Title must be 200 characters or less'),
    description: z.string()
      .trim()
      .max(5000, 'Description must be 5000 characters or less')
      .optional()
      .nullable()
      .transform(val => val === '' ? null : val), // Empty string becomes null
    type: issueTypeEnum,
    priority: issuePriorityEnum,
    columnId: z.string()
      .min(1, 'Column ID is required'),
    assigneeId: z.string()
      .optional()
      .nullable(),
    position: z.number()
      .int('Position must be an integer')
      .nonnegative('Position must be a non-negative integer')
      .optional()
  
});

const updateIssueSchema = z.object({
 
  title: z.string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  description: z.string()
    .trim()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .nullable()
    .transform(val => val === '' ? null : val),
  type: issueTypeEnum.optional(),
  priority: issuePriorityEnum.optional(),
  assigneeId: z.string()
    .optional()
    .nullable()

});

const moveIssueSchema = z.object({
  
    columnId: z.string()
      .min(1, 'Column ID is required'),
    newPosition: z.number()
      .int('Position must be an integer')
      .nonnegative('Position must be a non-negative integer')
  
});

// ==================== QUERY SCHEMAS ====================

const getIssuesQuerySchema = z.object({

  columnId: z.string().optional(),
  assigneeId: z.string().optional(),
  reporterId: z.string().optional(),
  type: issueTypeEnum.optional(),
  priority: issuePriorityEnum.optional()

});

module.exports = {
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
  getIssuesQuerySchema
}