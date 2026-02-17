const { z } = require('zod');

const createColumnSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Column name is required')
    .max(50, 'Column name must be 50 characters or less'),
  position: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
    .optional(),
  wipLimit: z.number()
    .int('WIP limit must be an integer')
    .nonnegative('WIP limit must be a non-negative integer')
    .max(100, 'WIP limit cannot exceed 100')
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FFFFFF)')
    .optional()
    .nullable()
});

const updateColumnSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Column name cannot be empty')
    .max(50, 'Column name must be 50 characters or less')
    .optional(),
  position: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
    .optional(),
  wipLimit: z.number()
    .int('WIP limit must be an integer')
    .nonnegative('WIP limit must be a non-negative integer')
    .max(100, 'WIP limit cannot exceed 100')
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FFFFFF)')
    .optional()
    .nullable()
});

const reorderColumnsSchema = z.object({
  columnOrders: z.array(
    z.object({
      id: z.string().min(1, 'Column ID is required'),
      position: z.number()
        .int('Position must be an integer')
        .nonnegative('Position must be a non-negative integer')
    })
  ).min(1, 'At least one column order is required')
});

module.exports = {
  createColumnSchema,
  updateColumnSchema,
  reorderColumnsSchema
};
