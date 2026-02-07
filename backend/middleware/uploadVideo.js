import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "stellar/videos",
    resource_type: "video", 
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, 
  },
});

export default uploadVideo;
