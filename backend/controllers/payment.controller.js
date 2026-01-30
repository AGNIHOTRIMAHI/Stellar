import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Validate input
    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Show ID and seats are required",
      });
    }

    // Get show details to calculate amount
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // Calculate amount
    const amount = seats.length * show.price;

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order
    const options = {
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        showId: showId,
        seats: seats.join(","),
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

/**
 * @desc    Verify Razorpay payment and create booking
 * @route   POST /api/payment/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seats,
    } = req.body;

    // Create signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment verified - now create booking
      const show = await Show.findById(showId);

      if (!show) {
        return res.status(404).json({
          success: false,
          message: "Show not found",
        });
      }

      // Check seat availability
      for (let seat of show.seats) {
        if (seats.includes(seat.seatNumber) && seat.isBooked) {
          return res.status(400).json({
            success: false,
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

      // Create booking
      const booking = await Booking.create({
        userId: req.user._id,
        showId,
        seats,
        totalAmount: seats.length * show.price,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      console.log("✅ Booking successful:", booking._id);

      return res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed",
        booking,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature - payment verification failed",
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};