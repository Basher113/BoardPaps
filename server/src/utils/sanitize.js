/**
 * HTML sanitization utilities for safe content rendering
 * Prevents XSS attacks using sanitize-html library
 */

const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize text by removing ALL HTML tags and attributes
 * Use this for input sanitization in validation schemas
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string with no HTML
 */
const sanitizeText = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return sanitizeHtml(str, {
    allowedTags: [],          // No HTML tags allowed
    allowedAttributes: {},    // No attributes allowed
    disallowedTagsMode: 'discard',  // Remove tags completely
  }).trim();
};

/**
 * Sanitize text but allow basic formatting tags
 * Use this for rich text fields where some formatting is desired
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string with basic formatting allowed
 */
const sanitizeRichText = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return sanitizeHtml(str, {
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'ul', 'ol', 'li'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  }).trim();
};

/**
 * Escape HTML special characters for safe insertion into HTML attributes
 * Use this for output sanitization in email templates and HTML responses
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML
 */
const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  const htmlEscapes = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=/]/g, char => htmlEscapes[char]);
};

/**
 * Escape HTML and preserve line breaks for email content
 * @param {string} str - String to escape
 * @returns {string} Escaped string with line breaks converted to <br>
 */
const escapeHtmlForEmail = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return escapeHtml(str)
    .replace(/\n/g, '<br>')
    .replace(/\r\n/g, '<br>');
};

/**
 * Truncate string safely for display
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
const truncateSafe = (str, maxLength = 100) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 * @param {string} url - URL to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => trimmed.startsWith(protocol))) {
    return null;
  }
  
  // Allow http, https, mailto, tel, and relative URLs
  return url.trim();
};

module.exports = {
  sanitizeText,
  sanitizeRichText,
  escapeHtml,
  escapeHtmlForEmail,
  truncateSafe,
  sanitizeUrl,
};
