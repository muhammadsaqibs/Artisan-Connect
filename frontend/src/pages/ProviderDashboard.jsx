// ProviderDashboard.jsx
const API = import.meta.env.VITE_API_URL;
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BarChart3, Wrench, TrendingUp, Calendar } from "lucide-react";
import Alert from "../components/Alert.jsx";
import { getPlaceholderImage } from "../utils/placeholders";

export default function ProviderDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({
    totalServices: 0,
    completedServices: 0,
    rating: 0,
    reliabilityScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "provider") {
      navigate("/dashboard");
      return;
    }
    fetchProviderData();
  }, [user, navigate]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch provider profile if exists
      if (user?.providerProfileId) {
        const { data } = await axios.get(`${API}/api/providers/${user.providerProfileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.data) {
          setStats({
            totalServices: data.data.totalServices || 0,
            completedServices: data.data.completedServices || 0,
            rating: data.data.rating || 0,
            reliabilityScore: data.data.reliabilityScore || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
      setAlert({ type: "error", message: "Failed to load provider data" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Provider Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow p-8 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `${API}${user.profilePicture}`) : getPlaceholderImage(120)}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
            onError={(e) => {
              e.target.src = getPlaceholderImage(120);
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{user?.name || "Provider"}</h1>
            <p className="text-indigo-100">{user?.email}</p>
            {!user?.providerProfileId && (
              <button
                onClick={() => navigate("/provider-onboarding")}
                className="mt-3 px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Complete Your Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Services</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalServices}</p>
            </div>
            <Wrench className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedServices}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rating.toFixed(1)}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Reliability</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reliabilityScore}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/provider-onboarding")}
            className="p-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
          >
            📋 Edit Profile
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            👤 Account Settings
          </button>
          <button
            onClick={() => fetchProviderData()}
            className="p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tips for Success</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Complete your profile to appear in search results</li>
          <li>✓ Maintain high reliability score by completing services on time</li>
          <li>✓ Respond to booking requests quickly</li>
          <li>✓ Provide quality service to get better ratings</li>
        </ul>
      </div>
    </div>
  );
}
