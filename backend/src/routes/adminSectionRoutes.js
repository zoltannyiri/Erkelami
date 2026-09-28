import express from 'express';
import { createSection, updateSection, deleteSection, reorderSections } from '../controllers/adminSectionController.js';

const router = express.Router();

router.post("/pages/:pageId/sections", createSection);
router.patch("/sections/:id", updateSection);
router.delete("/sections/:id", deleteSection);
router.patch("/pages/:pageId/sections/reorder", reorderSections);
export default router;