import express from "express";
import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";

const router = express.Router();

/* Get theatres by city */
router.get("/theatres", async (req, res) => {
  const { city } = req.query;
  const theatres = await Theatre.find({ city });
  res.json(theatres);
});

/* Get shows by movie + theatre + date */
router.get("/", async (req, res) => {
  const { movieId, theatreId, date } = req.query;
  const shows = await Show.find({ movieId, theatreId, date });
  res.json(shows);
});

/* Get seats */
router.get("/:showId/seats", async (req, res) => {
  const show = await Show.findById(req.params.showId);
  res.json(show.seats);
});

export default router;
