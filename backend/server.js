import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDB } from "./config/db.js";
import authBloomFilter from "./services/authBloomFilter.service.js";

// Import routes
import authRouter from "./routes/auth.routes.js";
import commentRouter from "./routes/comment.routes.js";
import theatreRoutes from "./routes/theatre.routes.js";
import showRoutes from "./routes/show.routes.js";
import locationRoutes from "./routes/location.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRouter from "./routes/payment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRouter);

/* ---------------- ERROR HANDLING ---------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ---------------- START SERVER ---------------- */
const startServer = async () => {
  try {
    // Connect to database first
    await connectToDB();
    
    // ✨ Initialize bloom filters on startup
    console.log("🔄 Initializing bloom filters...");
    await authBloomFilter.initialize();
    console.log("✅ Bloom filters ready!");
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();