import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, Clock, CheckCircle, Star, Award } from "lucide-react";

export default function ReliabilityScore({ providerId }) {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReliabilityScore();
  }, [providerId]);

  const fetchReliabilityScore = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/reliability/${providerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setScoreData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reliability score:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliability Score</h3>
        <p className="text-gray-500">No performance data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Reliability Score
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(scoreData.score)} ${getScoreColor(scoreData.score)}`}>
          {scoreData.score}/100
        </div>
      </div>

      {/* Main Score Display */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-gray-900">{scoreData.score}</div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  scoreData.score >= 80 ? "bg-green-500" :
                  scoreData.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${scoreData.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {scoreData.score >= 80 ? "Excellent" :
               scoreData.score >= 60 ? "Good" : "Needs Improvement"}
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Performance Breakdown</h4>
        
        <div className="space-y-3">
          {/* Job Completion Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Job Completion Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{scoreData.breakdown.completionRate}%</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${scoreData.breakdown.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* On-Time Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">On-Time Arrival Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{scoreData.breakdown.onTimeRate}%</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${scoreData.breakdown.onTimeRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Positive Feedback Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-700">Positive Feedback Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{scoreData.breakdown.positiveFeedbackRate}%</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${scoreData.breakdown.positiveFeedbackRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Total Jobs</div>
            <div className="font-semibold text-gray-900">{scoreData.metrics.totalJobs}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Completed Jobs</div>
            <div className="font-semibold text-gray-900">{scoreData.metrics.completedJobs}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">On-Time Jobs</div>
            <div className="font-semibold text-gray-900">{scoreData.metrics.onTimeJobs}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Positive Reviews</div>
            <div className="font-semibold text-gray-900">{scoreData.metrics.positiveFeedbackJobs}</div>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">AI-Powered Score</p>
            <p className="text-xs text-blue-700">
              This score is automatically calculated using machine learning algorithms based on 
              job completion (40%), on-time arrival (30%), and customer satisfaction (30%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

