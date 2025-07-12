const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { verifyAccessToken, generateAccessToken } = require('../utils/jwtUtils');

const validateUser = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    return next(new AppError('Unauthenticated User', 401));
  }
  const token = authorizationHeader.split(' ')[1];
  const { decoded, isValid, isExpired } = await verifyAccessToken(token);

  // This could be done if we are using a refresh token also along with an access token
  // if (isExpired) {
  //   const newToken = generateAccessToken(decoded);
  //   res.header('x-access-token', newToken);
  //   return next();
  // }
  if (!isValid) {
    return next(new AppError('Unauthorized access', 403));
  }
  return next();
});

module.exports = validateUser;
