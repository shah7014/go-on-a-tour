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

const validatePassword = async (user, candiadtePassword) => {
  const isValidPassword = await user.validatePassword(candiadtePassword);
  return isValidPassword;
};

module.exports = {
  registerUser,
  generateAccessToken,
  validatePassword,
};
