const { z } = require("zod");

/**
 * Project Validation Schemas
 * 
 * Zod schemas for validating project-related input data.
 */

// Project key must be 2-5 uppercase letters only
const projectKeyRegex = /^[A-Z]{2,5}$/;

/**
 * Schema for creating a new project
 */
const createProjectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less")
    .transform((val) => val.trim()),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-5 uppercase letters (A-Z)")
    .transform((val) => val.toUpperCase().trim()),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .transform((val) => val?.trim() || null)
    .optional()
    .nullable(),
});

/**
 * Schema for updating an existing project
 */
const updateProjectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less")
    .transform((val) => val.trim())
    .optional(),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-5 uppercase letters (A-Z)")
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .transform((val) => val?.trim() || null)
    .optional()
    .nullable(),
});

/**
 * Schema for transferring project ownership
 */
const transferOwnershipSchema = z.object({
  newOwnerId: z.string()
    .uuid("Invalid user ID format"),
});

/**
 * Schema for archiving/restoring projects
 */
const archiveProjectSchema = z.object({
  reason: z.string()
    .max(200, "Reason must be 200 characters or less")
    .optional(),
});

/**
 * Validation middleware factory
 * Creates Express middleware from a Zod schema
 * 
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Request property to validate ('body', 'params', 'query')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    
    // Replace request data with parsed/transformed data
    req[source] = result.data;
    next();
  };
};

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  transferOwnershipSchema,
  archiveProjectSchema,
  projectKeyRegex,
  validate,
};