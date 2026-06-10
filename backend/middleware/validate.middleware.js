const { assertObjectId } = require("../utils/validate");

function validateObjectIdParam(paramName = "id", label = "Resource") {
  return (req, _res, next) => {
    try {
      assertObjectId(req.params[paramName], label);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { validateObjectIdParam };
