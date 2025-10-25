import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: {
      type: String,
      enum: ["quote_request", "quote_accepted", "quote_rejected", "service_started", "service_completed", "review_received"],
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    link: { 
      type: String, 
      default: "" 
    }, // Link to relevant page (e.g., quote request, service details)
    isRead: { 
      type: Boolean, 
      default: false 
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }, // Additional data like IDs, amounts, etc.
  },
  { timestamps: true }
);

// Index for efficient querying
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema, "notifications");
export default Notification;


