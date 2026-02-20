// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Calendar, Wrench, Star, TrendingUp } from "lucide-react";
import Alert from "../components/Alert.jsx";
import { getPlaceholderImage } from "../utils/placeholders";
import BookingHistory from "../components/BookingHistory";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Alert */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
      
      {/* User Profile Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-4">
        <img
          src={user?.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `${API}${user.profilePicture}`) : getPlaceholderImage(100)}
          alt="profile"
          className="w-16 h-16 rounded-full object-cover bg-gray-200"
          onError={(e) => {
            e.target.src = getPlaceholderImage(100);
          }}
        />
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name || "User"}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Service Bookings Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Service History</h3>
        </div>
        <BookingHistory />
      </div>

      {/* Service Status Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">How Our System Works</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Book Service</h4>
            <p className="text-xs text-gray-500">Choose a provider and book your service</p>
        </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Service Completed</h4>
            <p className="text-xs text-gray-500">Provider completes your service</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Leave Review</h4>
            <p className="text-xs text-gray-500">Rate your experience to help others</p>
          </div>
          </div>
        </div>
    </div>
  );
}



