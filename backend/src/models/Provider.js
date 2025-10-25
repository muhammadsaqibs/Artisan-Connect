import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    photos: [{ type: String }],
    hourlyRate: { type: Number, required: true },
    skills: [{ type: String }],
    bio: { type: String, default: "" },
    phone: { 
      type: String, 
      default: "",
      validate: {
        validator: function(v) {
          return !v || /^\d{11}$/.test(v);
        },
        message: 'Phone number must be exactly 11 digits'
      }
    },
    cnic: { 
      type: String, 
      default: "",
      validate: {
        validator: function(v) {
          return !v || /^\d{13}$/.test(v);
        },
        message: 'CNIC must be exactly 13 digits'
      }
    },
    age: { type: Number },
    workExperienceYears: { type: Number, default: 0 },
    category: { type: String, required: true }, // e.g., Plumbing
    subCategory: { type: String }, // e.g., Pipe Repair
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reliabilityScore: { type: Number, default: 0, min: 0, max: 100 }, // Based on job completion
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "unverified"],
      default: "pending",
    },
    verificationNote: { type: String, default: "" },
    documents: [
      {
        name: String,
        url: String, // stored path to PDF
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    isAvailable: { type: Boolean, default: true },
    location: {
      city: { type: String },
      area: { type: String },
      geo: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] }, // [lng, lat]
      },
    },
    availability: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        start: String, // HH:mm
        end: String,   // HH:mm
      },
    ],
  },
  { timestamps: true }
);

// Only index geo if coordinates exist
providerSchema.index({ "location.geo": "2dsphere" }, { sparse: true });

const Provider = mongoose.model("Provider", providerSchema, "providers");

export default Provider;


