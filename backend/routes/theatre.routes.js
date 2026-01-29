import express from "express";
import Theatre from "../models/Theatre.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const city = req.query.city?.trim();
    
    console.log("🔍 Searching for theatres in city:", city);
    
    if (!city) {
      console.log("❌ No city provided");
      return res.json([]);
    }

    // Case-insensitive search - more flexible
    const theatres = await Theatre.find({
      city: { $regex: new RegExp(city, "i") }
    });

    console.log("✅ Found theatres:", theatres.length, theatres.map(t => t.name));
    
    res.json(theatres);
  } catch (err) {
    console.error("❌ Error fetching theatres:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
