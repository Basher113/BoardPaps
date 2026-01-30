const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.issues[0]?.message || "Validation failed",
      details: result.error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  req.body = result.data;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.issues[0]?.message || "Invalid query parameters",
      details: result.error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  req.query = result.data;
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.issues[0]?.message || "Invalid route parameters",
      details: result.error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  req.params = result.data;
  next();
};

module.exports = {validateBody, validateQuery, validateParams};