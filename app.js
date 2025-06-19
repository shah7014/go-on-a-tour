const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const morgan = require('morgan');
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');

const app = express();

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

const toursRouter = express.Router();
app.use('/api/v1/tours', toursRouter);

const usersRouter = express.Router();
app.use('/api/v1/users', usersRouter);

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'))
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tourId = Number(req.params.tourId);
  if (tourId < tours.length && tourId >= 0) {
    const tour = tours.find((t) => t.id === tourId);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not Found',
    });
  }
};

const createTour = (req, res) => {
  const newTour = { ...req.body, id: tours.length };
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

const updateTour = (req, res) => {
  const updatedTour = { ...req.body, id: Number(req.params.tourId) };
  res.status(200).json({
    sttaus: 'sccess',
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  const tourId = Number(req.params.tourId);
  res.status(204).json({
    status: 'success',
    message: 'Tuur Deleted',
  });
};

toursRouter.route('/').get(getAllTours).post(createTour);

toursRouter.route('/:tourId').get(getTour).patch(updateTour).delete(deleteTour);

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `its not implemented yet`,
  });
};

const getUser = (req, res) => {
  res.sttaus(500).json({
    status: 'error',
    message: `${req.url} not implemented yet`,
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `its not implemented yet`,
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `its not implemented yet`,
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `its not implemented yet`,
  });
};

usersRouter.route('/').get(getAllUsers).post(createUser);

usersRouter.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

app.listen(3000, () => {
  console.log('Server started on PORT 3000');
});
