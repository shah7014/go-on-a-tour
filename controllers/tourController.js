const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: {
        results: tours.length,
        tours,
      },
    });
  } catch (error) {
    console.log(`ERROR 🧨`, error);
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong!!!',
    });
  }
};

const getTour = async (req, res) => {
  const tourId = req.params.tourId;
  try {
    const tour = await Tour.findById(tourId);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(`ERROR 🧨`, error);
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong!!!',
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    console.log(`ERROR 🧨`, error);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.tourId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    console.log(`ERROR 🧨`, error);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    await Tour.findByIdAndDelete(tourId);
    res.status(204).json({
      status: 'success',
      message: 'Deleted Successfully',
    });
  } catch (error) {
    console.log(`ERROR 🧨`, error);
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong!!!',
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
