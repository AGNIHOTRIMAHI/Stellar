import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Validate input
    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({
        message: "Show ID and seats are required",
      });
    }

    // Find the show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Check if seats are available
    for (let seat of show.seats) {
      if (seats.includes(seat.seatNumber) && seat.isBooked) {
        return res.status(400).json({
          message: `Seat ${seat.seatNumber} is already booked`,
        });
      }
    }

    // Mark seats as booked
    show.seats.forEach((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.isBooked = true;
      }
    });

    await show.save();

    // Create booking record
    const booking = await Booking.create({
      userId: req.user._id,
      showId,
      seats,
      totalAmount: seats.length * show.price,
    });

    console.log("✅ Booking successful:", booking._id);

    res.status(201).json({
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: "showId",
        populate: {
          path: "theatreId",
          select: "name address location",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "showId",
        populate: {
          path: "theatreId",
          select: "name address location",
        },
      })
      .populate("userId", "username email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};