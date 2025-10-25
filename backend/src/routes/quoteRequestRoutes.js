import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import {
  createQuoteRequest,
  getMyQuoteRequests,
  getAvailableQuoteRequests,
  submitQuote,
  rejectQuoteRequest,
  acceptQuote,
} from "../controllers/quoteRequestController.js";

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
router.post("/", protect, upload.array("photos", 5), createQuoteRequest);
router.get("/my-requests", protect, getMyQuoteRequests);
router.post("/:quoteRequestId/accept/:quoteId", protect, acceptQuote);

// Provider routes
router.get("/available", protect, getAvailableQuoteRequests);
router.post("/:quoteRequestId/submit-quote", protect, submitQuote);
router.post("/:quoteRequestId/reject", protect, rejectQuoteRequest);

export default router;


