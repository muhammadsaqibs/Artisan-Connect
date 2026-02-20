// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [total, setTotal] = useState(99.99);
  const [cart, setCart] = useState([
    { name: "Sample Product", qty: 1, price: 99.99, image: "https://via.placeholder.com/100" },
  ]);
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "" });
  const [paypalClientId, setPaypalClientId] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const placeOrder = async (paymentMethod, paymentDetails = {}) => {
    const headers = getAuthHeaders();
    if (!headers) {
      alert("Please login to place an order");
      return null;
    }
    const { data: order } = await axios.post(
      "API/api/orders",
      {
        orderItems: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price, image: c.image })),
        shippingAddress: shipping,
        paymentMethod,
        paymentDetails,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: total,
      },
      { headers }
    );
    return order;
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(`${API}/api/config/paypal`);
      setPaypalClientId(data.clientId || "");
      if (data.clientId) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=USD`;
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
      }
      // Stripe config
      const stripeCfg = await axios.get(`${API}/api/config/stripe`);
      if (stripeCfg.data.publishableKey) {
        setStripePromise(loadStripe(stripeCfg.data.publishableKey));
      }
    };
    load();
  }, []);

  const handlePayPal = async () => {
    try {
      // Place order first so it succeeds even if PayPal is not fully configured
      const created = await placeOrder("PayPal", { status: "INITIATED" });
      if (!created) return;
      // Initiate PayPal order
      const { data: pp } = await axios.post(
        `${API}/api/payments/paypal/create-order`,
        { total }
      );
      const orderId = pp.id;
      const approveLink = pp.links?.find((l) => l.rel === "approve")?.href;
      if (approveLink) {
        alert(`Order #${created._id} created. Continue to PayPal to approve payment.`);
        window.location.href = approveLink;
      } else {
        alert(`Order #${created._id} created. PayPal approval link unavailable.`);
      }
    } catch (e) {
      alert("PayPal init failed");
    }
  };

  const handleCOD = async () => {
    try {
      await axios.post(`${API}/api/payments/cod`, { total });
      const created = await placeOrder("COD");
      if (created) alert(`COD order placed! Order #${created._id}`);
    } catch (e) {
      alert("COD failed");
    }
  };

  const handleStripeInit = async () => {
    try {
      // Place order first so it exists even if Stripe isn't configured
      const created = await placeOrder("Stripe", { status: "INITIATED" });
      if (!created) return;
      const { data } = await axios.post(`${API}/api/payments/stripe/create-payment-intent`, {
        total,
      });
      setStripeClientSecret(data.clientSecret);
    } catch (e) {
      alert("Stripe init failed — missing server keys?");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input className="border p-2 rounded w-full" value={shipping.address} onChange={(e)=>setShipping(s=>({...s,address:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input className="border p-2 rounded w-full" value={shipping.city} onChange={(e)=>setShipping(s=>({...s,city:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input className="border p-2 rounded w-full" value={shipping.postalCode} onChange={(e)=>setShipping(s=>({...s,postalCode:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input className="border p-2 rounded w-full" value={shipping.country} onChange={(e)=>setShipping(s=>({...s,country:e.target.value}))} />
          </div>
        </div>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
            <option value="stripe">Card (Stripe/GPay)</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg">Total</div>
          <div className="text-xl font-bold">${total.toFixed(2)}</div>
        </div>
        <div className="mt-6">
          {paymentMethod === "paypal" && (
            <button
              onClick={handlePayPal}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Pay with PayPal
            </button>
          )}
          {paymentMethod === "cod" && (
            <button
              onClick={handleCOD}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Place COD Order
            </button>
          )}
          {paymentMethod === "stripe" && (
            <div className="space-y-3">
              {!stripeClientSecret ? (
                <button onClick={handleStripeInit} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                  Start Card Payment
                </button>
              ) : (
                stripePromise && (
                  <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                    <StripeForm clientSecret={stripeClientSecret} onCreateOrder={placeOrder} />
                  </Elements>
                )
              )}
            </div>
          )}
          {paymentMethod === "bitcoin" && (
            <button
              onClick={async () => {
                try {
                  const created = await placeOrder("Bitcoin", { status: "INITIATED" });
                  if (!created) return;
                  const { data } = await axios.post(`${API}/api/payments/bitcoin/create-invoice`, { total });
                  const hosted = data?.data?.hosted_url || data?.hosted_url;
                  const chargeId = data?.data?.id || data?.id;
                  if (hosted) {
                    alert(`Order #${created._id} created. Redirecting to Bitcoin checkout...`);
                    window.location.href = hosted;
                  } else {
                    alert(`Order #${created._id} created. Invoice created: ${chargeId || "N/A"}`);
                  }
                } catch (e) {
                  alert("Bitcoin init failed");
                }
              }}
              className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
            >
              Pay with Bitcoin
            </button>
          )}
          {paymentMethod === "easypaisa" && (
            <button
              onClick={async () => {
                try {
                  const created = await placeOrder("Easypaisa", { status: "INITIATED" });
                  if (!created) return;
                  const { data } = await axios.post(`${API}/api/payments/easypaisa/create-charge`, { total });
                  const ref = data.reference || data.status;
                  alert(`Order #${created._id} created. Easypaisa charge: ${ref}`);
                } catch (e) {
                  alert("Easypaisa not configured, but order has been placed.");
                }
              }}
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
            >
              Pay with Easypaisa
            </button>
          )}
          {paymentMethod === "bank" && (
            <button
              onClick={async () => {
                try {
                  const created = await placeOrder("Bank Transfer", { status: "INITIATED" });
                  if (!created) return;
                  const { data } = await axios.post(`${API}/api/payments/bank/initiate`, { total });
                  alert(`Order #${created._id} created. Bank transfer: ${data.instructions.bankName}, Account: ${data.instructions.accountNumber}`);
                } catch (e) {
                  alert("Bank transfer initiation failed, but order has been placed.");
                }
              }}
              className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
            >
              Bank Transfer Instructions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StripeForm({ clientSecret, onCreateOrder }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      if (onCreateOrder) {
        await onCreateOrder("Stripe", { clientSecret });
      }
      const { error: stripeError } = await stripe.confirmPayment({ elements, confirmParams: { return_url: window.location.href } });
      if (stripeError) setError(stripeError.message || "Payment failed");
    } catch (e) {
      setError("Could not create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <PaymentElement />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={loading} onClick={submit} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-60">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}


