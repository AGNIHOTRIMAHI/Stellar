import express from "express";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { showId, seats, userId } = req.body;

    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Check seat availability
    for (let s of show.seats) {
      if (seats.includes(s.seatNumber) && s.isBooked) {
        return res.status(400).json({ 
          message: `Seat ${s.seatNumber} is already booked` 
        });
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

    console.log("✅ Booking successful:", booking._id);

    res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;