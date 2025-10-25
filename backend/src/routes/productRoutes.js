import express from "express";
import multer from "multer";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = (file.originalname || "").toLowerCase();
  const ok = allowed.some((a) => ext.endsWith(a));
  cb(ok ? null : new Error("Only image files are allowed"), ok);
};
const upload = multer({ storage, fileFilter });

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, admin, upload.single("imageFile"), createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
