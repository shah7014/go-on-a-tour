const express = require('express');
const tourController = require('../controllers/tourController');
const validateNewTourRequestBody = require('../validations/validateNewTourRequestBody');

const router = express.Router();

// router.param('tourId', tourController.checkId);

// Aliasaing a route for top-5-checpeaset-tours
// this is a coomon requirement to get this result
// so instead of user manually typing the query, we can create a middleware that will add to query params
// and then go to getAllTours
router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopFiveCheapestTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(validateNewTourRequestBody, tourController.createTour);

router
  .route('/:tourId')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
