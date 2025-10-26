import ReliabilityScoreService from "../services/reliabilityScoreService.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// @desc Get admin verification dashboard data
// @route GET /api/admin/reliability-dashboard
// @access Private (Admin only)
export const getAdminDashboard = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Get all providers with their reliability scores
    const providers = await Provider.find({})
      .select("name category subCategory reliabilityScore lastScoreUpdate")
      .sort({ reliabilityScore: -1 });

    // Get recent jobs for verification
    const recentJobs = await Booking.find({})
      .populate("provider", "name category")
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    // Get overall statistics
    const totalJobs = await Booking.countDocuments();
    const completedJobs = await Booking.countDocuments({ completion_status: "Completed" });
    const onTimeJobs = await Booking.countDocuments({ arrival_status: "On Time" });
    const positiveFeedbackJobs = await Booking.countDocuments({ feedback_status: "Positive" });

    const overallStats = {
      totalJobs,
      completedJobs,
      onTimeJobs,
      positiveFeedbackJobs,
      overallCompletionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
      overallOnTimeRate: totalJobs > 0 ? (onTimeJobs / totalJobs) * 100 : 0,
      overallPositiveFeedbackRate: totalJobs > 0 ? (positiveFeedbackJobs / totalJobs) * 100 : 0,
    };

    res.json({
      success: true,
      data: {
        providers,
        recentJobs: recentJobs.map(job => ({
          job_id: job._id,
          artisan_id: job.provider._id,
          artisan_name: job.provider.name,
          artisan_category: job.provider.category,
          customer_name: job.customer.name,
          completion_status: job.completion_status,
          arrival_status: job.arrival_status,
          feedback_status: job.feedback_status,
          completion_rate: job.completion_rate,
          on_time_rate: job.on_time_rate,
          feedback_rate: job.feedback_rate,
          reliability_score: job.reliability_score,
          last_updated: job.last_updated,
          adminVerified: job.adminVerification.isVerified,
          createdAt: job.createdAt
        })),
        overallStats
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get detailed reliability breakdown for a specific provider
// @route GET /api/admin/reliability/:providerId
// @access Private (Admin only)
export const getProviderReliabilityDetails = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { providerId } = req.params;
    
    const scoreBreakdown = await ReliabilityScoreService.getScoreBreakdown(providerId);
    const trendPrediction = await ReliabilityScoreService.predictReliabilityTrend(providerId);
    
    if (!scoreBreakdown) {
      return res.status(404).json({
        success: false,
        message: "Provider not found or no data available",
      });
    }

    res.json({
      success: true,
      data: {
        ...scoreBreakdown,
        trendPrediction
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Verify job status (Admin verification)
// @route PUT /api/admin/verify-job/:jobId
// @access Private (Admin only)
export const verifyJobStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { jobId } = req.params;
    const { 
      completion_status, 
      arrival_status, 
      feedback_status,
      notes,
      verifyCompletion,
      verifyArrival,
      verifyFeedback
    } = req.body;

    const booking = await Booking.findById(jobId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Update job statuses if provided
    if (completion_status) {
      booking.completion_status = completion_status;
    }
    if (arrival_status) {
      booking.arrival_status = arrival_status;
    }
    if (feedback_status) {
      booking.feedback_status = feedback_status;
    }

    // Update admin verification
    booking.adminVerification.isVerified = true;
    booking.adminVerification.verifiedBy = req.user._id;
    booking.adminVerification.verifiedAt = new Date();
    booking.adminVerification.notes = notes || "";
    booking.adminVerification.completionVerified = verifyCompletion || false;
    booking.adminVerification.arrivalVerified = verifyArrival || false;
    booking.adminVerification.feedbackVerified = verifyFeedback || false;

    await booking.save();

    // Auto-update provider reliability score
    await ReliabilityScoreService.updateProviderScore(booking.provider);

    res.json({
      success: true,
      data: booking,
      message: "Job status verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update job status and auto-calculate reliability score
// @route PUT /api/admin/update-job-status/:jobId
// @access Private (Admin only)
export const updateJobStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { jobId } = req.params;
    const { completion_status, arrival_status, feedback_status } = req.body;

    const updatedBooking = await ReliabilityScoreService.updateJobStatus(jobId, {
      completion_status,
      arrival_status,
      feedback_status
    });

    res.json({
      success: true,
      data: updatedBooking,
      message: "Job status updated and reliability score recalculated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update all provider reliability scores
// @route POST /api/admin/update-all-scores
// @access Private (Admin only)
export const updateAllScores = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    await ReliabilityScoreService.updateAllProviderScores();

    res.json({
      success: true,
      message: "All provider reliability scores updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get reliability score trends and analytics
// @route GET /api/admin/reliability-analytics
// @access Private (Admin only)
export const getReliabilityAnalytics = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Get providers with trend predictions
    const providers = await Provider.find({}).select("name category reliabilityScore");
    const analytics = [];

    for (const provider of providers) {
      const trendPrediction = await ReliabilityScoreService.predictReliabilityTrend(provider._id);
      analytics.push({
        providerId: provider._id,
        providerName: provider.name,
        category: provider.category,
        currentScore: provider.reliabilityScore,
        trend: trendPrediction.trend,
        prediction: trendPrediction.prediction,
        confidence: trendPrediction.confidence
      });
    }

    // Sort by current score
    analytics.sort((a, b) => b.currentScore - a.currentScore);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
