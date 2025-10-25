import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";
import { getPlaceholderImage } from "../utils/placeholders";
import { Star, DollarSign } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/providers")
      .then((res) => setProviders(res.data.data || []))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ show: true, message: "Please login to book a service", type: "error" });
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAlert({ show: true, message: "Service booked successfully!", type: "success" });
        // Optionally redirect to booking history
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error booking service:", error);
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || "Failed to book service", 
        type: "error" 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {alert.show && (
        <div className={`mb-6 p-4 rounded-lg ${
          alert.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {alert.message}
        </div>
      )}
      <h1 className="text-3xl font-bold text-white mb-6">Find Service Providers</h1>
      {loading ? (
        <div className="text-gray-300">Loading providers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Provider Header */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-4">
                  <img
                    src={p.profilePicture ? (p.profilePicture.startsWith("http") ? p.profilePicture : `http://localhost:5000${p.profilePicture}`) : getPlaceholderImage(64)}
                    alt={p.name}
                    className="w-16 h-16 rounded-full object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(64);
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <p className="text-gray-600">{p.category}{p.subCategory ? ` / ${p.subCategory}` : ""}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{p.rating || 0}</span>
                        <span className="text-sm text-gray-500">({p.numReviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">${p.hourlyRate}/hr</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.isAvailable 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {p.isAvailable ? "Available" : "Not Available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              <div className="p-6">
                {p.bio && (
                  <p className="text-gray-700 mb-4 text-sm">{p.bio}</p>
                )}
                
                {p.skills && p.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => navigate(`/book-provider/${p._id}`)}
                  disabled={!p.isAvailable}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    p.isAvailable
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {p.isAvailable ? "Book This Service" : "Currently Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


