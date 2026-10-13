import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/verifyRole.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

router.post("/create", verifyToken, isAdmin, createEvent);
router.get("/all", getAllEvents);
router.get("/:id", getEventById);
router.put("/update/:id", verifyToken, isAdmin, updateEvent);
router.delete("/delete/:id", verifyToken, isAdmin, deleteEvent);

export default router;
