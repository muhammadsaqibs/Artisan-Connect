import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";
import User from "../models/User.js";
import ReliabilityScoreService from "../services/reliabilityScoreService.js";

// @desc Create a new booking
// @route POST /api/bookings
// @access Private
export const createBooking = async (req, res) => {
  try {
    const {
      providerId,
      serviceDetails,
      bookingDetails,
      pricing,
    } = req.body;

    // Validate required fields
    if (!providerId || !serviceDetails || !bookingDetails || !pricing) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if provider exists and is available
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    if (!provider.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Provider is not available for booking",
      });
    }

    // Check for date clash
    const existingBooking = await Booking.findOne({
      provider: providerId,
      "bookingDetails.bookingDate": new Date(bookingDetails.bookingDate),
      "bookingDetails.preferredTime": bookingDetails.preferredTime,
      status: { $in: ["pending", "confirmed", "in-progress"] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Provider is already booked for this date and time. Please choose a different time slot.",
      });
    }

    // Create booking
    const booking = new Booking({
      customer: req.user._id,
      provider: providerId,
      serviceDetails,
      bookingDetails,
      pricing,
      timeline: [
        {
          status: "booked",
          timestamp: new Date(),
          note: "Booking created by customer",
          updatedBy: req.user._id,
        },
      ],
    });

    await booking.save();

    // Populate the booking with customer and provider details
    await booking.populate([
      { path: "customer", select: "name email phone" },
      { path: "provider", select: "name category subCategory hourlyRate" },
    ]);

    res.status(201).json({
      success: true,
      data: booking,
      message: "Booking created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get customer's booking history
// @route GET /api/bookings/customer
// @access Private
export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("provider", "name category subCategory profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get provider's bookings
// @route GET /api/bookings/provider
// @access Private
export const getProviderBookings = async (req, res) => {
  try {
    // Find provider profile for the user
    const user = await User.findById(req.user._id).populate("providerProfileId");
    if (!user.providerProfileId) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    const bookings = await Booking.find({ provider: user.providerProfileId._id })
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update booking status
// @route PUT /api/bookings/:id/status
// @access Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, workStatus, note } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user has permission to update this booking
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isProvider = booking.provider.toString() === req.user.providerProfileId?.toString();
    const isAdmin = req.user.isAdmin;

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    // Update booking
    if (status) booking.status = status;
    if (workStatus) booking.workStatus = workStatus;

    // Add to timeline
    booking.timeline.push({
      status: workStatus || status,
      timestamp: new Date(),
      note: note || `Status updated to ${workStatus || status}`,
      updatedBy: req.user._id,
    });

    await booking.save();

    // Automatically update provider reliability score if booking is completed
    if (status === "completed" || workStatus === "completed") {
      try {
        await ReliabilityScoreService.updateProviderScore(booking.provider);
      } catch (error) {
        console.error("Error updating reliability score:", error);
      }
    }

    res.json({
      success: true,
      data: booking,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Toggle provider availability
// @route PUT /api/providers/availability
// @access Private
export const toggleProviderAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("providerProfileId");
    if (!user.providerProfileId) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    const provider = await Provider.findById(user.providerProfileId._id);
    provider.isAvailable = !provider.isAvailable;
    await provider.save();

    res.json({
      success: true,
      data: {
        isAvailable: provider.isAvailable,
      },
      message: `Provider is now ${provider.isAvailable ? "available" : "not available"}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Admin verify booking
// @route PUT /api/bookings/:id/verify
// @access Private (Admin only)
export const adminVerifyBooking = async (req, res) => {
  try {
    const { isVerified, notes } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.adminVerification = {
      isVerified,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      notes,
    };

    // Add to timeline
    booking.timeline.push({
      status: isVerified ? "verified" : "unverified",
      timestamp: new Date(),
      note: `Admin ${isVerified ? "verified" : "unverified"} this booking`,
      updatedBy: req.user._id,
    });

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: `Booking ${isVerified ? "verified" : "unverified"} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get all bookings (Admin)
// @route GET /api/bookings/admin
// @access Private (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { status, workStatus, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (workStatus) filter.workStatus = workStatus;

    const bookings = await Booking.find(filter)
      .populate("customer", "name email phone")
      .populate("provider", "name category subCategory profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
