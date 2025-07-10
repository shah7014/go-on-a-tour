const asyncHandler = (handler) => (req, res, next) => {
  handler(req, res, next).catch((err) => next(err));
};

module.exports = asyncHandler;
