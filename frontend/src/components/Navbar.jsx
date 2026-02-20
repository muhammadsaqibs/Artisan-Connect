// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getPlaceholderImage } from "../utils/placeholders";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Service Providers", path: "/providers" },
    { name: "Track Service", path: "/track-order" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white drop-shadow-[0_0_6px_rgba(0,191,255,0.7)] tracking-wide"
        >
          Artisan <span className="text-cyan-400">Connect</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-200 hover:text-cyan-400 transition duration-300 font-medium drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-3 px-4 py-2 bg-cyan-500 text-gray-900 rounded-full hover:bg-cyan-400 transition">
                <img
                  src={user.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `API${user.profilePicture}`) : getPlaceholderImage(32)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(32);
                  }}
                />
                <span className="font-medium">{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  My Profile
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Admin Panel</Link>
                )}
                {!user.isAdmin && (
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition font-medium shadow-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-cyan-400 text-gray-900 font-semibold rounded-lg hover:bg-cyan-300 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link to="/dashboard" className="relative">
            <Calendar className="w-6 h-6 text-gray-200 hover:text-cyan-400 transition" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/dashboard" className="relative">
            <Calendar className="w-6 h-6 text-gray-200 hover:text-cyan-400 transition" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-cyan-400 focus:outline-none transition"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-800 px-4 pb-4 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block text-gray-200 hover:text-cyan-400 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex gap-3 pt-3">
            {user ? (
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-3 mb-3 p-3 bg-gray-700 rounded-lg">
                  <img
                    src={user.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `API${user.profilePicture}`) : getPlaceholderImage(40)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(40);
                    }}
                  />
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-cyan-400 text-gray-900 font-semibold rounded-lg hover:bg-cyan-300 transition shadow-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition font-medium shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition font-medium shadow-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 px-4 py-2 bg-cyan-400 text-gray-900 font-semibold rounded-lg hover:bg-cyan-300 transition shadow-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
