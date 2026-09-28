import express from 'express';
import cors from 'cors';
import "dotenv/config";

import navigationRoutes from './src/routes/navigationRoutes.js';
import homeRoutes from './src/routes/homeRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import adminPageRoutes from './src/routes/adminPageRoutes.js';
import adminSectionRoutes from './src/routes/adminSectionRoutes.js';

const app = express();
app.set('trust proxy', 1)
app.use(cors());
app.use(express.json());

app.use('/api/navigation', navigationRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/admin/pages', adminPageRoutes);
app.use('/api/admin', adminSectionRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});