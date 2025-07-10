const config = require('config');

const sendErrorDev = (err, res) => {
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
    // 1) Log Error for us developers
    console.error('ERROR 🧨', err);
    // 2) send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log({ err });
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const environment = config.get('environment');

  if (environment === 'development') {
    sendErrorDev(err, res);
  } else if (environment === 'production') {
    sendErrorProd(err, res);
  }
};
