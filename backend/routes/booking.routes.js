import express from "express";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { showId, seats, userId } = req.body;

  const show = await Show.findById(showId);

  // Check seat availability
  for (let s of show.seats) {
    if (seats.includes(s.seatNumber) && s.isBooked) {
      return res.status(400).json({ message: "Seat already booked" });
    }
  }

  // Book seats
  show.seats.forEach((s) => {
    if (seats.includes(s.seatNumber)) {
      s.isBooked = true;
    }
  });

  await show.save();

  const booking = await Booking.create({
    userId,
    showId,
    seats,
    totalAmount: seats.length * show.price,
  });

  res.json({ message: "Booking successful", booking });
});

export default router;
