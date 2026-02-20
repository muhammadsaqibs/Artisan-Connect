// top of file
const API = import.meta.env.VITE_API_URL;
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, DollarSign, Star, X, Award } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";
import axios from "axios";

export default function ServiceBookingCard({ provider, onBook }) {
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

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reliabilityScore, setReliabilityScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);

  // Fetch reliability score
  useEffect(() => {
    const fetchReliabilityScore = async () => {
      try {
        setLoadingScore(true);
        const response = await axios.get(`API/api/reliability/${provider._id}`);
        if (response.data.success) {
          setReliabilityScore(response.data.data.score);
        }
      } catch (error) {
        console.error("Error fetching reliability score:", error);
        setReliabilityScore(0);
      } finally {
        setLoadingScore(false);
      }
    };

    if (provider._id) {
      fetchReliabilityScore();
    }
  }, [provider._id]);

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

    await onBook(bookingData);
    setShowBookingModal(false);
    // Reset form
    setBookingDetails({
      serviceName: "",
      description: "",
      bookingDate: "",
      preferredTime: "Morning",
      duration: 1,
      address: { street: "", city: "", area: "" },
      specialInstructions: "",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        {/* Provider Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <img
              src={provider.profilePicture ? (provider.profilePicture.startsWith("http") ? provider.profilePicture : `API${provider.profilePicture}`) : getPlaceholderImage(64)}
              alt={provider.name}
              className="w-16 h-16 rounded-full object-cover bg-gray-200"
              onError={(e) => {
                e.target.src = getPlaceholderImage(64);
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
              <p className="text-gray-600">{provider.category}{provider.subCategory ? ` / ${provider.subCategory}` : ""}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{provider.rating || 0}</span>
                  <span className="text-sm text-gray-500">({provider.numReviews || 0})</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">${provider.hourlyRate}/hr</span>
                </div>
                {reliabilityScore !== null && (
                  <div className="flex items-center gap-1">
                    <Award className={`w-4 h-4 ${getScoreColor(reliabilityScore)}`} />
                    <span className={`text-sm font-bold ${getScoreColor(reliabilityScore)}`}>
                      {reliabilityScore}% Reliable
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Provider Info */}
        <div className="p-6">
          {provider.bio && (
            <p className="text-gray-700 mb-4 text-sm line-clamp-3">{provider.bio}</p>
          )}
          
          {provider.skills && provider.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {provider.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {provider.skills.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{provider.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={`w-full py-3 px-4 rounded-lg font-medium transition cursor-pointer text-center ${
            provider.isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500"
          }`}
          onClick={() => provider.isAvailable && setShowBookingModal(true)}>
            {provider.isAvailable ? "Book This Service" : "Currently Unavailable"}
          </div>
        </div>
      </div>

      {/* Professional Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={provider.profilePicture ? (provider.profilePicture.startsWith("http") ? provider.profilePicture : `API${provider.profilePicture}`) : getPlaceholderImage(40)}
                  alt={provider.name}
                  className="w-10 h-10 rounded-full object-cover bg-white"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Book Service</h3>
                  <p className="text-blue-100 text-sm">{provider.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Service Details */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
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
                        <Calendar className="w-4 h-4 inline mr-1" />
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
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
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
                    placeholder="Describe what service you need..."
                  />
                </div>

                {/* Time & Duration */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={bookingDetails.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Morning">Morning (8AM-12PM)</option>
                        <option value="Afternoon">Afternoon (12PM-5PM)</option>
                        <option value="Evening">Evening (5PM-8PM)</option>
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
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Total Cost
                      </label>
                      <div className="px-3 py-2 bg-green-50 border-2 border-green-200 rounded-lg text-lg font-bold text-green-700">
                        ${(bookingDetails.duration * provider.hourlyRate).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Service Location *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="address.street"
                      value={bookingDetails.address.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street Address"
                    />
                    <input
                      type="text"
                      name="address.city"
                      value={bookingDetails.address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="address.area"
                      value={bookingDetails.address.area}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Area"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={bookingDetails.specialInstructions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional notes or special requirements..."
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
