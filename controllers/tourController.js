const { body, validationResult } = require('express-validator');

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

const validateNewTour = [
  body('name')
    .notEmpty()
    .withMessage('A Tour must have a name')
    .isString()
    .withMessage('Tour name must be a string'),
  body('duration')
    .notEmpty()
    .withMessage('A Tour must have a duration')
    .isInt({ min: 1 })
    .withMessage('A tour duration must be greater than 1'),
  body('maxGroupSize')
    .notEmpty()
    .withMessage('A Tour must have a maxGroupSize')
    .isInt({ min: 1 })
    .withMessage('A tour maxGroupSize must be greater than 1'),
  body('difficulty')
    .notEmpty()
    .withMessage('A Tour must have a difficulty')
    .isString()
    .withMessage('Tour difficulty must be a string'),
  body('price')
    .notEmpty()
    .withMessage('A Tour must have a price')
    .isFloat({ min: 0 })
    .withMessage('A tour price must be greater than 0'),
  body('summary')
    .notEmpty()
    .withMessage('A Tour must have a summary')
    .isString()
    .withMessage('Tour summary must be a string'),
  body('imageCover')
    .notEmpty()
    .withMessage('A Tour must have a imageCover')
    .isString()
    .withMessage('Tour imageCover must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array(),
      });
    }
    next();
  },
];

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

// const getTourStats = async (req, res) => {
//   try {
//     const tours = await Tour.aggregate([
//       {
//         $match: { ratingsAverage: { $gte: 4.5 } },
//       },
//       {
//         $group: {
//           _id: { $toUpper: '$difficulty' },
//           count: { $sum: 1 },
//           numRatings: { $sum: '$ratingsQuantity' },
//           avgRatings: { $avg: '$ratingsAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: '$price' },
//         },
//       },
//       {
//         $sort: {
//           avgPrice: 1,
//         },
//       },
//     ]);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tours,
//       },
//     });
//   } catch (error) {
//     console.log(`ERROR 🧨`, error);
//     res.status(400).json({
//       status: 'fail',
//       message: 'Something went wrong!!!',
//     });
//   }
// };

const getTourStats = async (req, res) => {
  const tourStats = await Tour.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
        avgRating: { $min: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      tourStats,
    },
  });
};

const getMonthlyPlan = async (req, res) => {
  const year = Number(req.params.year);
  try {
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
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
  validateNewTour,
};
