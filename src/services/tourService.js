const TourModel = require('../models/tourModel');

const getTourStats = async () => {
  try {
    const stats = await TourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRatings: { $avg: '$ratingsAverage' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $set: {
          avgPrice: { $round: ['$avgPrice', 2] },
          avgRatings: { $round: ['$avgRatings', 2] },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);
    return stats;
  } catch (error) {
    throw error;
  }
};

const getNumberOfToursByMonth = async (year) => {
  try {
    const numberOfToureByMonth = await TourModel.aggregate([
      {
        // flatten startDates
        $unwind: '$startDates',
      },
      {
        // filter dates within a year range
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        // group by month and calculate numberOfTours for each month
        // and push tour names inot an array
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          tours: { $push: '$name' },
        },
      },
      {
        // rename the _id fied to month and remove it
        // round the avg price
        $project: {
          _id: 0,
          month: '$_id',
          avgPrice: { $round: ['$avgPrice', 2] },
          numTours: 1,
          tours: 1,
        },
      },
      {
        $set: {
          month: {
            $arrayElemAt: [
              [
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
                'NOV',
                'DEC',
              ],
              { $subtract: ['$month', 1] },
            ],
          },
        },
      },
      {
        // sort in descending order by numOfTours
        $sort: {
          numTours: -1,
        },
      },
    ]);
    return numberOfToureByMonth;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTourStats,
  getNumberOfToursByMonth,
};
