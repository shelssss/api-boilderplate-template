// Runs before the router so obviously-bad traffic is rejected cheaply,
// before it costs a database round-trip. helmet = security headers,
// express-rate-limit = per-IP request budget. Swap express-rate-limit for
// Arcjet, a cloud WAF, or an API-gateway policy later if you want bot
// detection on top of plain rate limiting — the position in the pipeline
// (right here, before routing) matters more than the specific product.

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require("../config/env");

const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." },
});

module.exports = { helmetMiddleware: helmet(), rateLimiter };
