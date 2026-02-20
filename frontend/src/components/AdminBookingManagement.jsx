// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle, Eye } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";

export default function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      
      const response = await axios.get(
        `API/api/bookings/admin?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBooking = async (bookingId, isVerified, notes = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `API/api/bookings/${bookingId}/verify`,
        { isVerified, notes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchBookings();
        setShowModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Error verifying booking:", error);
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
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
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

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={booking.provider.profilePicture ? (booking.provider.profilePicture.startsWith("http") ? booking.provider.profilePicture : `API${booking.provider.profilePicture}`) : getPlaceholderImage(40)}
                        alt={booking.provider.name}
                        className="h-10 w-10 rounded-full object-cover bg-gray-200"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage(40);
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.provider.name}</div>
                        <div className="text-sm text-gray-500">{booking.provider.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.serviceDetails.serviceName}</div>
                    <div className="text-sm text-gray-500">{booking.serviceDetails.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.bookingDetails.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{booking.bookingDetails.preferredTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${booking.pricing.totalAmount}</div>
                    <div className="text-sm text-gray-500">{booking.pricing.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkStatusColor(booking.workStatus)}`}>
                        {booking.workStatus.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.adminVerification ? (
                      <div className="flex items-center gap-1">
                        {booking.adminVerification.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {booking.adminVerification.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not verified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.customer.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Provider</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.provider.name}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.provider.category}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Service Details</h4>
                  <p className="text-sm text-gray-600">{selectedBooking.serviceDetails.serviceName}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.serviceDetails.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Booking Date</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedBooking.bookingDetails.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{selectedBooking.bookingDetails.preferredTime}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Pricing</h4>
                    <p className="text-sm text-gray-600">${selectedBooking.pricing.totalAmount}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.pricing.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.bookingDetails.address.street}, {selectedBooking.bookingDetails.address.area}, {selectedBooking.bookingDetails.address.city}
                  </p>
                </div>

                {selectedBooking.specialInstructions && (
                  <div>
                    <h4 className="font-medium text-gray-900">Special Instructions</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.bookingDetails.specialInstructions}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleVerifyBooking(selectedBooking._id, true)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                  >
                    Verify Booking
                  </button>
                  <button
                    onClick={() => handleVerifyBooking(selectedBooking._id, false, "Booking rejected")}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









