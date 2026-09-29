// Throw `new ApiError(404, "Item not found")` from anywhere in a controller;
// the error-handling middleware (middlewares/error.middleware.js) knows how
// to read statusCode off it. Anything thrown without a statusCode is
// treated as a 500.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

module.exports = ApiError;
