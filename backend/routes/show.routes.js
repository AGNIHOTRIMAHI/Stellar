import express from "express";
import Show from "../models/Show.js";

const router = express.Router();

/* Get shows by movie + theatre + date */
router.get("/", async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    
    console.log("🔍 Searching shows:", { movieId, theatreId, date });
    
    const shows = await Show.find({ movieId, theatreId, date });
    
    console.log("✅ Found shows:", shows.length);
    
    res.json(shows);
  } catch (err) {
    console.error("❌ Error fetching shows:", err);
    res.status(500).json({ message: err.message });
  }
});

/* Get seats for a specific show */
router.get("/:showId/seats", async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId);
    
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
    
    console.log("✅ Found seats for show:", req.params.showId);
    
    res.json(show.seats);
  } catch (err) {
    console.error("❌ Error fetching seats:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;