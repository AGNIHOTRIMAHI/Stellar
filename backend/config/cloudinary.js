import dotenv from "dotenv";
dotenv.config(); // ✅ FORCE env here

import { v2 as cloudinary } from "cloudinary";

console.log("🌥️ CLOUDINARY ENV CHECK:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✔️ loaded" : undefined,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✔️ loaded" : undefined,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
