import express from 'express';
import cors from 'cors';
import "dotenv/config";
import fs from 'node:fs';

import { UPLOADS_DIR, UPLOADS_IMAGES_DIR, UPLOADS_DOCUMENTS_DIR } from './src/config/paths.js';

// Ensure persistent uploads subdirectories exist at startup
fs.mkdirSync(UPLOADS_IMAGES_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DOCUMENTS_DIR, { recursive: true });

import navigationRoutes from './src/routes/navigationRoutes.js';
import homeRoutes from './src/routes/homeRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import adminPageRoutes from './src/routes/adminPageRoutes.js';
import adminSectionRoutes from './src/routes/adminSectionRoutes.js';
import adminHomeRoutes from './src/routes/adminHomeRoutes.js';
import adminNavigationRoutes from './src/routes/adminNavigationRoutes.js';
import adminUploadRoutes from './src/routes/adminUploadRoutes.js';

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/uploads', express.static(UPLOADS_DIR, { dotfiles: 'ignore', index: false }));
app.use('/api/navigation', navigationRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/admin/pages', adminPageRoutes);
app.use('/api/admin', adminSectionRoutes);
app.use('/api/admin/home', adminHomeRoutes);
app.use('/api/admin/navigation', adminNavigationRoutes);
app.use('/api/admin/uploads', adminUploadRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});