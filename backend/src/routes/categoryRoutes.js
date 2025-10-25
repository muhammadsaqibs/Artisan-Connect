import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  listCategories,
  createCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", protect, admin, createCategory);
router.post("/:categoryId/sub", protect, admin, addSubCategory);
router.delete("/:categoryId", protect, admin, deleteCategory);
router.delete("/:categoryId/sub/:subId", protect, admin, deleteSubCategory);

export default router;




