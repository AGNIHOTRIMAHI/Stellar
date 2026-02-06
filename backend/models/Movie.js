import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    genre: String,
    year: Number,
    posterUrl: String,
    videoUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: false },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
