import mongoose from "mongoose";
import Show from "../models/Show.js";

/**
 * @desc    Get shows by filters (movie, theatre, date)
 * @route   GET /api/shows?movieId=&theatreId=&date=
 * @access  Public
 */
export const getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;

    console.log("🔍 Shows query:", { movieId, theatreId, date });

    const query = {};

    if (movieId) {
      query.movieId = String(movieId);
    }

    if (theatreId) {
      query.theatreId = new mongoose.Types.ObjectId(theatreId);
    }

    if (date) {
      query.date = String(date);
    }

    const shows = await Show.find(query).populate("theatreId");

    console.log(`✅ Found ${shows.length} shows`);
    res.json(shows);
  } catch (error) {
    console.error("❌ Error fetching shows:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get show by ID
 * @route   GET /api/shows/:id
 * @access  Public
 */
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("theatreId");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get seats for a show
 * @route   GET /api/shows/:showId/seats
 * @access  Public
 */
export const getShowSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    console.log("🪑 Fetching seats for show:", showId);

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show.seats);
  } catch (error) {
    console.error("❌ Error fetching seats:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new show
 * @route   POST /api/shows
 * @access  Private (Admin only - add admin middleware if needed)
 */
export const createShow = async (req, res) => {
  try {
    const { movieId, theatreId, date, time, price, seats } = req.body;

    if (!movieId || !theatreId || !date || !time || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const show = await Show.create({
      movieId,
      theatreId,
      date,
      time,
      price,
      seats: seats || [],
    });

    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};