import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";

cloudinary.config({
  cloud_name: config.cloudinaryCloudeName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecret,
});

export default cloudinary;
