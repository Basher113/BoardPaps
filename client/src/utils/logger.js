/**
 * Development-only logging utility
 * Prevents sensitive information from being logged in production
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  
  /**
   * Log API errors with sanitized output
   * Only logs in development, and strips potentially sensitive data
   */
  apiError: (context, error) => {
    if (isDev) {
      // Sanitize error to remove sensitive fields
      const sanitizedError = {
        context,
        message: error?.data?.message || error?.message || 'Unknown error',
        status: error?.status,
      };
      console.error('[API Error]', sanitizedError);
    }
  },
};

export default logger;
