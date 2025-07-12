const express = require('express');

const validateNewUserRequestBody = require('../validations/validateNewUserRequestBody');
const validateLoginRequestBody = require('../validations/validateLoginRequestBody');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  validateNewUserRequestBody,
  authController.registerUserHandler
);

router.post(
  '/login',
  validateLoginRequestBody,
  authController.loginUserHandler
);

module.exports = router;
