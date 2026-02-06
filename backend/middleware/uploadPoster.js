import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "stellar/posters",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploadPoster = multer({ storage });
console.log("CLOUDINARY CONFIG:", cloudinary.config());
export default uploadPoster;
