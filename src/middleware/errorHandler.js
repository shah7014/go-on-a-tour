const config = require('config');

const AppError = require('../utils/AppError');
const { ERRORS } = require('../utils/constants');

const getCastErrorAsAppError = (err) => {
  let message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const getDuplicateKeyErrorAsAppError = (err) => {
  let message = 'Duplicate field value';
  return new AppError(message, 400);
};

const getSchemaValidationErrorAsAppError = (err) => {
  let messageFromValidations = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  let message = `Invalid Data. ${messageFromValidations}`;
  return new AppError(message, 400);
};

const getAsRequestBodyValidationError = (err) => {
  let messageFromValidations = Object.values(err.errors)
    .map((el) => el.msg)
    .join('. ');
  let message = `Invalid Data. ${messageFromValidations}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  console.log('ERROR 🧨', err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // this checks whether the error is AppError or not really
  // if its not AppError then its some unexpected error
  // not handled by us
  // so not to expose internal app stuff we just send a very generic message for them
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log Error for us developers. this will be present on the console of our hosting service
    console.error('ERROR 🧨', err);
    // 2) send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.error('ERROR 🧨', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const environment = config.get('environment');

  let error = { ...err };

  // Handle Mongoose errors and make them as AppError
  if (err.name === 'CastError') {
    error = getCastErrorAsAppError(err);
  }
  if (err.code === 11000) {
    error = getDuplicateKeyErrorAsAppError(err);
  }
  if (err.name === 'ValidationError') {
    error = getSchemaValidationErrorAsAppError(err);
  }
  if (err.name === ERRORS.REQUEST_BODY_VALIDATION_ERROR) {
    error = getAsRequestBodyValidationError(err);
  }

  // Environmentwise error handling
  if (environment === 'development') {
    sendErrorDev(error, res);
  } else if (environment === 'production') {
    // CastError => new AppError("", 400)
    // ValidationError => new AppError("", 400)
    sendErrorProd(error, res);
  }
};
