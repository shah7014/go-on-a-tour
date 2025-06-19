const fs = require('node:fs');
const path = require('node:path');

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json')
  )
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

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
