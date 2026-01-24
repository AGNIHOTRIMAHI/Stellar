import dotenv from "dotenv";
import { connectToDB } from "../config/db.js";
import Theatre from "../models/Theatre.js";

dotenv.config();

const seedTheatres = async () => {
  await connectToDB();

  await Theatre.deleteMany(); // clear old data

  await Theatre.insertMany([
    {
      name: "PVR Vinayak Prayagraj",
      city: "Prayagraj",
      location: { lat: 25.4358, lng: 81.8463 },
    },
    {
      name: "INOX Civil Lines",
      city: "Prayagraj",
      location: { lat: 25.4431, lng: 81.8469 },
    },
    {
      name: "Cinepolis Tagore Town",
      city: "Prayagraj",
      location: { lat: 25.4492, lng: 81.8321 },
    },
  ]);

  console.log("✅ Theatres seeded successfully");
  process.exit();
};

seedTheatres();
