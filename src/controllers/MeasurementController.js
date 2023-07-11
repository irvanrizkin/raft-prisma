const CustomError = require("../utils/CustomError");
const Controller = require("./Controller");

class MeasurementController extends Controller {
  constructor() {
    super();
  }

  indexByDevice = async (req, res, next) => {
    const { id: deviceId } = req.params;

    try {
      const measurements = await this.prisma.measurement.findMany({
        where: {
          deviceId
        }
      });
      return this.sendResponse(
        res,
        200,
        'measurement retrieved successfully',
        measurements,
      );
    } catch (error) {
      next(error);
    }
  }

  create = async (req, res, next) => {
    const {
      ppm, temperature, source, deviceId
    } = req.body;

    try {
      const device = await this.prisma.device.findUnique({
        where: { id: deviceId }
      });

      if (!device) throw new CustomError('device not found', 404);

      const measurement = await this.prisma.measurement.create({
        data: {
          ppm, temperature, source, deviceId
        }
      })
      return this.sendResponse(
        res,
        200,
        'measurement created successfully',
        measurement,
      )
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MeasurementController;
