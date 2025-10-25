import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    scheduledTime: { type: Date, required: true },
    addressSnapshot: {
      city: String,
      area: String,
      lat: Number,
      lng: Number,
    },
    notes: String,
    pricing: {
      hourlyRate: Number,
      estimatedHours: Number,
      bookingFee: Number,
      settlement: { type: String, enum: ["COS", "Postpay"], default: "COS" },
    },
    status: {
      type: String,
      enum: ["requested", "quote_sent", "accepted", "in_progress", "completed", "cancelled"],
      default: "requested",
    },
    payment: {
      bookingFeeStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      gatewayRef: String,
    },
    timestampsMap: {
      requestedAt: Date,
      acceptedAt: Date,
      startedAt: Date,
      completedAt: Date,
      cancelledAt: Date,
    },
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema, "service_requests");
export default ServiceRequest;


