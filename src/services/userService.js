const UserModel = require('../models/userModel');

const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

const findUserByEmail = async (emailId) => {
  //  as password is marked as { select: false } in UserSchema
  //  we need to specify explicitly that we ened the password
  const userQuery = UserModel.findOne({ email: emailId }).select(
    'email +password'
  );
  const userFound = await userQuery;
  return userFound;
};

const findUserById = async (id) => {
  return await UserModel.findById(id);
};

module.exports = { getAllUsers, findUserByEmail, findUserById };
