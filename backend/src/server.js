import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
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

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
// Serve uploaded images
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
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

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    status: "ok",
    db: state,
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
