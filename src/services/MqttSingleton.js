const instance = require("./DatabaseSingleton");
const MqttService = require("./MqttService");

class MqttSingleton {
  constructor() {
    const host = process.env.MQTT_HOST;
    const username = process.env.MQTT_USERNAME;
    const password = process.env.MQTT_PASSWORD;

    this.prisma = instance.prisma;
    this.mqttService = new MqttService(host, username, password);
    this.mqttService.setOnMessage(this.addMeasurement)
    this.subscribeAll();
  }

  subscribeAll = async () => {
    try {
      const devices = await this.prisma.device.findMany();
      console.log('topics subscribed');
      devices.map((device) => {
        this.mqttService.addSubscriber(`${device.id}/+`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  addMeasurement = async (topic, message) => {
    try {
      if (topic.includes('/tdstemp')) {
        const { ppm, temperature, source } = JSON.parse(message.toString());
        const [deviceId] = topic.split('/');

        const device = await this.prisma.measurement.create({
          data: {
            ppm: ppm | 0,
            temperature,
            deviceId,
            source,
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const mqttInstance = new MqttSingleton();

module.exports = mqttInstance;
