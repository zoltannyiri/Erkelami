import express from "express";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getAdminCalendarEvents,
  updateCalendarEvent,
} from "../controllers/adminCalendarController.js";

const router = express.Router();

router.get("/", getAdminCalendarEvents);
router.post("/", createCalendarEvent);
router.patch("/:id", updateCalendarEvent);
router.delete("/:id", deleteCalendarEvent);

export default router;
