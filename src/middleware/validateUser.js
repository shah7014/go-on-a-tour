const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { verifyAccessToken, generateAccessToken } = require('../utils/jwtUtils');
const userService = require('../services/userService');

// 1) Validate if token is present in the header or not
// 2) verify the token
// 3) User for which token was issued, is he still present in DB?
// 4) is the password modified for that user after the token is issued?

const validateUser = asyncHandler(async (req, res, next) => {
  // 1) GET TOKEN FROM HEADER
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('Unauthenticated User', 401));
  }
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader.split(' ')[1];
  // 2) verify access token
  const { decoded, isValid, isExpired } = await verifyAccessToken(token);
  console.log({ decoded, isValid, isExpired });

  // This could be done if we are using a refresh token also along with an access token
  // if (isExpired) {
  //   const newToken = generateAccessToken(decoded);
  //   res.header('x-access-token', newToken);
  //   return next();
  // }
  if (!isValid) {
    return next(new AppError('Unauthorized access', 403));
  }
  // 3) is user present or not for whom the token was issued for?
  const userFound = await userService.findUserById(decoded.id);
  if (!userFound) {
    return next(new AppError('Unauthorized access', 403));
  }

  // 4) is password changed after the time token was issued
  return next();
});

module.exports = validateUser;
