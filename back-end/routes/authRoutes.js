import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  register,
  login,
  panditRegister,
  panditLogin,
  changePassword,
  adminLogin,
} from "../controllers/authController.js";

// simple rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});

const router = express.Router();

// user endpoints
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// pandit endpoints (prefix inherited from parent path)
router.post("/pandit/register", authLimiter, panditRegister);
router.post("/pandit/login", authLimiter, panditLogin);

// Route for changing password (protected)
router.post("/change-password", verifyToken, changePassword);
router.post('/admin/login', authLimiter, adminLogin);

export default router;