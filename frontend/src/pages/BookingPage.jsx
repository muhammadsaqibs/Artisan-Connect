// top of file
const API = import.meta.env.VITE_API_URL;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, MapPin, DollarSign, User, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";
import ReliabilityScore from "../components/ReliabilityScore";

export default function BookingPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [bookingDetails, setBookingDetails] = useState({
    serviceName: "",
    description: "",
    bookingDate: "",
    preferredTime: "Morning",
    duration: 1,
    address: {
      street: "",
      city: "",
      area: "",
    },
    specialInstructions: "",
  });

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      const response = await axios.get(`API/api/providers/${providerId}`);
      if (response.data.success) {
        setProvider(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
      setAlert({ show: true, message: "Failed to load provider details", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBookingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBookingDetails(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ show: true, message: "Please login to book a service", type: "error" });
        return;
      }

      const totalAmount = bookingDetails.duration * provider.hourlyRate;
      
      const bookingData = {
        providerId: provider._id,
        serviceDetails: {
          serviceName: bookingDetails.serviceName,
          description: bookingDetails.description,
          category: provider.category,
          subCategory: provider.subCategory,
        },
        bookingDetails: {
          bookingDate: bookingDetails.bookingDate,
          preferredTime: bookingDetails.preferredTime,
          duration: bookingDetails.duration,
          address: bookingDetails.address,
          specialInstructions: bookingDetails.specialInstructions,
        },
        pricing: {
          hourlyRate: provider.hourlyRate,
          totalHours: bookingDetails.duration,
          totalAmount,
          paymentMethod: "COD",
        },
      };

      const response = await axios.post(
        "API/api/bookings",
        bookingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAlert({ show: true, message: "Service booked successfully!", type: "success" });
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
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
          <p className="text-gray-600 mb-4">The provider you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/providers")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Providers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/providers")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Book Service</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {alert.show && (
          <div className={`mb-6 p-4 rounded-lg ${
            alert.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {alert.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <img
                  src={provider.profilePicture ? (provider.profilePicture.startsWith("http") ? provider.profilePicture : `API${provider.profilePicture}`) : getPlaceholderImage(96)}
                  alt={provider.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover bg-gray-200 mb-4"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(96);
                  }}
                />
                <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                <p className="text-gray-600">{provider.category}{provider.subCategory ? ` / ${provider.subCategory}` : ""}</p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{provider.rating || 0}</span>
                    <span className="text-sm text-gray-500">({provider.numReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">${provider.hourlyRate}/hr</span>
                  </div>
                </div>
                <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                  provider.isAvailable 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {provider.isAvailable ? "Available" : "Not Available"}
                </div>
              </div>

              {provider.bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 text-sm">{provider.bio}</p>
                </div>
              )}

              {provider.skills && provider.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, index) => (
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

              {/* Reliability Score */}
              <ReliabilityScore providerId={provider._id} />
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Booking Details</h3>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="serviceName"
                      value={bookingDetails.serviceName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Plumbing Repair"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Date *
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={bookingDetails.bookingDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description *
                  </label>
                  <textarea
                    name="description"
                    value={bookingDetails.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the service you need..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      value={bookingDetails.preferredTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Morning">Morning (8AM - 12PM)</option>
                      <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="Evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Hours) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={bookingDetails.duration}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Cost
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-lg font-semibold text-green-600">
                      ${(bookingDetails.duration * provider.hourlyRate).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={bookingDetails.address.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={bookingDetails.address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Karachi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area *
                    </label>
                    <input
                      type="text"
                      name="address.area"
                      value={bookingDetails.address.area}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Gulshan-e-Iqbal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={bookingDetails.specialInstructions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requirements or instructions..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/providers")}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || !provider.isAvailable}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      provider.isAvailable && !bookingLoading
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {bookingLoading ? "Booking..." : provider.isAvailable ? "Confirm Booking (COD)" : "Provider Unavailable"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









