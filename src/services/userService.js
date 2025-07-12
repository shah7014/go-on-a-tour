const UserModel = require('../models/userModel');

const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

module.exports = { getAllUsers };
