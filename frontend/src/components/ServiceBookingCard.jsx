import { useState } from "react";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, Star, Award } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";
import ReliabilityScore from "./ReliabilityScore";

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

  const [showBookingForm, setShowBookingForm] = useState(false);

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

  const handleBookingSubmit = (e) => {
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

    onBook(bookingData);
    setShowBookingForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Provider Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-4">
          <img
            src={provider.profilePicture ? (provider.profilePicture.startsWith("http") ? provider.profilePicture : `http://localhost:5000${provider.profilePicture}`) : getPlaceholderImage(64)}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover bg-gray-200"
            onError={(e) => {
              e.target.src = getPlaceholderImage(64);
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
            <p className="text-gray-600">{provider.category}{provider.subCategory ? ` / ${provider.subCategory}` : ""}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{provider.rating || 0}</span>
                <span className="text-sm text-gray-500">({provider.numReviews || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">${provider.hourlyRate}/hr</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                provider.isAvailable 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {provider.isAvailable ? "Available" : "Not Available"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="p-6">
        {provider.bio && (
          <p className="text-gray-700 mb-4">{provider.bio}</p>
        )}
        
        {provider.skills && provider.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
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
        <div className="mb-4">
          <ReliabilityScore providerId={provider._id} />
        </div>

        {/* Booking Button */}
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          disabled={!provider.isAvailable}
          className={`w-full py-3 px-4 rounded-lg font-medium transition ${
            provider.isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {provider.isAvailable ? "Book This Service" : "Currently Unavailable"}
        </button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="border-t p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Service</h4>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Confirm Booking (COD)
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
