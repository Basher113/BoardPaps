/**
 * Standardized API Response Utility
 * Provides consistent response formats across all endpoints
 */

/**
 * Success response structure
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error response structure
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array|string} errors - Detailed error information
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = Array.isArray(errors) ? errors : [errors];
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response (400)
 * @param {Object} res - Express response object
 * @param {Array|string} errors - Validation errors
 * @param {string} message - Error message
 */
const validationError = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, 400, errors);
};

/**
 * Not found response (404)
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(res, `${resource} not found`, 404);
};

/**
 * Unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401);
};

/**
 * Forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};

/**
 * Created response (201)
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response (204) - for deletions
 * @param {Object} res - Express response object
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Paginated response
 * @param {Object} res - Express response object
 * @param {Array} items - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {string} message - Success message
 */
const paginatedResponse = (res, items, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse
};
