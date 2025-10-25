import express from "express";
import {
  addOrder,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order (protected - only logged in users)
router.post("/", protect, addOrder);

// Get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// Get all orders (Admin only)
router.get("/", protect, admin, getOrders);

// Public: track order by token or id
router.get("/track", async (req, res) => {
  try {
    const { token, id } = req.query;
    const Order = (await import("../models/Order.js")).default;
    let order = null;
    if (token) {
      order = await Order.findOne({ orderToken: token });
    }
    if (!order && id) {
      order = await Order.findById(id);
    }
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: {
      _id: order._id,
      orderToken: order.orderToken,
      status: order.status,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      orderItems: order.orderItems?.map(i=> ({ name: i.name, qty: i.qty, price: i.price })) || [],
    }});
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Update order to paid
router.put("/:id/pay", protect, updateOrderToPaid);

// Update order to delivered (Admin only)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

// Update order status (Admin only)
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

export default router;
