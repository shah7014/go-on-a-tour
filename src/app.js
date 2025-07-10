const express = require('express');
const morgan = require('morgan');
const config = require('config');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const connect = require('./utils/connect');

const PORT = config.get('port');

const app = express();

// MIDDLEWARES
if (config.get('environment') === 'DEVELOPEMNT') app.use(morgan('dev'));

app.use(express.json());

// ROUTER MOUNTING
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, async () => {
  console.log(`Server up and running on PORT ${PORT}`);
  await connect();
});
