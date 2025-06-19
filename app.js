const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const morgan = require('morgan');
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use(async (req, res, next) => {
  const logItem = `${uuid()}\t${req.method}\t${req.url}\t${format(
    new Date(),
    'yyyy-MM-dd/HH:mm:ss'
  )}\n`;
  fs.appendFile(
    path.join(__dirname, 'logs', 'request-logs.txt'),
    logItem,
    (err) => {
      if (err) throw err;
      next();
    }
  );
});

// ROUTER MOUNTING
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

module.exports = app;
