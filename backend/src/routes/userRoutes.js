import express from "express";
import multer from "multer";
import { registerUser, authUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const imageFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = (file.originalname || "").toLowerCase();
  const ok = allowed.some((a) => ext.endsWith(a));
  cb(ok ? null : new Error("Only image files are allowed"), ok);
};
const upload = multer({ storage, fileFilter: imageFilter });

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile/picture", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { default: User } = await import("../models/User.js");
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ success: true, data: { profilePicture: user.profilePicture } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
