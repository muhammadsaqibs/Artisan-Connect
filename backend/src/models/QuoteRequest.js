import mongoose from "mongoose";

const quoteRequestSchema = new mongoose.Schema(
  {
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    subCategory: { 
      type: String 
    },
    jobDescription: { 
      type: String, 
      required: true 
    },
    photos: [{ 
      type: String 
    }], // Array of uploaded photo URLs
    location: {
      city: String,
      area: String,
      lat: Number,
      lng: Number,
      address: String,
    },
    preferredTime: Date, // When customer wants the service
    status: {
      type: String,
      enum: ["pending", "quoted", "accepted", "rejected", "expired"],
      default: "pending",
    },
    quotes: [
      {
        providerId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Provider" 
        },
        quoteAmount: Number,
        message: String,
        quotedAt: { 
          type: Date, 
          default: Date.now 
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    acceptedQuoteId: { 
      type: mongoose.Schema.Types.ObjectId 
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
quoteRequestSchema.index({ "location.lat": 1, "location.lng": 1 });

const QuoteRequest = mongoose.model("QuoteRequest", quoteRequestSchema, "quote_requests");
export default QuoteRequest;


