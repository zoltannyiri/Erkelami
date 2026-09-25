import express from 'express';
import cors from 'cors';
import "dotenv/config";

import navigationRoutes from './src/routes/navigationRoutes.js';

const app = express();
app.set('trust proxy', 1)
app.use(cors());
app.use(express.json());

app.use('/api/navigation', navigationRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});