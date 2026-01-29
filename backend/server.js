import express from "express";
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "./models/user.model.js";
import Comment from "./models/comment.model.js";
import Show from "./models/Show.js";
import Theatre from "./models/Theatre.js";
import Booking from "./models/Booking.js";
import theatreRoutes from "./routes/theatre.routes.js";
import showRoutes from "./routes/show.routes.js"; // missing or typo
import locationRoutes from "./routes/location.routes.js";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- AUTH MIDDLEWARE ---------------- */
const protect = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/location", locationRoutes);

/* ---------------- BASE ---------------- */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* ---------------- AUTH ---------------- */
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error("All fields are required!");
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (await User.findOne({ username })) {
      return res
        .status(400)
        .json({ message: "Username is taken, try another name." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      user: userDoc,
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = bcryptjs.compareSync(
      password,
      userDoc.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      user: userDoc,
      message: "Logged in successfully.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

/* ---------------- COMMENTS ---------------- */
app.post("/api/comments", protect, async (req, res) => {
  try {
    const { movieId, text } = req.body;

    if (!movieId || !text) {
      return res
        .status(400)
        .json({ message: "movieId and text required" });
    }

    const comment = await Comment.create({
      movieId: String(movieId),
      text,
      userId: req.user._id,
      username: req.user.username,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/comments/:movieId", async (req, res) => {
  const comments = await Comment.find({
    movieId: String(req.params.movieId),
  }).sort({ createdAt: -1 });

  res.json(comments);
});

/* ---------------- BOOKINGS ---------------- */
app.get("/api/theatres", async (req, res) => {
  const { city } = req.query;
  const theatres = await Theatre.find({ city });
  res.json(theatres);
});

app.get("/api/shows", async (req, res) => {
  const { movieId, theatreId, date } = req.query;
  const shows = await Show.find({ movieId, theatreId, date });
  res.json(shows);
});

app.get("/api/shows/:showId/seats", async (req, res) => {
  const show = await Show.findById(req.params.showId);
  res.json(show.seats);
});

app.post("/api/bookings", protect, async (req, res) => {
  const { showId, seats } = req.body;
  const show = await Show.findById(showId);

  for (let seat of show.seats) {
    if (seats.includes(seat.seatNumber) && seat.isBooked) {
      return res.status(400).json({ message: "Seat already booked" });
    }
  }

  show.seats.forEach((seat) => {
    if (seats.includes(seat.seatNumber)) {
      seat.isBooked = true;
    }
  });

  await show.save();

  const booking = await Booking.create({
    userId: req.user._id,
    showId,
    seats,
    totalAmount: seats.length * show.price,
  });

  res.status(201).json({ message: "Booking confirmed", booking });
});

/* ---------------- LOCATION (GOOGLE MAPS) ---------------- */
app.get("/api/location/city", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const cityComp =
      data.results?.[0]?.address_components?.find((c) =>
        c.types.includes("locality")
      );

    res.json({ city: cityComp?.long_name || "Delhi" });
  } catch (err) {
    console.error("Location error:", err);
    res.status(500).json({ city: "Delhi" });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
