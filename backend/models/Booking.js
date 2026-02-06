import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
    },
    seats: [String],
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
