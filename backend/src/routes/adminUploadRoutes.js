import express from "express";
import multer from "multer";

import { uploadAdminFile } from "../controllers/adminUploadController.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", uploadSingleFile, uploadAdminFile);

export default router;