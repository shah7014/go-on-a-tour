const { body, validationResult } = require('express-validator');
const { ERRORS } = require('../utils/constants');

const validateNewUserRequestBody = [
  body('name')
    .notEmpty()
    .withMessage('Name is a required field')
    .isLength({ min: 3 })
    .withMessage('Name must be atleast 3 chars long'),
  body('email')
    .notEmpty()
    .withMessage('Email is a required field')
    .isEmail()
    .withMessage('Email should be in a valid format'),
  body('password')
    .notEmpty()
    .withMessage('Password is a required field')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 chars long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm Password is a required field')
    .custom(function (value, { req }) {
      if (value !== req.body.password) {
        throw new Error('Password and confirm Passwords should be same');
      }
      return true;
    }),
  body('photo')
    .optional() // its an optional field
    .isString() // must be a String if present
    .withMessage('Photo should be of type string'),
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

module.exports = validateNewUserRequestBody;
