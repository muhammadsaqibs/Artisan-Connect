import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getProviderReviews,
  updateReliabilityScore,
} from "../controllers/reviewController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.random() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Customer routes
router.post("/", protect, upload.array("photos", 5), createReview);

// Provider routes
router.get("/provider/:providerId", getProviderReviews);

// Admin/System routes
router.post("/provider/:providerId/update-reliability", protect, updateReliabilityScore);

export default router;


