import { useState } from "react";
import axios from "axios";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      // Try by token first, then by Mongo _id
      let { data } = await axios.get(`http://localhost:5000/api/orders/track`, { params: { token: query.trim() } });
      if (!data?.data && /^[0-9a-fA-F]{24}$/.test(query.trim())) {
        const byId = await axios.get(`http://localhost:5000/api/orders/track`, { params: { id: query.trim() } });
        data = byId.data;
      }
      if (data?.data) setResult(data.data);
      else setError("Order not found");
    } catch (e) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Track <span className="text-gray-800">Your Order</span>
        </h1>
        <p className="text-center text-gray-600 max-w-xl mx-auto text-lg">
          Enter your order token or ID to check the status.
        </p>

        <form onSubmit={track} className="mt-12 max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder="Enter Order Token or ID"
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && <div className="mt-6 text-center text-red-600">{error}</div>}

        {result && (
          <div className="mt-12 max-w-xl mx-auto bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm text-gray-500">Order Token</div>
                <div className="font-mono text-sm">{result.orderToken}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                result.status === 'placed' ? 'bg-blue-100 text-blue-800' :
                result.status === 'packing' ? 'bg-yellow-100 text-yellow-800' :
                result.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                result.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                result.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {String(result.status || '').replace('_',' ').toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Placed on {new Date(result.createdAt).toLocaleString()}</div>
            <div className="text-sm">Items: {result.orderItems?.length || 0}</div>
            <div className="mt-2 font-semibold">Total: ${Number(result.totalPrice || 0).toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
