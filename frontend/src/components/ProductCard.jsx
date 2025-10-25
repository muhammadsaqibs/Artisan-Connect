import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ image, title, price, id, hourlyRate }) {
  const { addToCart, bookNow } = useCart();
  const [showAlert, setShowAlert] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, title, image, price });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  return (
    <div className="group relative bg-gradient-to-b from-gray-900 to-gray-950 border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover transform group-hover:scale-[1.03] transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-cyan-300 font-bold mt-2">${hourlyRate ?? price}</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full relative inline-flex items-center justify-center px-4 py-2 rounded-xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="relative">Add to Cart</span>
          </button>
          <button
            onClick={() => bookNow({ id, name: title, hourlyRate: hourlyRate ?? price, image })}
            className="w-full relative inline-flex items-center justify-center px-4 py-2 rounded-xl overflow-hidden border border-white/10"
          >
            <span className="relative">Book Now</span>
          </button>
        </div>

        {showAlert && (
          <div
            className="alert alert-success mt-3 mb-0 p-2 py-2"
            role="alert"
          >
            ✅ Successfully added to Cart!
          </div>
        )}
      </div>
    </div>
  );
}
