const { z } = require('zod');
const { sanitizeText } = require('../utils/sanitize');

const createColumnSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Column name is required')
    .max(50, 'Column name must be 50 characters or less')
    .transform((val) => sanitizeText(val)),
  position: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
    .optional(),

});

const updateColumnSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Column name cannot be empty')
    .max(50, 'Column name must be 50 characters or less')
    .transform((val) => sanitizeText(val))
    .optional(),
  position: z.number()
    .int('Position must be an integer')
    .nonnegative('Position must be a non-negative integer')
    .optional(),

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
