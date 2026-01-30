// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     showId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Show",
//     },
//     seats: [String],
//     totalAmount: Number,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);


import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);