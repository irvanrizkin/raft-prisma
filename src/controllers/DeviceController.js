const Controller = require("./Controller");

class DeviceController extends Controller {
  constructor() {
    super();
  }

 index = async (req, res, next) => {
  try {
    const devices = await this.prisma.device.findMany();
    return this.sendResponse(
      res,
      200,
      'device retrieved successfully', 
      devices
    );
  } catch (error) {
    next(error);
  }
 }
 
 create = async (req, res, next) => {
    const {
      id, name, thingerUrl, thingerBearer
    } = req.body;

    try {
      const device = await this.prisma.device.create({
        data: {
          id, name, thingerUrl, thingerBearer
        },
      });
      return this.sendResponse(
        res,
        200,
        'device created successfully',
        device,
      )
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeviceController;
