import mongoose from "mongoose";
import { config } from "./config.js";
import dns from "dns";

dns.setServers(["0.0.0.0", "8.8.8.8","8.8.4.4"]);

export const connectTODB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("connected to DB successfully");
  } catch (err) {
    console.log("MongoDB connection Error!");
    console.log(err);
  }
};
