import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  listAvailability,
  addAvailability,
  removeAvailability,
} from "../controllers/panditController.js";

const router = express.Router();

// all pandit routes require authentication as pandit
router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.get("/availability", listAvailability);
router.post("/availability", addAvailability);
router.delete("/availability/:id", removeAvailability);

export default router;