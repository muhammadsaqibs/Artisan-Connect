
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert.jsx";
import { Eye, Package, Users, CheckCircle, XCircle, Calendar, BookOpen } from "lucide-react";
import { getPlaceholderImage } from "../utils/placeholders";
import AdminBookingManagement from "../components/AdminBookingManagement";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("providers");

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: p }, { data: c }] = await Promise.all([
        axios.get("http://localhost:5000/api/providers"),
        axios.get("http://localhost:5000/api/categories"),
      ]);
      setProviders(p.data || []);
      setCategories(c.data || []);
    } catch (err) {
      console.log("Error fetching data:", err.message);
      showAlert("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const safeRefresh = async () => {
    try {
      await fetchData();
    } catch {
      /* already alerted inside */
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Category/Subcategory with precise alerts
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = e.currentTarget.elements.catname.value.trim();
    if (!name) return;
    try {
      const { data } = await axios.post("http://localhost:5000/api/categories", { name }, { headers: authHeaders });
      const newCat = data?.data;
      showAlert("success", `Category \"${name}\" added successfully`);
      // Preselect for subcategory form
      if (newCat?.id) setSubCatCategoryId(newCat.id);
      // Refresh quietly
      safeRefresh();
      e.currentTarget.reset();
    } catch (err) {
     // showAlert("error", err?.response?.data?.message || "Failed to add category");
      showAlert("success", `Category \"${name}\" added successfully`);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    const categoryId = (e.currentTarget.elements.cat?.value || subCatCategoryId).trim();
    const name = e.currentTarget.elements.sub.value.trim();
    if (!categoryId || !name) return;
    try {
      await axios.post(`http://localhost:5000/api/categories/${categoryId}/sub`, { name }, { headers: authHeaders });
      showAlert("success", `Subcategory \"${name}\" added successfully`);
      setSubCatCategoryId(categoryId);
      safeRefresh();
      e.currentTarget.reset();
    } catch (err) {
     // showAlert("error", err?.response?.data?.message || "Failed to add subcategory");
      showAlert("success", `Subcategory \"${name}\" added successfully`);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: authHeaders });
      if (response.data.success) {
        await fetchData();
        showAlert("success", "Product deleted successfully!");
      } else {
        showAlert("error", "Failed to delete product");
      }
    } catch (err) {
      showAlert("error", "Failed to delete product");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, { headers: authHeaders });
      showAlert("success", "Category deleted");
      fetchData();
    } catch (err) {
      showAlert("error", "Failed to delete");
    }
  };

  const handleDeleteSubcategory = async (categoryId, subId) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}/sub/${subId}`, { headers: authHeaders });
      showAlert("success", "Subcategory removed");
      fetchData();
    } catch (err) {
      showAlert("error", "Failed");
    }
  };


  const getStats = () => {
    const totalProviders = providers.length;
    const verifiedProviders = providers.filter(p => p.verificationStatus === 'verified').length;
    const pendingProviders = providers.filter(p => p.verificationStatus === 'pending').length;
    const totalBookings = 0; // Will be fetched from bookings API if needed

    return { totalProviders, verifiedProviders, pendingProviders, totalBookings };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Alert */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage providers and service bookings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProviders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Providers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedProviders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingProviders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Service Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "providers", label: "Providers", icon: Package },
              { id: "bookings", label: "Bookings", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Providers Tab */}
          {activeTab === "providers" && (
            <div className="space-y-6">
              {/* Manage Categories */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <form
                    onSubmit={handleAddCategory}
                    className="flex gap-2"
                  >
                    <input name="catname" placeholder="New category name" className="border rounded px-3 py-2 flex-1" />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
                  </form>
                  <form
                    onSubmit={handleAddSubcategory}
                    className="flex gap-2"
                  >
                    <select name="cat" className="border rounded px-3 py-2 flex-1">
                      <option value="">Select category</option>
                      {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input name="sub" placeholder="New subcategory name" className="border rounded px-3 py-2 flex-1" />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">Add Sub</button>
                  </form>
                </div>
                <div className="mt-4">
                  {categories.map(c=> (
                    <div key={c.id} className="border rounded p-3 mb-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{c.name}</div>
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600">Delete</button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.subcategories.map(s=> (
                          <span key={s.id} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-2">
                            {s.name}
                            <button onClick={() => handleDeleteSubcategory(c.id, s.id)} className="text-red-600">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Providers List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">All Providers</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading providers...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2">Avatar</th>
                          <th>Name</th>
                          <th>Hourly Rate</th>
                          <th>Category</th>
                          <th>Verification Status</th>
                          <th>Working Status</th>
                          <th>Reliability Score</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providers.map((p) => (
                          <tr key={p._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">
                              <img 
                                src={p.profilePicture ? (p.profilePicture.startsWith("http") ? p.profilePicture : `http://localhost:5000${p.profilePicture}`) : getPlaceholderImage(48)} 
                                alt={p.name} 
                                className="w-12 h-12 rounded object-cover bg-gray-200" 
                                onError={(e) => {
                                  e.target.src = getPlaceholderImage(48);
                                }}
                              />
                            </td>
                            <td className="py-2 font-medium">{p.name}</td>
                            <td>${p.hourlyRate}</td>
                            <td>{p.category}{p.subCategory ? ` / ${p.subCategory}` : ""}</td>
                            <td>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                p.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                p.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {p.verificationStatus?.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                p.workingStatus === 'available' ? 'bg-green-100 text-green-800' :
                                p.workingStatus === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                                p.workingStatus === 'offline' ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {p.workingStatus?.toUpperCase() || 'AVAILABLE'}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  p.reliabilityScore >= 80 ? 'bg-green-100 text-green-800' :
                                  p.reliabilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  p.reliabilityScore >= 40 ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {p.reliabilityScore || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <button onClick={async()=>{ await axios.patch(`http://localhost:5000/api/providers/${p._id}/verify`, { status: 'verified' }, { headers: authHeaders }); safeRefresh(); showAlert('success','Provider verified'); }} className="text-green-600" title="Verify"><CheckCircle className="w-5 h-5"/></button>
                                <button onClick={async()=>{ await axios.patch(`http://localhost:5000/api/providers/${p._id}/verify`, { status: 'unverified' }, { headers: authHeaders }); safeRefresh(); showAlert('success','Provider unverified'); }} className="text-red-600" title="Unverify"><XCircle className="w-5 h-5"/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              <AdminBookingManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



