import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRequest,
  getMyRequests,
  getIncomingForProvider,
  updateStatus,
} from "../controllers/serviceRequestController.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/me", protect, getMyRequests);
router.get("/incoming", protect, getIncomingForProvider);
router.patch("/:id/status", protect, updateStatus);

export default router;


