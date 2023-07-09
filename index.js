require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running in port ${PORT}`);
})
