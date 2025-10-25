import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (userData) => {
    const payload = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      isAdmin: !!userData.isAdmin,
      role: userData.role,
      profilePicture: userData.profilePicture || "",
      providerProfileId: userData.providerProfileId || null,
      token: userData.token,
    };
    setUser(payload);
    localStorage.setItem("auth", JSON.stringify(payload));
    localStorage.setItem("token", userData.token);
    
    if (payload.isAdmin) {
      navigate("/admin");
    } else if (payload.role === "provider" && !payload.providerProfileId) {
      // Provider without profile, redirect to onboarding
      navigate("/provider-onboarding");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}





