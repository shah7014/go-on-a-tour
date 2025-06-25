const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

const getTour = (req, res) => {
  const tourId = Number(req.params.tourId);

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

const createTour = async (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'sccess',
    // data: {
    //   tour: updatedTour,
    // },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    // message: 'Tuur Deleted',
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
