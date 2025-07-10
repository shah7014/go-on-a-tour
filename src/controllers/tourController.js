const tourService = require('../services/tourService');
const Tour = require('../models/tourModel');
const ApiUtils = require('../utils/ApiUtils');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

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

const getAllTours = asyncHandler(async (req, res, next) => {
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
});

const getTour = asyncHandler(async (req, res, next) => {
  const tourId = req.params.tourId;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('Tour Not Found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const createTour = asyncHandler(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = asyncHandler(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.tourId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateTour) {
    return next(new AppError('Tour Not Found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

const deleteTour = asyncHandler(async (req, res, next) => {
  const tourId = req.params.tourId;
  const tour = await Tour.findByIdAndDelete(tourId);
  if (!tour) {
    return next(new AppError('Tour Not Found', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Deleted Successfully',
  });
});

const getTourStats = asyncHandler(async (req, res, next) => {
  const stats = await tourService.getTourStats();
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// how many tours start within the month of the given year
const getMonthlyPlan = asyncHandler(async (req, res, next) => {
  const year = req.params.year;
  const toursByMonth = await tourService.getNumberOfToursByMonth(year);
  res.status(200).json({
    status: 'success',
    data: {
      toursByMonth,
    },
  });
});

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
