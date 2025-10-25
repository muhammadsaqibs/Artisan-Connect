import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Phone, Wallet, Banknote, Bitcoin, Calendar, Wrench } from "lucide-react";
import Alert from "../components/Alert.jsx";
import { getPlaceholderImage } from "../utils/placeholders";
import BookingHistory from "../components/BookingHistory";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data || []);
      } catch (err) {
        console.log("Could not fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showAlert("warning", "Your cart is empty!");
      return;
    }

    // Validate shipping address
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      showAlert("warning", "Please fill in all shipping address fields!");
      return;
    }

    // Validate payment details based on method
    if (!validatePaymentDetails()) {
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.title || item.name || "Item",
          qty: item.quantity || 1,
          price: parseFloat(item.price),
          image: item.image,
          // send a string identifier that backend accepts (ObjectId as string or slug)
          product: String(item.id || item._id || item.slug || ""),
        })),
        shippingAddress,
        paymentMethod,
        paymentDetails,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cartTotal,
      };

      const { data } = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear cart after successful order
      clearCart();
      setShowCheckout(false);
      setPaymentDetails({});
      
      // Refresh orders
      const { data: updatedOrders } = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(updatedOrders || []);

      showAlert("success", `Order placed successfully! Order Token: ${data.orderToken}`);
    } catch (error) {
      console.error("Checkout error:", error);
      if (error.response?.data?.message) {
        showAlert("error", `Failed to place order: ${error.response.data.message}`);
      } else {
        showAlert("error", "Failed to place order. Please try again.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const validatePaymentDetails = () => {
    switch (paymentMethod) {
      case "EasyPaisa":
        if (!paymentDetails.phoneNumber || !paymentDetails.pin) {
          showAlert("warning", "Please enter phone number and PIN for EasyPaisa!");
          return false;
        }
        break;
      case "Stripe":
        if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
          showAlert("warning", "Please enter complete card details for Stripe!");
          return false;
        }
        break;
      case "Google Pay":
        if (!paymentDetails.email) {
          showAlert("warning", "Please enter email for Google Pay!");
          return false;
        }
        break;
      case "Bank Transfer":
        if (!paymentDetails.accountNumber || !paymentDetails.accountName) {
          showAlert("warning", "Please enter account details for Bank Transfer!");
          return false;
        }
        break;
      case "Bitcoin":
        if (!paymentDetails.walletAddress) {
          showAlert("warning", "Please enter Bitcoin wallet address!");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const getPaymentForm = () => {
    switch (paymentMethod) {
      case "EasyPaisa":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={paymentDetails.phoneNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN</label>
              <input
                type="password"
                value={paymentDetails.pin || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, pin: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="4-digit PIN"
                maxLength="4"
              />
            </div>
          </div>
        );

      case "Stripe":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <input
                  type="text"
                  value={paymentDetails.expiry || ""}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="password"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        );

      case "Google Pay":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={paymentDetails.email || ""}
              onChange={(e) => setPaymentDetails({...paymentDetails, email: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="your-email@gmail.com"
            />
          </div>
        );

      case "Bank Transfer":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Account Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Holder Name</label>
              <input
                type="text"
                value={paymentDetails.accountName || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, accountName: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Account Holder Name"
              />
            </div>
          </div>
        );

      case "Bitcoin":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Bitcoin Wallet Address</label>
            <input
              type="text"
              value={paymentDetails.walletAddress || ""}
              onChange={(e) => setPaymentDetails({...paymentDetails, walletAddress: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed": return "bg-blue-100 text-blue-800";
      case "packing": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "out_for_delivery": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Alert */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
      {/* User Profile Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-4">
        <img
          src={user?.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : `http://localhost:5000${user.profilePicture}`) : getPlaceholderImage(100)}
          alt="profile"
          className="w-16 h-16 rounded-full object-cover bg-gray-200"
          onError={(e) => {
            e.target.src = getPlaceholderImage(100);
          }}
        />
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name || "User"}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === "cart"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Shopping Cart
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === "bookings"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Service Bookings
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === "orders"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Wrench className="w-4 h-4 inline mr-2" />
            Order History
          </button>
        </div>
      </div>

      {activeTab === "cart" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart Items
            </h3>
            {cartItems.length > 0 && (
              <button
                onClick={() => setShowCheckout(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Checkout
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image?.startsWith("http") ? item.image : `http://localhost:5000${item.image || ""}`}
                      className="w-16 h-16 rounded object-cover" 
                      alt={item.title} 
                    />
                    <div>
                      <div className="font-medium text-lg">{item.title}</div>
                      <div className="text-sm text-gray-500">${Number(item.price).toFixed(2)} each</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">
                        ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Cart Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">Order Token</div>
                      <div className="text-xs text-gray-500 font-mono">{order.orderToken}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Items: {order.orderItems?.length || 0}</span>
                    <span className="font-semibold">${Number(order.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Payment: {order.isPaid ? (
                      <span className="text-green-600">
                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-red-600">Unpaid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Enhanced Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Checkout</h3>
            
            <div className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h4 className="font-medium mb-3">Shipping Address</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Enter your address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div>
                <h4 className="font-medium mb-3">Payment Method</h4>
                <select
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setPaymentDetails({});
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="PayPal">PayPal</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="Stripe">Stripe (Credit Card)</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Bitcoin">Bitcoin</option>
                </select>
              </div>
              
              {/* Payment Method Specific Form */}
              {paymentMethod !== "PayPal" && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {paymentMethod === "EasyPaisa" && <Phone className="w-4 h-4" />}
                    {paymentMethod === "Stripe" && <CreditCard className="w-4 h-4" />}
                    {paymentMethod === "Google Pay" && <Wallet className="w-4 h-4" />}
                    {paymentMethod === "Bank Transfer" && <Banknote className="w-4 h-4" />}
                    {paymentMethod === "Bitcoin" && <Bitcoin className="w-4 h-4" />}
                    {paymentMethod} Details
                  </h4>
                  {getPaymentForm()}
                </div>
              )}
              
              {/* Order Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setPaymentDetails({});
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                disabled={checkoutLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {checkoutLoading ? "Processing..." : `Pay with ${paymentMethod}`}
              </button>
            </div>
          </div>
        </div>
      )}
      )}

      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow p-6">
          <BookingHistory />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order History</h3>
            <p className="text-gray-500">Your order history will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}



