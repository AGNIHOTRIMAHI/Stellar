/*import express from "express";
import Show from "../models/Show.js";
import mongoose from "mongoose";
const router = express.Router();

/*router.get("/shows", async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;

    console.log("Searching shows:", { movieId, theatreId, date });

    const shows = await Show.find({
      movieId: String(movieId),
      theatreId,
      date: date, // ✅ STRING MATCH (THIS IS THE KEY FIX)
    });

    console.log("Found shows:", shows.length);

    res.json(shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Error fetching shows" });
  }
});
// Backend: routes/shows.js or similar
router.get('/shows', async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    
    console.log("Shows query params:", { movieId, theatreId, date });

    // Make sure to match exact types
    const shows = await Show.find({
      movieId: movieId.toString(), // Convert to string
      theatreId: new mongoose.Types.ObjectId(theatreId),
      date: date
    });

    console.log(`Found ${shows.length} shows`);
    res.json(shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router; */  // ✅ THIS LINE WAS MISSING

import express from "express";
import mongoose from "mongoose";
import Show from "../models/Show.js";

const router = express.Router();

// ✅ Change from '/api/shows' to just '/shows'
router.get('/', async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    
    console.log("🔍 Shows query params:", { movieId, theatreId, date });

    const shows = await Show.find({
      movieId: String(movieId),
      theatreId: new mongoose.Types.ObjectId(theatreId),
      date: String(date)
    });

    console.log(`✅ Found ${shows.length} shows`);
    res.json(shows);
  } catch (err) {
    console.error("❌ Error fetching shows:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add the seats endpoint
router.get('/shows/:showId/seats', async (req, res) => {
  try {
    const { showId } = req.params;
    
    console.log("🪑 Fetching seats for show:", showId);
    
    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }
    
    console.log(`✅ Found ${show.seats.length} seats`);
    res.json(show.seats);
  } catch (err) {
    console.error("❌ Error fetching seats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;