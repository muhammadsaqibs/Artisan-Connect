// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, Star, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";
import CustomerReview from "./CustomerReview";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/api/bookings/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getWorkStatusColor = (workStatus) => {
    switch (workStatus) {
      case "booked": return "bg-blue-100 text-blue-800";
      case "started": return "bg-purple-100 text-purple-800";
      case "in-progress": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      case "in-progress": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Service Booking History</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {filter === "all" 
              ? "You haven't made any service bookings yet." 
              : `No ${filter} bookings found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.provider.profilePicture ? (booking.provider.profilePicture.startsWith("http") ? booking.provider.profilePicture : `API${booking.provider.profilePicture}`) : getPlaceholderImage(48)}
                    alt={booking.provider.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(48);
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.provider.name}</h3>
                    <p className="text-gray-600">{booking.serviceDetails.serviceName}</p>
                    <p className="text-sm text-gray-500">{booking.serviceDetails.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkStatusColor(booking.workStatus)}`}>
                    {booking.workStatus.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(booking.bookingDetails.bookingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{booking.bookingDetails.preferredTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{booking.bookingDetails.address.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">${booking.pricing.totalAmount}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700 mb-2">{booking.serviceDetails.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Duration: {booking.bookingDetails.duration} hours</span>
                  <span>Payment: {booking.pricing.paymentMethod}</span>
                  <span>Rate: ${booking.pricing.hourlyRate}/hr</span>
                </div>
              </div>

              {booking.adminVerification && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {booking.adminVerification.isVerified ? "Verified by Admin" : "Pending Admin Verification"}
                    </span>
                  </div>
                  {booking.adminVerification.notes && (
                    <p className="text-sm text-blue-700 mt-1">{booking.adminVerification.notes}</p>
                  )}
                </div>
              )}

              {/* Customer Review Section */}
              {booking.status === "completed" && (
                <div className="mt-4">
                  <CustomerReview 
                    booking={booking} 
                    onReviewSubmit={() => fetchBookings()} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
