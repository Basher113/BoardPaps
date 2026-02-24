const { z } = require("zod");
const { sanitizeText } = require("../utils/sanitize");

/**
 * Project Validation Schemas
 * 
 * Zod schemas for validating project-related input data.
 * Includes XSS sanitization for all text fields.
 */

// Project key must be 2-5 uppercase letters only
const projectKeyRegex = /^[A-Z0-9]{2,5}$/;

/**
 * Schema for creating a new project
 */
const createProjectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less")
    .transform((val) => sanitizeText(val)),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-5 uppercase letters (A-Z) and numbers only.")
    .transform((val) => val.toUpperCase().trim()),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .transform((val) => val ? sanitizeText(val) : null)
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
    .transform((val) => sanitizeText(val))
    .optional(),
  
  key: z.string()
    .regex(projectKeyRegex, "Project key must be 2-5 uppercase letters (A-Z)")
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  
  description: z.string()
    .max(500, "Description must be 500 characters or less")
    .transform((val) => val ? sanitizeText(val) : null)
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