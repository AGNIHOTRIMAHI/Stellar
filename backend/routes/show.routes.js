import express from "express";
import mongoose from "mongoose";
import Show from "../models/Show.js";

const router = express.Router();

/**
 * GET /api/shows
 * Fetch shows by movie + theatre + date
 */
router.get("/", async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;

    console.log("🔍 Shows query:", { movieId, theatreId, date });

    const shows = await Show.find({
      movieId: String(movieId),
      theatreId: new mongoose.Types.ObjectId(theatreId),
      date: String(date),
    });

    console.log(`✅ Found ${shows.length} shows`);
    res.json(shows);
  } catch (err) {
    console.error("❌ Error fetching shows:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/shows/:showId/seats
 * Fetch seats for a show
 */
router.get("/:showId/seats", async (req, res) => {
  try {
    const { showId } = req.params;

    console.log("🪑 Fetching seats for show:", showId);

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    res.json(show.seats);
  } catch (err) {
    console.error("❌ Error fetching seats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
