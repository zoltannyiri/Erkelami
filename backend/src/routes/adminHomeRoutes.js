import express from "express";
import { getAdminHome, updateHomeSection, createHomeItem, updateHomeItem, deleteHomeItem, reorderHomeItems } from "../controllers/adminHomeController.js";

const router = express.Router();

router.get("/", getAdminHome);
router.patch("/sections/:id", updateHomeSection);
router.post("/sections/:sectionId/items", createHomeItem);
router.patch("/sections/:sectionId/items/reorder", reorderHomeItems);
router.patch("/items/:id", updateHomeItem);
router.delete("/items/:id", deleteHomeItem);


export default router;