const mqttInstance = require("../services/MqttSingleton");
const CustomError = require("../utils/CustomError");
const Controller = require("./Controller");

class DeviceController extends Controller {
  constructor() {
    super();
  }

 index = async (req, res, next) => {
  try {
    const devices = await this.prisma.device.findMany({
      orderBy: {
        name: 'asc',
      }
    });
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
      mqttInstance.subscribeAll();
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

  destroy = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const device = await this.prisma.device.findUnique({
        where: { id },
      })

      if (!device) throw new CustomError('device not found', 404);

      const result = await this.prisma.device.delete({
        where: { id },
      })
      mqttInstance.subscribeAll();
      return this.sendResponse(
        res,
        204,
        'device deleted successfully',
        null,
      )
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeviceController;
