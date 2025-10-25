import Category from "../models/Category.js";

// ✅ List all categories
export const listCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: cats });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    // 🔧 create slug/id from name for consistent lookup later
    const id = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    // 🔧 check if category already exists
    const exists = await Category.findOne({ id });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const cat = await Category.create({ id, name, subcategories: [] });
    res.status(201).json({ success: true, data: cat });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Add a subcategory to an existing category
export const addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    // 🔧 FIX: use { id: categoryId } ONLY if your schema has `id` field
    // if schema does not have id, use _id: categoryId
    const cat = await Category.findOne({ id: categoryId });
    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const subId = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    // 🔧 prevent duplicates
    if (cat.subcategories.some((s) => s.id === subId)) {
      return res.status(400).json({ success: false, message: "Subcategory exists" });
    }

    cat.subcategories.push({ id: subId, name });
    await cat.save();
    res.json({ success: true, data: cat });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Delete a category by its id/slug
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // 🔧 FIX: make sure this matches your schema field
    const cat = await Category.findOneAndDelete({ id: categoryId });

    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Delete a subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subId } = req.params;

    // 🔧 FIX: again, depends on whether schema has `id` or `_id`
    const cat = await Category.findOne({ id: categoryId });
    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    cat.subcategories = cat.subcategories.filter((s) => s.id !== subId);
    await cat.save();

    res.json({ success: true, data: cat });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


