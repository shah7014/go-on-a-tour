const { body, validationResult } = require('express-validator');

const validateNewTourRequestBody = [
  body('name')
    .notEmpty()
    .withMessage('A Tour must have a name')
    .isString()
    .withMessage('Tour name must be a string'),
  body('duration')
    .notEmpty()
    .withMessage('A Tour must have a duration')
    .isInt({ min: 1 })
    .withMessage('A tour duration must be greater than 1'),
  body('maxGroupSize')
    .notEmpty()
    .withMessage('A Tour must have a maxGroupSize')
    .isInt({ min: 1 })
    .withMessage('A tour maxGroupSize must be greater than 1'),
  body('difficulty')
    .notEmpty()
    .withMessage('A Tour must have a difficulty')
    .isString()
    .withMessage('Tour difficulty must be a string'),
  body('price')
    .notEmpty()
    .withMessage('A Tour must have a price')
    .isFloat({ min: 0 })
    .withMessage('A tour price must be greater than 0'),
  body('priceDiscount')
    .isFloat({ min: 0 })
    .withMessage('Discount Price must be greater that 0')
    .custom((input, { req }) => {
      if (input >= req.body.price) {
        throw new Error(
          `Discounted Price of ${input} should be less than that of MRP of ${req.body.price}`
        );
      }
      return true;
    }),
  body('summary')
    .notEmpty()
    .withMessage('A Tour must have a summary')
    .isString()
    .withMessage('Tour summary must be a string'),
  body('imageCover')
    .notEmpty()
    .withMessage('A Tour must have a imageCover')
    .isString()
    .withMessage('Tour imageCover must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateNewTourRequestBody;
