// server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import backend modules
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminReliabilityRoutes from "./routes/adminReliabilityRoutes.js";
import quoteRequestRoutes from "./routes/quoteRequestRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reliabilityRoutes from "./routes/reliabilityRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// =====================
// Load .env explicitly
// =====================
const envPath = path.resolve("./.env");
dotenv.config({ path: envPath });
console.log("Using .env from:", envPath);
console.log("Mongo URI:", process.env.MONGODB_URI);

// =====================
// Connect MongoDB
// =====================
connectDB(); // db.js handles errors if URI is missing

// =====================
// Initialize Express
// =====================
const app = express();
app.use(express.json());

// =====================
// CORS Setup
// =====================
// Allow local dev and Netlify frontend
const allowedOrigins = [
  // local dev
  "http://localhost:5173",
  "http://localhost:3000",
  // Netlify production frontend (no trailing slash)
  "https://artisanconnects.netlify.app",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));

// =====================
// Serve uploaded images
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// =====================
// Routes
// =====================
app.use("/api/products", productRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/requests", serviceRequestRoutes);
app.use("/api/quote-requests", quoteRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reliability", reliabilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminReliabilityRoutes);
app.use("/api", paymentRoutes);

// =====================
// Health check
// =====================
app.get("/", (req, res) => res.send("API is running..."));
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ status: "ok", db: state });
});

// =====================
// Error handlers
// =====================
app.use(notFound);
app.use(errorHandler);

// =====================
// Start server
// =====================
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
