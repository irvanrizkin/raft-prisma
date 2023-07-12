const { sub } = require("date-fns");
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
          deviceId,
          createdAt: {
            gte: sub(new Date(), { hours: 1 }),
            lte: new Date(),
          }
        },
        orderBy: {
          createdAt: 'asc',
        }
      });
      return this.sendResponse(
        res,
        200,
        'measurement from last two hours retrieved successfully',
        measurements,
      );
    } catch (error) {
      next(error);
    }
  }

  getDailyAverageByDevice = async (req, res, next) => {
    const { id: deviceId } = req.params;
    
    try {
      const measurement = await this.prisma.$queryRaw`
        SELECT
            AVG(ppm) AS ppm,
            HOUR(createdAt) AS hour
        FROM
            Measurement
        WHERE
            deviceId = ${deviceId}
            AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        GROUP BY
            HOUR(createdAt)
        ORDER BY
            HOUR(createdAt);
      `
      return this.sendResponse(
        res,
        200,
        'measurement averaged from last one day retrieved successfully',
        measurement,
      );
    } catch (error) {
      next(error);
    }
  }

  getWeeklyAverageByDevice = async (req, res, next) => {
    const { id: deviceId } = req.params;
    
    try {
      const measurement = await this.prisma.$queryRaw`
        SELECT
            AVG(ppm) AS ppm,
            HOUR(createdAt) AS hour,
            DAY(createdAt) AS day
        FROM
            Measurement
        WHERE
            deviceId = ${deviceId}
            AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY
            HOUR(createdAt),
            DAY(createdAt)
        ORDER BY
            DAY(createdAt),
            HOUR(createdAt);
      `
      return this.sendResponse(
        res,
        200,
        'measurement averaged from last one week retrieved successfully',
        measurement,
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
