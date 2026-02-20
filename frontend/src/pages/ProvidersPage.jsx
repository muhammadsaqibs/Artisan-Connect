// top of file
const API = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getPlaceholderImage } from "../utils/placeholders";
import { Star, DollarSign } from "lucide-react";
import ServiceBookingCard from "../components/ServiceBookingCard";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/api/providers`)
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
        `${API}/api/bookings`,
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
          {providers.map((provider) => (
            <ServiceBookingCard 
              key={provider._id} 
              provider={provider} 
              onBook={handleBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}


