// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Only logged-in users can have cart
  const getStorageKey = () => {
    return user?._id ? `cart_${user._id}` : null;
  };

  const [storageKey, setStorageKey] = useState(getStorageKey());
  const [cartItems, setCartItems] = useState([]);
  // Booking object for services pivot
  const [booking, setBooking] = useState(null);

  // Switch storage key when login/logout happens
  useEffect(() => {
    const newKey = getStorageKey();
    if (newKey !== storageKey) {
      setStorageKey(newKey);
      // Clear cart when logging out
      if (!newKey) {
        setCartItems([]);
      }
    }
  }, [user, storageKey]);

  // Load cart when storage key changes
  useEffect(() => {
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        setCartItems(raw ? JSON.parse(raw) : []);
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [storageKey]);

  // Save cart in localStorage
  useEffect(() => {
    if (storageKey && cartItems.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
      } catch {}
    }
  }, [cartItems, storageKey]);

  // Add to cart - only for logged-in users
  const addToCart = (item) => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setCartItems((items) => {
      const API_BASE = "API";
      const normalizedImage = item.image && (item.image.startsWith("http") ? item.image : `${API_BASE}${item.image}`);
      const idx = items.findIndex((i) => i.id === item.id);

      if (idx >= 0) {
        // If already in cart → increase qty
        const updated = [...items];
        updated[idx] = {
          ...updated[idx],
          quantity: (updated[idx].quantity || 1) + (item.quantity || 1),
        };
        return updated;
      }

      // New product → make sure price is numeric
      const price = parseFloat(item.price) || 0;

      return [
        ...items,
        {
          ...item,
          image: normalizedImage || item.image || "",
          price,
          quantity: item.quantity || 1,
        },
      ];
    });

    // Redirect to dashboard after adding
    navigate("/dashboard");
  };

  // Book Now: replace cart with a single hiring request object
  const bookNow = (provider) => {
    if (!user) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }
    const obj = {
      providerId: provider.id || provider._id,
      name: provider.title || provider.name,
      hourlyRate: Number(provider.hourlyRate || provider.price || 0),
      image: provider.image || provider.avatar || "",
      scheduledTime: null,
      notes: "",
      pricing: { bookingFee: 500, settlement: "COS" },
    };
    setBooking(obj);
    navigate("/dashboard");
  };

  // Update quantity (+/-)
  const updateQuantity = (id, amount) => {
    if (!user) return;
    
    setCartItems((items) =>
      items.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(1, (i.quantity || 1) + amount) }
          : i
      )
    );
  };

  // Remove item
  const removeFromCart = (id) => {
    if (!user) return;
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    if (!user) return;
    setCartItems([]);
  };

  // Cart count for navbar badge
  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0),
    [cartItems]
  );

  // Cart total for order summary
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, i) => sum + (parseFloat(i.price) || 0) * (i.quantity || 1),
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    addToCart,
    bookNow,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    booking,
    setBooking,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
