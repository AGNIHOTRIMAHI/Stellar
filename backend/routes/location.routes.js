import express from "express";

const router = express.Router();

// Reverse geocode - returns city from lat/lng
router.get("/city", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    console.log("📍 Location request:", { lat, lng });
    
    // TEMPORARY: Returns Prayagraj as default
    // TODO: Implement Google Maps Geocoding API for production
    res.json({ city: "Prayagraj" });
    
    /* For production, use this:
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    const city = data.results[0].address_components.find(
      c => c.types.includes("locality")
    )?.long_name;
    res.json({ city });
    */
  } catch (err) {
    console.error("❌ Location error:", err);
    res.status(500).json({ message: "Unable to detect location" });
  }
});

export default router;