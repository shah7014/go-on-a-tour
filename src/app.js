const express = require('express');
const morgan = require('morgan');
const config = require('config');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Exception!!! 🧨 Shutting down...');
  process.exit(1);
});

// DB connect
const connect = require('./utils/connect');
// Routers
const tourRouter = require('./routes/tourRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
// Middlewares
const globalErrorHandler = require('./middleware/errorHandler');
const validateUser = require('./middleware/validateUser');
// Other imports
const AppError = require('./utils/AppError');

const PORT = config.get('port');

const app = express();

// MIDDLEWARES
if (config.get('environment') === 'development') app.use(morgan('dev'));

app.use(express.json());

// health check route
app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

// ROUTER MOUNTING
app.use('/api/v1/auth', authRouter);
// Token verification middleware should be added before all the protected routes
app.use(validateUser);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 404 for any other routes
app.all('*', (req, res, next) => {
  const appError = new AppError(`Cannot find ${req.url} on this server`, 404);
  next(appError);
});

app.use(globalErrorHandler);

const server = app.listen(PORT, async () => {
  console.log(`Server up and running on PORT ${PORT}`);
  await connect();
});

process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log('Unhandled Rejection!!! 🧨 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
