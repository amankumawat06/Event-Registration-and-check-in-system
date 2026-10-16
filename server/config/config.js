import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables!");
}

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is not defined in the environment variables!");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables!");
}

if (!process.env.CLOUDINARY_CLOUDE_NAME) {
  throw new Error(
    "CLOUDINARY_CLOUDE_NAME is not defined in the environment variables!",
  );
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error(
    "CLOUDINARY_API_KEY is not defined in the environment variables!",
  );
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error(
    "CLOUDINARY_API_SECRET is not defined in the environment variables!",
  );
}

export const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  cloudinaryCloudeName: process.env.CLOUDINARY_CLOUDE_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
};
