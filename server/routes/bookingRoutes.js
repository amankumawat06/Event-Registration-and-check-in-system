import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/verifyRole.js";
import {
  createBooking,
  getMyBooking,
  AllBookings,
  deleteBooking,
  markCheckedIn,
} from "../controllers/bookingController.js";

router.post("/create", verifyToken, createBooking);
router.get("/my-bookings", verifyToken, getMyBooking);
router.get("/all", verifyToken, isAdmin, AllBookings);
router.delete("/delete/:id", verifyToken, deleteBooking);
router.patch("/update/:id", verifyToken, isAdmin, markCheckedIn);

export default router;
