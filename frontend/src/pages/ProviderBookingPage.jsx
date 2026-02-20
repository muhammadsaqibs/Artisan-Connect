// top of file
const API = import.meta.env.VITE_API_URL;
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Alert from "../components/Alert.jsx";
import { Calendar, MapPin, DollarSign, Clock, CheckCircle } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";

export default function ProviderBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [form, setForm] = useState({
    scheduledTime: "",
    notes: "",
    address: "",
    city: "",
    area: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (!user) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }

    axios
      .get(`API/api/providers/${id}`)
      .then((res) => setProvider(res.data.data))
      .catch(() => setAlert({ type: "error", message: "Provider not found" }))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.scheduledTime || !form.address || !form.city) {
      setAlert({ type: "warning", message: "Please fill in all required fields" });
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        providerId: id,
        category: provider.category,
        subCategory: provider.subCategory,
        scheduledTime: form.scheduledTime,
        notes: form.notes,
        addressSnapshot: {
          city: form.city,
          area: form.area,
          address: form.address,
          lat: form.lat ? Number(form.lat) : undefined,
          lng: form.lng ? Number(form.lng) : undefined,
        },
        pricing: {
          hourlyRate: provider.hourlyRate,
          estimatedHours: 2, // Default estimate
          bookingFee: 500,
          settlement: "COS",
        },
      };

      const { data } = await axios.post(
        "API/api/requests",
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlert({ type: "success", message: "Service request submitted successfully!" });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Failed to submit request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Alert type="error" message="Provider not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div className="text-center mb-4">
              <img
                src={provider.profilePicture ? (provider.profilePicture.startsWith("http") ? provider.profilePicture : `API${provider.profilePicture}`) : getPlaceholderImage(96)}
                alt={provider.name}
                className="w-24 h-24 rounded-full mx-auto object-cover mb-3 bg-gray-200"
                onError={(e) => {
                  e.target.src = getPlaceholderImage(96);
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
              <p className="text-gray-600">{provider.category}{provider.subCategory ? ` / ${provider.subCategory}` : ""}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">${provider.hourlyRate}/hr</span>
              </div>
              {provider.rating > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>{provider.rating} ({provider.numReviews} reviews)</span>
                </div>
              )}
              {provider.reliabilityScore && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Reliability:</span>
                  <span className="text-green-600">{provider.reliabilityScore}/100</span>
                </div>
              )}
            </div>

            {provider.bio && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">{provider.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Service</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={form.scheduledTime}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Karachi"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Clifton"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Latitude (optional)</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={form.lat}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 24.8065"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Longitude (optional)</label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={form.lng}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 67.0311"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="4"
                  placeholder="Describe your service requirements..."
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Estimated Cost</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${(provider.hourlyRate * 2 + 500).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  * Based on 2 hours estimate + booking fee. Final cost will be confirmed by provider.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
                >
                  {submitting ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

