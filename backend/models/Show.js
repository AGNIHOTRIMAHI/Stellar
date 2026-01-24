import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: String, // A1, A2
  isBooked: { type: Boolean, default: false },
});

const showSchema = new mongoose.Schema({
  movieId: String, // TMDB movie id
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
  },
  date: String, // YYYY-MM-DD
  time: String, // 10:00 AM
  price: Number,
  seats: [seatSchema],
});

export default mongoose.model("Show", showSchema);
