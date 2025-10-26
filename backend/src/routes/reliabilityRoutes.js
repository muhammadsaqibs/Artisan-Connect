import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getReliabilityScore, updateAllScores } from "../controllers/reliabilityController.js";

const router = express.Router();

// Get reliability score for a provider
router.get("/:providerId", protect, getReliabilityScore);

// Update all provider scores (Admin only)
router.post("/update-all", protect, admin, updateAllScores);

export default router;

