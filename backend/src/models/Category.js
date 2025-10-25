import mongoose from "mongoose";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, unique: true, index: true },
    subcategories: { type: [subCategorySchema], default: [] },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (!this.id) this.id = slugify(this.name || "");
  if (!this.slug) this.slug = slugify(this.name || "");
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;


