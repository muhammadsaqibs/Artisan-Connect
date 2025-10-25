import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

// 🖼 Local images
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import appleImg from "../assets/image4.jpg";
import samsungImg from "../assets/image5.jpg";
import oppoImg from "../assets/image6.jpg";
import accessoriesImg from "../assets/image7.jpg";
import image9 from "../assets/image9.jpg";
import image10 from "../assets/image10.jpg";
import image11 from "../assets/image11.jpg";
import image12 from "../assets/image12.jpg";
import Hero3 from "../assets/hero3.jpg";

// 🛡 Trust badge images
import customerSupport from "../assets/customer-support.png";
import easyReturn from "../assets/easyreturn.png";
import freeShipping from "../assets/freeshiping.png";
import securePayment from "../assets/securepayment.png";

// 💳 Payment logos
import paypalLogo from "../assets/paypal.png";
import gpayLogo from "../assets/gpay.png";
import stripeLogo from "../assets/stripe.png";
import easypaisaLogo from "../assets/easypaisa.png";
import bitcoinLogo from "../assets/bitcoin.png";
import codLogo from "../assets/cod.png";
import bankLogo from "../assets/bank.png";

export default function Home() {
  const navigate = useNavigate();

  const slides = [
    { id: 1, image: Hero3, title: "Luxury Mobile Covers", subtitle: "Crafted for elegance & durability", buttonText: "Shop Premium" },
    { id: 2, image: image2, title: "Mega Summer Sale – 30% OFF", subtitle: "Upgrade your style at unbeatable prices", buttonText: "Grab Your Deal" },
    { id: 3, image: image9, title: "2025 Trend Collection", subtitle: "Fresh designs for every personality", buttonText: "View Collection" },
    { id: 4, image: image10, title: "Ultra-Protection Series", subtitle: "Rugged cases for extreme safety", buttonText: "Shop Now" },
    { id: 5, image: image11, title: "Minimalist Mobile Covers", subtitle: "Sleek, stylish & lightweight", buttonText: "Discover Now" },
    { id: 6, image: image12, title: "Designer Cover Edition", subtitle: "Stand out with bold patterns", buttonText: "Explore Styles" },
    { id: 7, image: image1, title: "Everyday Essentials", subtitle: "Affordable covers for daily use", buttonText: "Shop Essentials" },
    { id: 8, image: image3, title: "Limited Edition Covers", subtitle: "Rare designs, limited stock", buttonText: "Get Yours Today" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full min-h-screen bg-[#0b1020] text-white">
      {/* Hero Slider */}
      <section className="relative w-full h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center text-center p-6">
              <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
              <p className="text-lg mb-4">{slide.subtitle}</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-b from-white to-gray-100 text-gray-900 py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: "a1", image: appleImg, title: "iPhone 15 Case", price: 19.99 },
              { id: "s1", image: samsungImg, title: "Galaxy S24 Cover", price: 17.99 },
              { id: "o1", image: oppoImg, title: "Oppo Reno Case", price: 14.99 },
              { id: "ac1", image: accessoriesImg, title: "Wireless Earbuds", price: 29.99 },
            ].map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-lg shadow text-center flex flex-col items-center"
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <h3 className="font-bold mt-3">{p.title}</h3>
                <p className="text-indigo-600 font-semibold">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-600 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="mb-6">Get the latest updates and offers.</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-md outline-none text-black"
          />
          <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800">
            Subscribe
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-12"> 
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { img: securePayment, text: "Secure Payment" },
            { img: freeShipping, text: "Free Shipping" },
            { img: easyReturn, text: "Easy Returns" },
            { img: customerSupport, text: "24/7 Customer Support" },
          ].map((badge) => (
            <div key={badge.text} className="flex flex-col items-center">
              <img src={badge.img} alt={badge.text} className="w-16 h-16 mb-4" />
              <p className="text-black font-semibold">{badge.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-white py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">We Accept</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 px-6">
          {[ 
            { img: paypalLogo, name: "PayPal" },
            { img: gpayLogo, name: "Google Pay" },
            { img: stripeLogo, name: "Stripe" },
            { img: easypaisaLogo, name: "Easypaisa" },
            { img: bitcoinLogo, name: "Bitcoin" },
            { img: codLogo, name: "Cash on Delivery" },
            { img: bankLogo, name: "Bank Transfer" },
          ].map((pm) => (
            <div key={pm.name} className="flex flex-col items-center">
              <img src={pm.img} alt={pm.name} className="h-12 object-contain" />
              <p className="text-sm font-semibold mt-2 text-gray-600">{pm.name}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
