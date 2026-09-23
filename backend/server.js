require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.set('trust proxy', 1)
app.use(cors())
app.use(express.json({ limit: '20kb' }))

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});