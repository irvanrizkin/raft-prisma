const { default: axios } = require("axios");
const CustomError = require("../utils/CustomError");
const Controller = require("./Controller");
const mqttInstance = require("../services/MqttSingleton");

class ActionController extends Controller {
  openValve = async (req, res, next) => {
    const { id, flow } = req.params;

    try {
      const device = await this.prisma.device.findUnique({
        where: { id }
      })

      if (!device) throw new CustomError('device not found', 404);

      if (process.env.MODE == 'thinger') {
        await axios.post(`${device.thingerUrl}/valve`, flow, {
          headers: {
            Authorization: `Bearer ${device.thingerBearer}`,
            'Content-Type': 'application/json'
          }
        })

        return this.sendResponse(
          res,
          200,
          'open valve command sent successfully from thinger',
          null,
        )
      }

      mqttInstance.mqttService.sendMessage(`${device.id}/valve/${flow}`);
      return this.sendResponse(
        res,
        200,
        'open valve command sent successfully from mqtt',
        null,
      )
    } catch (error) {
      next(error);
    }
  }

  readSensor = async (req, res, next) => {
    const { id } = req.params;

    try {
      const device = await this.prisma.device.findUnique({
        where: { id }
      })

      if (!device) throw new CustomError('device not found', 404);

      if (process.env.MODE == 'thinger') {
        await axios.post(`${device.thingerUrl}/read`, true, {
          headers: {
            Authorization: `Bearer ${device.thingerBearer}`,
            'Content-Type': 'application/json'
          }
        })

        return this.sendResponse(
          res,
          200,
          'read sensor command sent successfully from thinger',
          null,
        )
      }

      mqttInstance.mqttService.sendMessage(`${device.id}/read`);
      return this.sendResponse(
        res,
        200,
        'read sensor command sent successfully from mqtt',
        null,
      )
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActionController;
