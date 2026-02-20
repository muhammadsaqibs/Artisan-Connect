// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, bookNow } = useCart();

  useEffect(() => {
    fetch(`API/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.data || data))
      .catch((err) => console.error("Error fetching product details:", err));
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-10 min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      
      {/* Product Image */}
      <div className="md:w-1/2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[450px] object-cover rounded-xl shadow-2xl border border-white/10"
        />
      </div>

      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">{product.name}</h1>
        
        <p className="text-2xl font-semibold text-cyan-300 mb-6">
          ${(product.hourlyRate ?? product.price).toFixed(2)}
        </p>
        
        <p className="text-gray-400 leading-relaxed mb-8">
          {product.description}
        </p>
        
        <div className="flex items-center gap-4">
          <button onClick={() => addToCart({ id: product._id, title: product.name, image: product.image, price: product.price })} className="relative inline-flex items-center justify-center px-6 py-3 rounded-lg overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="relative">Add to Cart</span>
          </button>
          <button onClick={() => bookNow({ id: product._id, name: product.name, hourlyRate: product.hourlyRate ?? product.price, image: product.image })} className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition">Book Now</button>
        </div>
      </div>
    </div>
  );
}
