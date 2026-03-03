const { z } = require("zod");

/**
 * Project Validation Schemas
 * 
 * Zod schemas for validating project-related input data.
 */

// Project key must be 2-6 uppercase letters and numbers only
const projectKeyRegex = /^[A-Z0-9]{2,6}$/;

/**
 * Schema for creating a new project
 */
const createProjectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-6 uppercase letters (A-Z) and numbers only.")
    .transform((val) => val.toUpperCase().trim()),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
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
    .optional(),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-6 uppercase letters (A-Z) and numbers only.")
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .nullable(),
});

/**
 * Schema for transferring project ownership
 */
const transferOwnershipSchema = z.object({
  newOwnerId: z.uuid("Invalid user ID format"),
});

/**
 * Validation middleware factory
 * Creates Express middleware from a Zod schema
 * 
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Request property to validate ('body', 'params', 'query')
 */


module.exports = {
  createProjectSchema,
  updateProjectSchema,
  transferOwnershipSchema,
  projectKeyRegex,
};