import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

// Add new product
export const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };
    // Normalize boolean flags that can arrive as strings via multipart/form-data
    if (body.isFlashSale !== undefined) {
      body.isFlashSale = body.isFlashSale === true || body.isFlashSale === "true" || body.isFlashSale === 1 || body.isFlashSale === "1";
    }
    // If admin set a flash sale timer, accept either ISO string or minutes from now
    if (body.flashSaleEndsAt) {
      const raw = body.flashSaleEndsAt;
      const num = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw;
      const ts = new Date(num);
      body.flashSaleEndsAt = isNaN(ts.getTime()) ? undefined : ts;
    }
    // If file uploaded, set image path
    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    }
    const product = new Product(body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products with filters, search, sorting, pagination
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
            { brand: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const subCategory = req.query.subCategory
      ? { subCategory: req.query.subCategory }
      : {};

    const priceGte = req.query.minPrice ? { $gte: Number(req.query.minPrice) } : undefined;
    const priceLte = req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : undefined;
    const priceFilter =
      priceGte !== undefined || priceLte !== undefined
        ? { price: { ...(priceGte ? priceGte : {}), ...(priceLte ? priceLte : {}) } }
        : {};

    const flashSaleFilter = req.query.flashSale === 'true' ? { isFlashSale: true } : {};
    const filter = { ...keyword, ...category, ...subCategory, ...priceFilter, ...flashSaleFilter };
    const count = await Product.countDocuments(filter);

    let sort = {};
    // sort=price_asc|price_desc|newest|oldest|name_asc|name_desc
    switch (req.query.sort) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "name_asc":
        sort = { name: 1 };
        break;
      case "name_desc":
        sort = { name: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "newest":
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      data: products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.isFlashSale !== undefined) {
      update.isFlashSale = update.isFlashSale === true || update.isFlashSale === "true" || update.isFlashSale === 1 || update.isFlashSale === "1";
    }
    if (update.flashSaleEndsAt) {
      const raw = update.flashSaleEndsAt;
      const num = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw;
      const ts = new Date(num);
      update.flashSaleEndsAt = isNaN(ts.getTime()) ? undefined : ts;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
