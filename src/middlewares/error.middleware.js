// The one seam every error passes through. Mounted LAST in app.js, after
// every route. Every endpoint returns errors in this same shape, so there
// is exactly one place to change that shape.
//
// NODE_ENV-aware on purpose: a common gap in quick-start APIs is returning
// raw error.message (or a stack trace) straight to the client in
// production, which can leak internal detail. Here, production always gets
// a generic message unless the error was explicitly created as an
// ApiError with a safe, intentional message.

const { NODE_ENV } = require("../config/env");

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const isTrustedError = err.name === "ApiError";

  const payload = {
    success: false,
    error:
      isTrustedError || NODE_ENV !== "production"
        ? err.message
        : "Something went wrong.",
  };

  if (NODE_ENV !== "production" && !isTrustedError) {
    payload.stack = err.stack;
  }

  if (NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
