import ReliabilityScoreService from "../services/reliabilityScoreService.js";

// @desc Get provider reliability score breakdown
// @route GET /api/reliability/:providerId
// @access Private
export const getReliabilityScore = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const scoreBreakdown = await ReliabilityScoreService.getScoreBreakdown(providerId);
    
    if (!scoreBreakdown) {
      return res.status(404).json({
        success: false,
        message: "Provider not found or no data available",
      });
    }

    res.json({
      success: true,
      data: scoreBreakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update all provider reliability scores
// @route POST /api/reliability/update-all
// @access Private (Admin only)
export const updateAllScores = async (req, res) => {
  try {
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









