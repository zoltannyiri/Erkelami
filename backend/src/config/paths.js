import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the backend package (2 levels up from src/config)
export const BACKEND_ROOT = path.resolve(__dirname, '../..');

// Persistent uploads directory
export const UPLOADS_DIR = path.resolve(BACKEND_ROOT, 'uploads');
export const UPLOADS_IMAGES_DIR = path.resolve(UPLOADS_DIR, 'images');
export const UPLOADS_DOCUMENTS_DIR = path.resolve(UPLOADS_DIR, 'documents');
