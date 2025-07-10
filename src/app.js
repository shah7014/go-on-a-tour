const express = require('express');
const morgan = require('morgan');
const config = require('config');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const connect = require('./utils/connect');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

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
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 404 for any other routes
app.all('*', (req, res, next) => {
  const appError = new AppError(`Cannot find ${req.url} on this server`, 404);
  next(appError);
});

app.use(globalErrorHandler);

app.listen(PORT, async () => {
  console.log(`Server up and running on PORT ${PORT}`);
  await connect();
});
