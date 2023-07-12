const MeasurementController = require("../controllers/MeasurementController");
const router = require('express').Router();

const measurementController = new MeasurementController();

router.get('/:id', measurementController.indexByDevice);

router.get('/:id/daily', measurementController.getDailyAverageByDevice);

router.get('/:id/weekly', measurementController.getWeeklyAverageByDevice);

router.post('/', measurementController.create);

module.exports = router;
