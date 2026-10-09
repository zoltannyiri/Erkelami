import express from "express";
import { uploadAdminFile } from "../controllers/adminUploadController.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// NOTE (Security): Add authentication/authorization middleware (e.g. requireAuth, requireAdmin)
// to this route once admin authentication is implemented.
router.post("/", uploadSingleFile, uploadAdminFile);

export default router;