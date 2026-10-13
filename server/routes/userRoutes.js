import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/verifyRole.js";
import {
  createUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserById,
  deleteUser,
  logoutUser,
} from "../controllers/userController.js";

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/get-me", verifyToken, getMe);
router.get("/all", verifyToken, isAdmin, getAllUsers);
router.get("/logout", verifyToken, logoutUser);
router.get("/:userId", verifyToken, isAdmin, getUserById);
router.delete("/delete/:userId", verifyToken, isAdmin, deleteUser);

export default router;
