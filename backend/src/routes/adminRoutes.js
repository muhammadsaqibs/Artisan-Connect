import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";
import QuoteRequest from "../models/QuoteRequest.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET /api/admin/providers -> list provider users
router.get("/providers", protect, admin, async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" })
      .select("name email avatarUrl role status trustScore createdAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: providers });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PUT /api/admin/provider/:id/status -> update status and trustScore
router.put("/provider/:id/status", protect, admin, async (req, res) => {
  try {
    const { status, trustScore } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "provider") return res.status(404).json({ message: "Provider not found" });
    if (status) user.status = status; // 'pending' | 'active' | 'suspended'
    if (typeof trustScore === "number") user.trustScore = Math.min(100, Math.max(0, trustScore));
    await user.save();
    res.json({ success: true, data: { _id: user._id, status: user.status, trustScore: user.trustScore } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/admin/customers -> list customer users
router.get("/customers", protect, admin, async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("name email avatarUrl role status trustScore createdAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PUT /api/admin/customer/:id/status -> update customer status
router.put("/customer/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "customer") return res.status(404).json({ message: "Customer not found" });
    if (status) user.status = status; // 'active' | 'suspended'
    await user.save();
    res.json({ success: true, data: { _id: user._id, status: user.status } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/admin/transactions -> view all transactions
router.get("/transactions", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    
    const transactions = orders.map(order => ({
      _id: order._id,
      orderToken: order.orderToken,
      user: order.user,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.json({ success: true, data: transactions });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Metrics
router.get("/metrics", protect, admin, async (req, res) => {
  try {
    const [customersCount, providersCount, pendingVerifications, bookingsCount, quoteRequestsCount, ordersCount] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider" }),
      User.countDocuments({ role: "provider", status: "pending" }),
      ServiceRequest.countDocuments({}),
      QuoteRequest.countDocuments({}),
      Order.countDocuments({}),
    ]);
    res.json({ 
      success: true, 
      data: { 
        customersCount, 
        providersCount, 
        pendingVerifications, 
        bookingsCount,
        quoteRequestsCount,
        ordersCount,
      } 
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;


