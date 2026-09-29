// Deliberately dependency-free so the skeleton has no opinions about which
// validation library you'll reach for. Pass a plain function that returns
// an array of error strings (empty array = valid). Swap the internals for
// Zod/Joi/express-validator in a real project — keep the same call shape
// (validate(checkFn)) so routes don't have to change.
//
// Example:
//   const checkCreateItem = (body) => {
//     const errors = [];
//     if (!body.name || typeof body.name !== "string") errors.push("name is required");
//     return errors;
//   };
//   router.post("/", validate(checkCreateItem), createItem);

const ApiError = require("../utils/ApiError");

const validate = (checkFn) => (req, res, next) => {
  const errors = checkFn(req.body || {});
  if (errors && errors.length > 0) {
    return next(new ApiError(400, errors.join(", ")));
  }
  next();
};

module.exports = validate;
