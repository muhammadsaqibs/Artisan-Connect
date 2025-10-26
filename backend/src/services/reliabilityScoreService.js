import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

/**
 * Professional Reliability Score Calculation System
 * Uses exact formula: (CompletionRate * 0.4) + (OnTimeRate * 0.3) + (PositiveFeedbackRate * 0.3)
 * Auto-updates after each completed job with no admin bias
 */

export class ReliabilityScoreService {
  /**
   * Calculate reliability score for a provider using exact formula
   * @param {string} providerId - Provider ID
   * @returns {Promise<number>} - Reliability score (0-100)
   */
  static async calculateReliabilityScore(providerId) {
    try {
      // Get all bookings for the provider
      const bookings = await Booking.find({
        provider: providerId
      });

      if (bookings.length === 0) {
        return 0; // No jobs, score is 0
      }

      // Calculate the three key metrics
      const metrics = this.calculateMetrics(providerId, bookings);
      
      // Apply exact formula: (CompletionRate * 0.4) + (OnTimeRate * 0.3) + (PositiveFeedbackRate * 0.3)
      const score = this.applyExactFormula(metrics);
      
      return Math.round(score);
    } catch (error) {
      console.error("Error calculating reliability score:", error);
      return 0;
    }
  }

  /**
   * Calculate the three key performance metrics
   * @param {string} providerId - Provider ID
   * @param {Array} bookings - All bookings for the provider
   * @returns {Promise<Object>} - Metrics object
   */
  static async calculateMetrics(providerId, bookings) {
    // 1. Job Completion Rate (Weight: 40%)
    const totalJobs = bookings.length;
    const completedJobs = bookings.filter(booking => 
      booking.completion_status === "Completed"
    ).length;
    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    // 2. On-Time Arrival Rate (Weight: 30%)
    const onTimeJobs = bookings.filter(booking => 
      booking.arrival_status === "On Time"
    ).length;
    const onTimeRate = totalJobs > 0 ? (onTimeJobs / totalJobs) * 100 : 0;

    // 3. Positive Feedback Rate (Weight: 30%)
    const positiveFeedbackJobs = bookings.filter(booking => 
      booking.feedback_status === "Positive"
    ).length;
    const positiveFeedbackRate = totalJobs > 0 ? (positiveFeedbackJobs / totalJobs) * 100 : 0;

    return {
      completionRate,
      onTimeRate,
      positiveFeedbackRate,
      totalJobs,
      completedJobs,
      onTimeJobs,
      positiveFeedbackJobs
    };
  }

