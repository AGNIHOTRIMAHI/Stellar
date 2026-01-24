import dotenv from "dotenv";
import { connectToDB } from "../config/db.js";
import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";

dotenv.config();

const createSeats = () => {
  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1,2,3,4,5,6,7,8];
  const seats = [];

  for (let r of rows) {
    for (let c of cols) {
      seats.push({
        seatNumber: `${r}${c}`,
        isBooked: false,
      });
    }
  }
  return seats;
};

const seedShows = async () => {
  await connectToDB();

  const theatre = await Theatre.findOne();
  if (!theatre) {
    console.log("❌ No theatre found. Seed theatres first.");
    process.exit();
  }

  await Show.deleteMany();

  await Show.insertMany([
    {
      movieId: "123", // TEMP movieId
      theatreId: theatre._id,
      date: "2026-01-24",
      time: "10:00 AM",
      price: 200,
      seats: createSeats(),
    },
    {
      movieId: "123",
      theatreId: theatre._id,
      date: "2026-01-24",
      time: "6:00 PM",
      price: 200,
      seats: createSeats(),
    },
  ]);

  console.log("✅ Shows seeded successfully");
  process.exit();
};

seedShows();
