import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
} from "../controllers/booking.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All booking routes require authentication
router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getUserBookings);
router.get("/:id", getBookingById);

export default router;