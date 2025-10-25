import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    serviceDetails: {
      serviceName: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      subCategory: { type: String },
    },
    bookingDetails: {
      bookingDate: { type: Date, required: true },
      preferredTime: { type: String, required: true }, // "Morning", "Afternoon", "Evening"
      duration: { type: Number, required: true }, // in hours
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
      },
      specialInstructions: { type: String },
    },
    pricing: {
      hourlyRate: { type: Number, required: true },
      totalHours: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      paymentMethod: { 
        type: String, 
        enum: ["COD", "Online"], 
        default: "COD" 
      },
      paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "failed"], 
        default: "pending" 
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    workStatus: {
      type: String,
      enum: ["booked", "started", "in-progress", "completed", "cancelled"],
      default: "booked",
    },
    adminVerification: {
      isVerified: { type: Boolean, default: false },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: { type: Date },
      notes: { type: String },
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    customerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
      ratedAt: { type: Date },
    },
    providerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
      ratedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ "bookingDetails.bookingDate": 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
