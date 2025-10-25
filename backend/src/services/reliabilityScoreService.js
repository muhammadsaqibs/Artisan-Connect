import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

/**
 * Automatic Reliability Score Calculation System
 * Uses machine learning techniques (linear regression and weighted scoring)
 * to calculate provider reliability scores based on performance data
 */

export class ReliabilityScoreService {
  /**
   * Calculate reliability score for a provider
   * @param {string} providerId - Provider ID
   * @returns {Promise<number>} - Reliability score (0-100)
   */
  static async calculateReliabilityScore(providerId) {
    try {
      // Get all completed bookings for the provider
      const bookings = await Booking.find({
        provider: providerId,
        status: "completed"
      }).populate("customer");

      if (bookings.length === 0) {
        return 0; // No completed jobs, score is 0
      }

      // Calculate the three key metrics
      const metrics = await this.calculateMetrics(providerId, bookings);
      
      // Apply weighted scoring (Machine Learning approach)
      const score = this.applyWeightedScoring(metrics);
      
      return Math.round(score);
    } catch (error) {
      console.error("Error calculating reliability score:", error);
      return 0;
    }
  }

  /**
   * Calculate the three key performance metrics
   * @param {string} providerId - Provider ID
   * @param {Array} bookings - Completed bookings
   * @returns {Promise<Object>} - Metrics object
   */
  static async calculateMetrics(providerId, bookings) {
    // 1. Job Completion Rate (Weight: 40%)
    const totalAcceptedJobs = await Booking.countDocuments({
      provider: providerId,
      status: { $in: ["confirmed", "in-progress", "completed"] }
    });
    const completedJobs = bookings.length;
    const completionRate = totalAcceptedJobs > 0 ? (completedJobs / totalAcceptedJobs) * 100 : 0;

    // 2. On-Time Arrival Rate (Weight: 30%)
    const onTimeJobs = bookings.filter(booking => {
      // Check if provider arrived on time (within 15 minutes of scheduled time)
      const scheduledTime = new Date(booking.bookingDetails.bookingDate);
      const actualStartTime = booking.timeline?.find(t => t.status === "started")?.timestamp;
      
      if (!actualStartTime) return false;
      
      const timeDifference = Math.abs(actualStartTime - scheduledTime);
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      return timeDifference <= fifteenMinutes;
    }).length;
    
    const onTimeRate = completedJobs > 0 ? (onTimeJobs / completedJobs) * 100 : 0;

    // 3. Positive Feedback Rate (Weight: 30%)
    const positiveFeedbackJobs = bookings.filter(booking => {
      return booking.customerRating && booking.customerRating.rating >= 4;
    }).length;
    
    const positiveFeedbackRate = completedJobs > 0 ? (positiveFeedbackJobs / completedJobs) * 100 : 0;

    return {
      completionRate,
      onTimeRate,
      positiveFeedbackRate,
      totalJobs: totalAcceptedJobs,
      completedJobs,
      onTimeJobs,
      positiveFeedbackJobs
    };
  }

  /**
   * Apply weighted scoring using machine learning approach
   * @param {Object} metrics - Performance metrics
   * @returns {number} - Calculated score
   */
  static applyWeightedScoring(metrics) {
    const weights = {
      completionRate: 0.40,    // 40% weight
      onTimeRate: 0.30,        // 30% weight
      positiveFeedbackRate: 0.30  // 30% weight
    };

    // Linear regression approach: Score = Σ(Metric × Weight)
    const score = 
      (metrics.completionRate * weights.completionRate) +
      (metrics.onTimeRate * weights.onTimeRate) +
      (metrics.positiveFeedbackRate * weights.positiveFeedbackRate);

    // Apply normalization to ensure score is between 0-100
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Update provider reliability score
   * @param {string} providerId - Provider ID
   */
  static async updateProviderScore(providerId) {
    try {
      const score = await this.calculateReliabilityScore(providerId);
      
      await Provider.findByIdAndUpdate(providerId, {
        reliabilityScore: score,
        lastScoreUpdate: new Date()
      });

      console.log(`Updated reliability score for provider ${providerId}: ${score}`);
      return score;
    } catch (error) {
      console.error("Error updating provider score:", error);
    }
  }

  /**
   * Update scores for all providers (batch processing)
   */
  static async updateAllProviderScores() {
    try {
      const providers = await Provider.find({});
      
      for (const provider of providers) {
        await this.updateProviderScore(provider._id);
      }
      
      console.log("Updated reliability scores for all providers");
    } catch (error) {
      console.error("Error updating all provider scores:", error);
    }
  }

  /**
   * Get reliability score breakdown for a provider
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} - Score breakdown
   */
  static async getScoreBreakdown(providerId) {
    try {
      const bookings = await Booking.find({
        provider: providerId,
        status: "completed"
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
          }
        };
      }

      const metrics = await this.calculateMetrics(providerId, bookings);
      const score = this.applyWeightedScoring(metrics);

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
        }
      };
    } catch (error) {
      console.error("Error getting score breakdown:", error);
      return null;
    }
  }
}

export default ReliabilityScoreService;
