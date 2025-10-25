import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    providerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Provider", 
      required: true 
    },
    serviceRequestId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ServiceRequest", 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      default: "" 
    },
    photos: [{ 
      type: String 
    }], // Photos of completed work
    serviceDate: { 
      type: Date, 
      required: true 
    },
  },
  { timestamps: true }
);

// Ensure one review per service request
reviewSchema.index({ serviceRequestId: 1 }, { unique: true });

// Index for provider reviews lookup
reviewSchema.index({ providerId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema, "reviews");
export default Review;


