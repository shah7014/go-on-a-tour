const lodash = require('lodash');
const config = require('config');
const UserModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');

const registerUser = async (newUser) => {
  const user = await UserModel.create({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
  });
  return lodash.pick(user, ['_id', 'name', 'email']);
};

const generateAccessToken = (payload) => {
  const accessToken = jwtUtils.generateAccessToken(payload);
  return accessToken;
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

const validatePassword = async (user, candiadtePassword) => {
  const isValidPassword = await user.validatePassword(candiadtePassword);
  return isValidPassword;
};

module.exports = {
  registerUser,
  generateAccessToken,
  findUserByEmail,
  validatePassword,
};
