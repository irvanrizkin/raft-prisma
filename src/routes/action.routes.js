const ActionController = require("../controllers/ActionController");
const router = require('express').Router();

const actionController = new ActionController();

router.get('/valve/:id/flow/:flow', actionController.openValve);

router.get('/read/:id', actionController.readSensor);

module.exports = router;
