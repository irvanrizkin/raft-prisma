const { connect } = require("mqtt");

class MqttService {
  constructor(host, username, password) {
    this.mqttClient = connect(host, { username, password });

    this.mqttClient.on('error', (error) => {
      console.log(error);
      this.mqttClient.end();
    })

    this.mqttClient.on('connect', () => {
      console.log('mqtt client connected');
    });
  }

  addSubscriber(topic) {
    this.mqttClient.subscribe(topic);
  }

  setOnMessage(callback) {
    this.mqttClient.on('message', (topic, message) => {
      callback(topic, message);
    });
  }

  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message);
  }
}

module.exports = MqttService;
