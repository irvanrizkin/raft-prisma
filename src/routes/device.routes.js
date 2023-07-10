const DeviceController = require("../controllers/DeviceController");
const router = require('express').Router();

const deviceController = new DeviceController();

router.get('/', deviceController.index);

router.post('/', deviceController.create);

module.exports = router;
