import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authToken = req.cookies?.auth_access;
    if (!authToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(authToken, config.jwtSecret);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
