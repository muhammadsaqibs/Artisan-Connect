import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProvider,
  getProviders,
  getProviderById,
  updateProviderMe,
  uploadProviderDocument,
  adminVerifyProvider,
  toggleAvailability,
} from "../controllers/providerController.js";

const router = express.Router();

// Upload handlers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const docFilter = (req, file, cb) => {
  const ok = (/\.pdf$/i).test(file.originalname || "");
  cb(ok ? null : new Error("Only PDF documents allowed"), ok);
};
const imageFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = (file.originalname || "").toLowerCase();
  const ok = allowed.some((a) => ext.endsWith(a));
  cb(ok ? null : new Error("Only image files are allowed"), ok);
};
const uploadImage = multer({ storage, fileFilter: imageFilter });
const uploadPDF = multer({ storage, fileFilter: docFilter });

router.get("/", getProviders);
router.get("/:id", getProviderById);
router.post("/", protect, admin, uploadImage.single("profilePicture"), createProvider);
router.put("/me", protect, uploadImage.single("file"), updateProviderMe);
// To upload cover photo, pass body _uploadField=cover and file in 'file'
router.post("/me/documents", protect, uploadPDF.single("document"), uploadProviderDocument);
router.post("/me/toggle-availability", protect, toggleAvailability); // Toggle Live Availability
router.patch("/:id/verify", protect, admin, adminVerifyProvider);

export default router;


