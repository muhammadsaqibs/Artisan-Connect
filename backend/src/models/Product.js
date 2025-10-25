import mongoose from "mongoose";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const productSchema = new mongoose.Schema(
  {
    // For services pivot, keep name as provider display name
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    // Rename description -> skills (array), price -> hourlyRate for services
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: String },
    isFlashSale: { type: Boolean, default: false },
    flashSaleEndsAt: { type: Date },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

// Ensure a unique slug based on name
productSchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) return next();

  const base = slugify(this.name || "");
  let candidate = base || `product-${Date.now()}`;
  let suffix = 1;

  // Avoid slug collisions
  // Use this.constructor to reference the compiled model
  // eslint-disable-next-line no-constant-condition
  while (await this.constructor.findOne({ slug: candidate })) {
    candidate = `${base}-${suffix++}`;
  }
  this.slug = candidate;
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
