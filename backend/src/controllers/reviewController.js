import Booking from "../models/Booking.js";
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