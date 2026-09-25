import express from 'express';

import { getNavigation } from '../controllers/navigationController.js';

const router = express.Router();

router.get('/', getNavigation);

export default router;