import express from "express";
const app = express();
import cookiesParser from "cookie-parser";
import cors from "cors";
import { apiLimiter } from "../middlewares/limiter.js"

app.use(express.json());
app.use(cookiesParser());
app.use(apiLimiter)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

import userRoutes from "../routes/userRoutes.js";
import eventRoutes from "../routes/eventRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js"

app.use("/api/auth/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);

export default app;
