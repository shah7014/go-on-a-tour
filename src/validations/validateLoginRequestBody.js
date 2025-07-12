const { body, validationResult } = require('express-validator');
const { ERRORS } = require('../utils/constants');

const validateLoginRequestBody = [
  body('email')
    .notEmpty()
    .withMessage('User email is a required field')
    .isEmail()
    .withMessage('Email should be in a valid format'),
  body('password')
    .notEmpty()
    .withMessage('Password is a required field')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 chars long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        name: ERRORS.REQUEST_BODY_VALIDATION_ERROR,
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateLoginRequestBody;
