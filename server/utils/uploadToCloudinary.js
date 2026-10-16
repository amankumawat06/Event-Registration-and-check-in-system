import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  folderName,
  resourceType = "image",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