  /**
   * Apply exact formula: (CompletionRate * 0.4) + (OnTimeRate * 0.3) + (PositiveFeedbackRate * 0.3)
   * @param {Object} metrics - Performance metrics
   * @returns {number} - Calculated score
   */
  static applyExactFormula(metrics) {
    const weights = {
      completionRate: 0.40,    // 40% weight
      onTimeRate: 0.30,        // 30% weight
      positiveFeedbackRate: 0.30  // 30% weight
    };

    // Exact formula implementation
    const score = 
      (metrics.completionRate * weights.completionRate) +
      (metrics.onTimeRate * weights.onTimeRate) +
      (metrics.positiveFeedbackRate * weights.positiveFeedbackRate);

    // Ensure score is between 0-100
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Update provider reliability score and save to database
   * @param {string} providerId - Provider ID
   */
  static async updateProviderScore(providerId) {
    try {
      const score = await this.calculateReliabilityScore(providerId);
      
      // Update provider's reliability score
      await Provider.findByIdAndUpdate(providerId, {
        reliabilityScore: score,
        lastScoreUpdate: new Date()
      });

      console.log(`✅ Updated reliability score for provider ${providerId}: ${score}`);
      return score;
    } catch (error) {
      console.error("Error updating provider score:", error);
      throw error;
    }
  }

  /**
   * Update job status and auto-calculate reliability score
   * @param {string} bookingId - Booking ID
   * @param {Object} statusUpdates - Status updates
   */
  static async updateJobStatus(bookingId, statusUpdates) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Update job statuses
      if (statusUpdates.completion_status) {
        booking.completion_status = statusUpdates.completion_status;
      }
      if (statusUpdates.arrival_status) {
        booking.arrival_status = statusUpdates.arrival_status;
      }
      if (statusUpdates.feedback_status) {
        booking.feedback_status = statusUpdates.feedback_status;
      }

      // Auto-calculate and update reliability metrics
      const metrics = await this.calculateMetrics(booking.provider, [booking]);
      booking.completion_rate = metrics.completionRate;
      booking.on_time_rate = metrics.onTimeRate;
      booking.feedback_rate = metrics.positiveFeedbackRate;
      booking.last_updated = new Date();

      await booking.save();

      // Auto-update provider's overall reliability score
      await this.updateProviderScore(booking.provider);

      return booking;
    } catch (error) {
      console.error("Error updating job status:", error);
      throw error;
    }
  }

  /**
   * Determine arrival status based on timing
   * @param {Date} scheduledTime - Scheduled arrival time
   * @param {Date} actualTime - Actual arrival time
   * @returns {string} - Arrival status
   */
  static determineArrivalStatus(scheduledTime, actualTime) {
    if (!actualTime) return "Missed";

    const timeDifference = Math.abs(actualTime - scheduledTime);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (timeDifference <= fiveMinutes) {
      return "On Time";
    } else if (timeDifference <= thirtyMinutes) {
      return "Late";
    } else {
      return "Missed";
    }
  }

  /**
   * Determine feedback status based on customer rating
   * @param {number} rating - Customer rating (1-5)
   * @returns {string} - Feedback status
   */
  static determineFeedbackStatus(rating) {
    if (rating >= 4) return "Positive";
    if (rating === 3) return "Neutral";
    return "Negative";
  }

  /**
   * Determine completion status based on job logs
   * @param {string} workStatus - Current work status
   * @param {boolean} customerConfirmed - Customer confirmation
   * @returns {string} - Completion status
   */
  static determineCompletionStatus(workStatus, customerConfirmed = false) {
    if (workStatus === "completed" && customerConfirmed) {
      return "Completed";
    } else if (workStatus === "completed" && !customerConfirmed) {
      return "Partially Completed";
    } else {
      return "Not Completed";
    }
  }

  /**
   * Get reliability score breakdown for admin dashboard
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} - Score breakdown
   */
  static async getScoreBreakdown(providerId) {
    try {
      const bookings = await Booking.find({
        provider: providerId
      });

      if (bookings.length === 0) {
        return {
          score: 0,
          breakdown: {
            completionRate: 0,
            onTimeRate: 0,
            positiveFeedbackRate: 0
          },
          metrics: {
            totalJobs: 0,
            completedJobs: 0,
            onTimeJobs: 0,
            positiveFeedbackJobs: 0
          },
          recentJobs: []
        };
      }

      const metrics = await this.calculateMetrics(providerId, bookings);
      const score = this.applyExactFormula(metrics);

      // Get recent jobs for admin review
      const recentJobs = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(booking => ({
          job_id: booking._id,
          artisan_id: booking.provider,
          completion_status: booking.completion_status,
          arrival_status: booking.arrival_status,
          feedback_status: booking.feedback_status,
          completion_rate: booking.completion_rate,
          on_time_rate: booking.on_time_rate,
          feedback_rate: booking.feedback_rate,
          reliability_score: booking.reliability_score,
          last_updated: booking.last_updated,
          adminVerified: booking.adminVerification.isVerified
        }));

      return {
        score: Math.round(score),
        breakdown: {
          completionRate: Math.round(metrics.completionRate),
          onTimeRate: Math.round(metrics.onTimeRate),
          positiveFeedbackRate: Math.round(metrics.positiveFeedbackRate)
        },
        metrics: {
          totalJobs: metrics.totalJobs,
          completedJobs: metrics.completedJobs,
          onTimeJobs: metrics.onTimeJobs,
          positiveFeedbackJobs: metrics.positiveFeedbackJobs
        },
        recentJobs
      };
    } catch (error) {
      console.error("Error getting score breakdown:", error);
      return null;
    }
  }

  /**
   * Update all provider reliability scores (for batch processing)
   */
  static async updateAllProviderScores() {
    try {
      const providers = await Provider.find({});
      
      for (const provider of providers) {
        await this.updateProviderScore(provider._id);
      }
      
      console.log(`✅ Updated reliability scores for ${providers.length} providers`);
    } catch (error) {
      console.error("Error updating all provider scores:", error);
    }
  }

  /**
   * ML Prediction: Predict future reliability trends
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} - Prediction data
   */
  static async predictReliabilityTrend(providerId) {
    try {
      const bookings = await Booking.find({
        provider: providerId
      }).sort({ createdAt: 1 });

      if (bookings.length < 3) {
        return {
          trend: "Insufficient Data",
          prediction: "Need more job history",
          confidence: 0
        };
      }

      // Simple linear regression for trend prediction
      const scores = bookings.map(booking => booking.reliability_score || 0);
      const n = scores.length;
      
      // Calculate trend using simple linear regression
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      
      for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += scores[i];
        sumXY += i * scores[i];
        sumXX += i * i;
      }
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Predict next score
      const nextScore = slope * n + intercept;
      const trend = slope > 0.5 ? "Improving" : slope < -0.5 ? "Declining" : "Stable";
      const confidence = Math.min(Math.abs(slope) * 20, 100); // Convert to percentage

      return {
        trend,
        prediction: Math.round(Math.max(0, Math.min(100, nextScore))),
        confidence: Math.round(confidence),
        currentScore: scores[scores.length - 1],
        historicalScores: scores.slice(-10) // Last 10 scores
      };
    } catch (error) {
      console.error("Error predicting reliability trend:", error);
      return {
        trend: "Error",
        prediction: "Unable to predict",
        confidence: 0
      };
    }
  }
}

export default ReliabilityScoreService;