// top of file
const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import axios from "axios";
import { ToggleLeft, ToggleRight, CheckCircle, XCircle } from "lucide-react";

export default function ProviderAvailabilityToggle({ isAvailable, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API}/api/providers/availability`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        onToggle(response.data.data.isAvailable);
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Availability Status</h3>
          <p className="text-sm text-gray-600">
            {isAvailable 
              ? "You are currently available for new bookings" 
              : "You are currently not accepting new bookings"
            }
          </p>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isAvailable ? "bg-blue-600" : "bg-gray-200"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isAvailable ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {isAvailable ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Available for Bookings</span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Not Available</span>
          </>
        )}
      </div>

      {loading && (
        <div className="mt-2 text-sm text-gray-500">Updating availability...</div>
      )}
    </div>
  );
}









