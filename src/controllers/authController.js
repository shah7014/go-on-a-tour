const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const userService = require('../services/userService');
const AppError = require('../utils/AppError');

const registerUserHandler = asyncHandler(async (req, res, next) => {
  const user = await authService.registerUser(req.body);
  const accessToken = authService.generateAccessToken({ id: user['_id'] });
  res.status(201).json({
    status: 'success',
    token: accessToken,
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
});

const loginUserHandler = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userFound = await userService.findUserByEmail(email);
  if (!userFound) {
    return next(new AppError('Invalid User Credentials', 401));
  }
  const isValidPassword = await authService.validatePassword(
    userFound,
    password
  );
  if (!isValidPassword) {
    return next(new AppError('Invalid User Credentials', 401));
  }
  const accessToken = authService.generateAccessToken({ id: userFound['_id'] });
  res.status(200).json({
    status: 'success',
    data: {
      token: accessToken,
    },
  });
});

module.exports = { registerUserHandler, loginUserHandler };
