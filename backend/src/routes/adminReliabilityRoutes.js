import express from "express";
import {
  getAdminDashboard,
  getProviderReliabilityDetails,
  verifyJobStatus,
  updateJobStatus,
  updateAllScores,
  getReliabilityAnalytics
} from "../controllers/adminReliabilityController.js";

const router = express.Router();

// Admin Reliability Dashboard Routes
router.get("/reliability-dashboard", getAdminDashboard);
router.get("/reliability/:providerId", getProviderReliabilityDetails);
router.put("/verify-job/:jobId", verifyJobStatus);
router.put("/update-job-status/:jobId", updateJobStatus);
router.post("/update-all-scores", updateAllScores);
router.get("/reliability-analytics", getReliabilityAnalytics);

export default router;
