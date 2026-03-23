import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createBooking,
  listUserBookings,
  listPanditBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// all booking routes require authentication
router.use(verifyToken);

// user can create and view own bookings
router.post("/", createBooking);
router.get("/", listUserBookings);

// pandit can view their bookings (different path)
router.get("/pandit", listPanditBookings);

// update status (both roles)
router.put("/:id/status", updateBookingStatus);

export default router;