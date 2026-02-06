import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDB } from "./config/db.js";

// Routes
import authRouter from "./routes/auth.routes.js";
import commentRouter from "./routes/comment.routes.js";
import theatreRoutes from "./routes/theatre.routes.js";
import showRoutes from "./routes/show.routes.js";
import locationRoutes from "./routes/location.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;

/* ========== CORE MIDDLEWARE (MUST COME FIRST) ========== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ========== ROUTES ========== */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/movies", movieRoutes); // ✅ NOW CORRECT PLACE

/* ========== ERROR HANDLER ========== */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ========== START SERVER ========== */
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
