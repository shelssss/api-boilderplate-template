// Mounted after every route, before the error-handling middleware. Turns
// "no route matched" into a normal error so it flows through the same
// single error-handling seam as everything else.

const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
