// top of file
const API = import.meta.env.VITE_API_URL;
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { getPlaceholderImage } from "../utils/placeholders";

export default function ProfilePage() {
  const { user, login } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setAlert({ type: "error", message: "Please select a profile picture" });
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      const response = await axios.put(
        "API/api/users/profile/picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update user context with new profile picture
        const updatedUser = { ...user, profilePicture: response.data.data.profilePicture };
        login(updatedUser, token);
        setAlert({ type: "success", message: "Profile picture updated successfully!" });
        setProfilePicture(null);
      }
    } catch (error) {
      setAlert({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to upload profile picture" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-8 rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-cyan-600">My Profile</h2>
      
      {alert && (
        <div className={`mb-4 p-3 rounded ${
          alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {alert.message}
        </div>
      )}
      
      {user ? (
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="text-center">
            <img
              src={user.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `API${user.profilePicture}`) : getPlaceholderImage(96)}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4 bg-gray-200"
              onError={(e) => {
                e.target.src = getPlaceholderImage(96);
              }}
            />
            
            <form onSubmit={handleProfilePictureUpload} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>
              <button
                type="submit"
                disabled={uploading || !profilePicture}
                className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Picture"}
              </button>
            </form>
          </div>

          <hr className="my-4" />
          
          {/* User Info */}
          <div className="space-y-4 text-gray-700">
            <p><strong>Name:</strong> {user?.name || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            <p><strong>Role:</strong> {user?.role || "N/A"}</p>
            <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
          
          <hr className="my-4" />
          <h3 className="text-xl font-semibold text-gray-800">My Summary</h3>
          <ul className="list-disc pl-6">
            <li><strong>Cart Items:</strong> Coming from API</li>
            <li><strong>Orders:</strong> Coming from API</li>
            <li><strong>Payments:</strong> Coming from API</li>
          </ul>
        </div>
      ) : (
        <p className="text-red-500">You are not logged in.</p>
      )}
    </div>
  );
}
