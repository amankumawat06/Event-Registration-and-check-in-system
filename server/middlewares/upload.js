import multer from "multer"; //Handles files sent through multipart/form-data.
const storage = multer.memoryStorage(); //Stores the uploaded file temporarily in server RAM instead of saving it into local disk.

export const upload = multer({
  storage,
  limits: {
    fileSize: 7 * 1024 * 1024,
  },
});
