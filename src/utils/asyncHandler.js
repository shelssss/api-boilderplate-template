// Wrap every async controller function in this so a rejected promise or a
// thrown error lands in next(error) — and therefore in the single
// error-handling middleware — instead of crashing the process or hanging
// the request. Usage: router.get("/", asyncHandler(getItems));

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
