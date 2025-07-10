const tourService = require('../services/tourService');
const Tour = require('../models/tourModel');
const ApiUtils = require('../utils/ApiUtils');

const aliasTopFiveCheapestTours = (req, res, next) => {
  req.query = {
    limit: 5,
    sort: '-ratingsAverage,price',
    fields: 'name,price,difficulty,ratingsAverage,summary',
  };
  next();
};

// For Filtering
// 1) we need to be able to see what is for filter and what is not so things like page, sort,
// limit should be ignored
// 2) also how can we filter for operators like lte, gte, lt and gt

const getAllTours = async (req, res) => {
  try {
    const toursQuery = new ApiUtils(Tour, req.query)
      .filter()
      .sort()
      .select()
      .paginate().mongooseQuery;
    const tours = await toursQuery;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
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

const getTourStats = async (req, res) => {
  try {
    const stats = await tourService.getTourStats();
    res.status(200).json({
      status: 'success',
      data: {
        stats,
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

// how many tours start within the month of the given year
const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const toursByMonth = await tourService.getNumberOfToursByMonth(year);
    res.status(200).json({
      status: 'success',
      data: {
        toursByMonth,
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

module.exports = {
  getMonthlyPlan,
  getTourStats,
  aliasTopFiveCheapestTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
