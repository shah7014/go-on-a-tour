const asyncHandler = require('../utils/asyncHandler');
const UserService = require('../services/userService');

const getAllUsersHandler = asyncHandler(async (req, res, next) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = { getAllUsersHandler };
