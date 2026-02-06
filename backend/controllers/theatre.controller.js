import Theatre from "../models/Theatre.js";

/**
 * @desc    Get theatres by city
 * @route   GET /api/theatres?city=CityName
 * @access  Public
 */
export const getTheatresByCity = async (req, res) => {
  try {
    const city = req.query.city?.trim();

    console.log("🔍 Searching for theatres in city:", city);

    if (!city) {
      console.log("❌ No city provided");
      return res.json([]);
    }

    // Case-insensitive search
    const theatres = await Theatre.find({
      city: { $regex: new RegExp(city, "i") },
    });

    console.log(
      "✅ Found theatres:",
      theatres.length,
      theatres.map((t) => t.name)
    );

    res.json(theatres);
  } catch (error) {
    console.error("❌ Error fetching theatres:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get theatre by ID
 * @route   GET /api/theatres/:id
 * @access  Public
 */
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new theatre
 * @route   POST /api/theatres
 * @access  Private (Admin only - add admin middleware if needed)
 */
export const createTheatre = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({
        message: "Name and city are required",
      });
    }

    const theatre = await Theatre.create({ name, city });

    res.status(201).json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};