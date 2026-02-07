import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "poster") {
      return {
        folder: "stellar/posters",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
      };
    }

    if (file.fieldname === "video") {
      return {
        folder: "stellar/videos",
        resource_type: "video",
      };
    }
  },
});

const uploadMovieAssets = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

export default uploadMovieAssets;
