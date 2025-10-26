import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  updateArrivalStatus,
  toggleProviderAvailability,
  adminVerifyBooking,
  getAllBookings,
} from "../controllers/bookingController.js";
import { submitCustomerReview } from "../controllers/reviewController.js";

const router = express.Router();

// Customer routes
router.post("/", protect, createBooking);
router.get("/customer", protect, getCustomerBookings);
router.put("/:id/review", protect, submitCustomerReview);

// Provider routes
router.get("/provider", protect, getProviderBookings);
router.put("/:id/status", protect, updateBookingStatus);
router.put("/:id/arrival", protect, updateArrivalStatus);

// Admin routes
router.get("/admin", protect, admin, getAllBookings);
router.put("/:id/verify", protect, admin, adminVerifyBooking);

export default router;
