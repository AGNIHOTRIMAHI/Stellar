/**
 * @desc    Get city from coordinates (reverse geocoding)
 * @route   GET /api/location/city?lat=&lng=
 * @access  Public
 */
export const getCityFromCoordinates = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    console.log("📍 Location request:", { lat, lng });

    // If you have Google Maps API key
    if (process.env.GOOGLE_MAPS_API_KEY) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const cityComponent = data.results?.[0]?.address_components?.find((c) =>
          c.types.includes("locality")
        );

        const city = cityComponent?.long_name || "Delhi";
        return res.json({ city });
      }
    }

    // Default fallback
    res.json({ city: "Prayagraj" });
  } catch (error) {
    console.error("❌ Location error:", error);
    res.status(500).json({
      message: "Unable to detect location",
      city: "Delhi",
    });
  }
};