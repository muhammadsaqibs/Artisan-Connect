// top of file
const API = import.meta.env.VITE_API_URL;
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ProviderOnboarding() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };
  const { user, login } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cnic: "",
    age: "",
    workExperienceYears: "",
    hourlyRate: "",
    skills: "",
    bio: "",
    category: "",
    subCategory: "",
    isAvailable: true,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [cover, setCover] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.get("API/api/categories").then((res) => setCategories(res.data.data || [])).catch(()=>{});
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadImage = async (file, isCover = false) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    if (isCover) fd.append("_uploadField", "cover");
    await axios.put("API/api/providers/me", fd, { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } });
  };

  const uploadDoc = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("document", file);
    await axios.post("API/api/providers/me/documents", fd, { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        hourlyRate: Number(form.hourlyRate || 0),
        workExperienceYears: Number(form.workExperienceYears || 0),
        age: Number(form.age || 0),
      };
      if (typeof payload.skills === 'string') payload.skills = payload.skills;
      await axios.put("API/api/providers/me", payload, { headers: authHeaders });

      if (profilePicture) await uploadImage(profilePicture, false);
      if (cover) await uploadImage(cover, true);
      if (docFile) await uploadDoc(docFile);

      setAlert({ 
        type: "success", 
        message: "✅ Profile submitted successfully! Please wait for admin review and verification." 
      });

      // Refresh the page after 3 seconds to update the context
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {alert && (
        <div className={`mb-4 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-500' : 'bg-red-100 text-red-800 border-2 border-red-500'}`}>
          <p className="font-semibold text-lg">{alert.message}</p>
          {alert.type === 'success' && (
            <p className="mt-2 text-sm">You will be able to toggle your availability after admin verification.</p>
          )}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Complete Your Provider Profile</h1>
      <p className="text-gray-600 mb-6">Fill out your profile information below. All fields marked with * are required.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={onChange} className="border rounded px-3 py-2" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="border rounded px-3 py-2" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">CNIC</label>
          <input name="cnic" value={form.cnic} onChange={onChange} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={onChange} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Experience (years)</label>
          <input type="number" name="workExperienceYears" value={form.workExperienceYears} onChange={onChange} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Hourly Rate</label>
          <input type="number" name="hourlyRate" value={form.hourlyRate} onChange={onChange} className="border rounded px-3 py-2" required />
        </div>
        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm font-medium mb-1">Skills (comma-separated)</label>
          <textarea name="skills" value={form.skills} onChange={onChange} className="border rounded px-3 py-2" rows="2" />
        </div>
        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm font-medium mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={onChange} className="border rounded px-3 py-2" rows="3" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={onChange} className="border rounded px-3 py-2" required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Subcategory</label>
          <select name="subCategory" value={form.subCategory} onChange={onChange} className="border rounded px-3 py-2">
            <option value="">Select subcategory</option>
            {categories.find(c => c.id === form.category)?.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" id="isAvailable" name="isAvailable" checked={!!form.isAvailable} onChange={onChange} />
          <label htmlFor="isAvailable" className="text-sm">I am available for work</label>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e)=> setProfilePicture(e.target.files?.[0] || null)} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Cover Photo</label>
          <input type="file" accept="image/*" onChange={(e)=> setCover(e.target.files?.[0] || null)} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium mb-1">Documents (ID Card/CV - PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e)=> setDocFile(e.target.files?.[0] || null)} className="border rounded px-3 py-2" />
          <p className="text-xs text-gray-500 mt-1">Upload your ID card number or CV/Work history</p>
        </div>
        <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> After submitting your profile, please wait for admin review and verification. 
            You will receive a notification once your account is verified.
          </p>
        </div>
        <button type="submit" disabled={saving} className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
          {saving ? 'Saving...' : '✅ Submit Profile for Admin Review'}
        </button>
      </form>
    </div>
  );
}


