// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useCart } from "../context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FlashSalePage() {
  const { addToCart } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const [saleEndsAt, setSaleEndsAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [flashDeals, setFlashDeals] = useState([]);

  function computeTimeLeft(targetTs) {
    const now = Date.now();
    const difference = (targetTs || 0) - now;
    if (!targetTs || difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.max(0, Math.floor(difference / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  }

  useEffect(() => {
    // Compute immediately on mount or when saleEndsAt changes
    setTimeLeft(computeTimeLeft(saleEndsAt));
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(saleEndsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [saleEndsAt]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/products`, { params: { flashSale: true }, signal: controller.signal });
        const items = (data?.data || []);
        setFlashDeals(items.map(p => ({ id: p._id, title: p.name, price: p.price, image: p.image?.startsWith("http") ? p.image : `API${p.image || ""}`, endsAt: p.flashSaleEndsAt })));
        const ends = items
          .map(p => p.flashSaleEndsAt ? (typeof p.flashSaleEndsAt === 'number' ? p.flashSaleEndsAt : new Date(p.flashSaleEndsAt).getTime()) : 0)
          .filter(ts => Number.isFinite(ts) && ts > Date.now());
        const nextEnd = ends.length ? Math.min(...ends) : null;
        setSaleEndsAt(nextEnd);
      } catch {
        setFlashDeals([]);
        setSaleEndsAt(null);
      }
    })();
    return () => controller.abort();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAlertMessage("✅ Added to cart successfully!");
    setTimeout(() => setAlertMessage(""), 2500);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Alert */}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg animate-fadeIn z-50">
          {alertMessage}
        </div>
      )}

      {/* Animated Banner */}
      <div className="relative h-64 bg-cover bg-center flex items-center justify-center bg-[url('/flash-bg.jpg')] animate-pulse">
        <div className="bg-black/60 backdrop-blur p-6 rounded-lg text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
            🔥 24 Hours Limited Bonus
          </h1>
          <p className="text-gray-200 mt-2 text-lg">
            Flash Sale! Up to 70% off | Hurry Up
          </p>
          <div className="mt-4 text-xl font-bold text-white">
            {saleEndsAt ? (
              <>⏳ {String(timeLeft.hours).padStart(2,'0')}h : {String(timeLeft.minutes).padStart(2,'0')}m : {String(timeLeft.seconds).padStart(2,'0')}s left</>
            ) : (
              <>⏳ 00h : 00m : 00s left</>
            )}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Flash Deals</h2>
        <Slider {...sliderSettings}>
          {flashDeals.map((item) => (
            <div key={item.id} className="px-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:shadow-2xl hover:scale-[1.02] transition flex flex-col h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="text-red-400 font-bold text-md mb-4">${item.price}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
