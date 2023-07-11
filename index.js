require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const deviceRoutes = require('./src/routes/device.routes');
const measurementController = require('./src/routes/measurement.routes');
const ErrorHandler = require('./src/utils/ErrorHandler');
const mqttInstance = require('./src/services/MqttSingleton');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json(
    {
      status: true,
      message: 'Welcome to the main endpoint of RAFT'
    }
  )
})

app.use('/devices', deviceRoutes);
app.use('/measurements', measurementController);

app.use(ErrorHandler.handleError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running in port ${PORT}`);
})
