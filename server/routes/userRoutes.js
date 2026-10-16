import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/verifyRole.js";
import { authlimiter } from "../middlewares/limiter.js";
import {
  createUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  logoutUser,
} from "../controllers/userController.js";
import { upload } from "../middlewares/upload.js";

router.post("/register", upload.single("image"), authlimiter, createUser);
router.post("/login", authlimiter, loginUser);
router.get("/get-me", verifyToken, getMe);
router.get("/all", verifyToken, isAdmin, getAllUsers);
router.get("/logout", verifyToken, logoutUser);
router.get("/:userId", verifyToken, isAdmin, getUserById);
router.delete("/delete/:userId", verifyToken, isAdmin, deleteUser);
router.put("/update/:userId", authlimiter, upload.single("image"), updateUser);

export default router;
