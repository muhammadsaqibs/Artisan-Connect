import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FlashSalePage from "./pages/FlashSalePage";
import TrackOrderPage from "./pages/TrackOrderPage";
import BlogPage from "./pages/BlogPage";

import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage"; 
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProvidersPage from "./pages/ProvidersPage";
import ProviderBookingPage from "./pages/ProviderBookingPage";
import BookingPage from "./pages/BookingPage";
import Navbar from "./components/Navbar";
import "./index.css";
import "./app.css";
import ProviderOnboarding from "./pages/ProviderOnboarding";

const SITE_NAME = "Artisan Connect";

function TitleWrapper({ children, title }) {
  useEffect(() => {
    document.title = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  }, [title]);
  return children;
}

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const authRaw = localStorage.getItem("auth");
  const isAdmin = authRaw && JSON.parse(authRaw)?.isAdmin;
  return isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {/* Home */}
        <Route path="/" element={<TitleWrapper><Home /></TitleWrapper>} />
        
        {/* Shop Page */}
        <Route path="/shop" element={<TitleWrapper title="Shop"><Shop /></TitleWrapper>} />
        
        {/* Single Product Details */}
        <Route path="/product/:id" element={<TitleWrapper title="Product Details"><ProductDetails /></TitleWrapper>} />
        
        {/* Providers Directory */}
        <Route path="/providers" element={<TitleWrapper title="Providers"><ProvidersPage /></TitleWrapper>} />
        {/* Backwards-compatible route from older builds */}
        <Route path="/artisans" element={<TitleWrapper title="Providers"><ProvidersPage /></TitleWrapper>} />
        
        {/* Book Provider */}
        <Route path="/book-provider/:id" element={<TitleWrapper title="Book Service"><ProtectedRoute><BookingPage /></ProtectedRoute></TitleWrapper>} />
        
        {/* ✅ Category Wise */}
        <Route 
          path="/products/:category" 
          element={<TitleWrapper title="Category"><ProductsPage /></TitleWrapper>} 
        />
        
        {/* ✅ Subcategory Wise (SEO Friendly) */}
        <Route
          path="/products/:category/:subcategory"
          element={
            <TitleWrapper title="Products">
              <ProductsPage />
            </TitleWrapper>
          }
        />

        {/* Pages */}
        <Route path="/about" element={<TitleWrapper title="About Us"><AboutPage /></TitleWrapper>} />
        <Route path="/contact" element={<TitleWrapper title="Contact Us"><ContactPage /></TitleWrapper>} />
        <Route path="/flash-sale" element={<TitleWrapper title="Flash Sale"><FlashSalePage /></TitleWrapper>} />
        <Route path="/track-order" element={<TitleWrapper title="Track Service"><TrackOrderPage /></TitleWrapper>} />
        <Route path="/blog" element={<TitleWrapper title="Blog"><BlogPage /></TitleWrapper>} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <TitleWrapper title="Checkout"><CheckoutPage /></TitleWrapper>
            </ProtectedRoute>
          }
        />

        {/* Login / Signup */}
        <Route
          path="/login"
          element={
            <TitleWrapper title="Login">
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            </TitleWrapper>
          }
        />
        <Route path="/signup" element={<TitleWrapper title="Sign Up"><SignupPage /></TitleWrapper>} />
        <Route path="/provider-onboarding" element={<TitleWrapper title="Provider Onboarding"><ProtectedRoute><ProviderOnboarding /></ProtectedRoute></TitleWrapper>} />

        {/* ✅ Protected Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <TitleWrapper title="My Profile"><ProfilePage /></TitleWrapper>
            </ProtectedRoute>
          }
        />

        {/* ✅ User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TitleWrapper title="Dashboard"><UserDashboard /></TitleWrapper>
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <TitleWrapper title="Admin"><AdminDashboard /></TitleWrapper>
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}
