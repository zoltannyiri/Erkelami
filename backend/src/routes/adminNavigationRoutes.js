import express from "express";

import { getAdminNavigation, createNavigationItem, updateNavigationItem, deleteNavigationItem, reorderNavigationItems } from "../controllers/adminNavigationController.js";

const router = express.Router();

router.get("/", getAdminNavigation);
router.post("/", createNavigationItem);
router.patch("/reorder", reorderNavigationItems);
router.patch("/:id", updateNavigationItem);
router.delete("/:id", deleteNavigationItem);

export default router;