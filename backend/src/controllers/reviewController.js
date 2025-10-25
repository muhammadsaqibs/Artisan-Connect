import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Provider from "../models/Provider.js";
import ReliabilityScoreService from "../services/reliabilityScoreService.js";

// @desc Submit customer review
// @route PUT /api/bookings/:id/review
// @access Private
export const submitCustomerReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the customer
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this booking",
      });
    }

    // Update booking with customer review
    booking.customerRating = {
      rating,
      review,
      ratedAt: new Date(),
    };

    // Add to timeline
    booking.timeline.push({
      status: "reviewed",
      timestamp: new Date(),
      note: `Customer rated ${rating}/5 stars`,
      updatedBy: req.user._id,
    });

    await booking.save();

    // Update provider reliability score
    try {
      await ReliabilityScoreService.updateProviderScore(booking.provider);
    } catch (error) {
      console.error("Error updating reliability score:", error);
    }

    res.json({
      success: true,
      data: booking,
      message: "Review submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Create a new review (with optional photos)
// @route POST /api/reviews/
// @access Private
export const createReview = async (req, res) => {
  try {
    const { providerId, serviceRequestId, rating, comment, serviceDate } = req.body;

    const photos = (req.files || []).map((f) => f.path || f.filename || f.originalname);

    const review = new Review({
      customerId: req.user._id,
      providerId,
      serviceRequestId,
      rating,
      comment,
      photos,
      serviceDate,
    });

    await review.save();

    // Update provider stats (average rating and count)
    try {
      const stats = await Review.aggregate([
        { $match: { providerId: review.providerId } },
        { $group: { _id: "$providerId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]);

      if (stats && stats.length > 0) {
        const { avgRating, count } = stats[0];
        await Provider.findByIdAndUpdate(review.providerId, { rating: avgRating, numReviews: count });
      }
    } catch (err) {
      console.error("Error updating provider stats after review:", err);
    }

    // Recalculate reliability score for provider
    try {
      await ReliabilityScoreService.updateProviderScore(review.providerId);
    } catch (err) {
      console.error("Error updating reliability score:", err);
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    // Handle unique index error for serviceRequestId
    if (error && error.code === 11000) {
      return res.status(400).json({ success: false, message: "Review for this service request already exists" });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get reviews for a provider
// @route GET /api/reviews/provider/:providerId
// @access Public
export const getProviderReviews = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const reviews = await Review.find({ providerId }).populate("customerId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update reliability score for a provider (manual/admin trigger)
// @route POST /api/reviews/provider/:providerId/update-reliability
// @access Private
export const updateReliabilityScore = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const score = await ReliabilityScoreService.updateProviderScore(providerId);
    res.json({ success: true, data: { providerId, score } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};