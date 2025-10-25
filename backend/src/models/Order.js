import mongoose from "mongoose";

function generateOrderToken() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User model ka reference
      required: true,
    },
    orderToken: {
      type: String,
      unique: true,
      default: generateOrderToken,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        // We accept either a real ObjectId (as string) or a slug; store as string to avoid cast errors
        product: { type: String, required: false },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "packing",
        "shipped",
        "out_for_delivery",
        "delivered",
      ],
      default: "placed",
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Generate unique order token before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderToken) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.orderToken = `ORD-${timestamp}-${randomStr}`.toUpperCase();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
