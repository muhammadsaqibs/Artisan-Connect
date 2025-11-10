import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";

// 🖼️ Hero Section Images
import Hero1 from "../assets/HeroSec1.jpeg";
import Hero2 from "../assets/HeroSec2.jpeg";
import Hero3 from "../assets/HeroSec3.jpeg";
import Hero4 from "../assets/HeroSec4.jpeg";
import Hero5 from "../assets/HeroSec5.jpeg";

// 👷‍♂️ Featured Professionals Images
import Fe1 from "../assets/Fe1.png";
import Fe2 from "../assets/Fe2.png";
import Fe3 from "../assets/Fe3.png";
import Fe4 from "../assets/Fe4.png";

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
    {
      id: 1,
      image: Hero1,
      title: "Empowering Skilled Professionals Through Technology",
      subtitle:
        "Connect with verified local experts — electricians, plumbers, instructors, and engineers — all in one trusted platform.",
      buttonText: "Find Experts",
    },
    {
      id: 2,
      image: Hero2,
      title: "Building Stronger Connections Between Talent and Opportunity",
      subtitle:
        "Our mission is to create digital visibility for skilled individuals, helping them reach the clients they deserve.",
      buttonText: "Join as Service Provider",
    },
    {
      id: 3,
      image: Hero3,
      title: "Smart Solutions for Real Professionals",
      subtitle:
        "Digitally showcase your skills, manage clients, and receive secure payments with ease.",
      buttonText: "Get Started",
    },
    {
      id: 4,
      image: Hero4,
      title: "Trusted Services for Every Need",
      subtitle:
        "From household maintenance to professional training — Artisan Connect links customers with reliable experts.",
      buttonText: "Explore Services",
    },
    {
      id: 5,
      image: Hero5,
      title: "Digital Platform for the Workforce of Tomorrow",
      subtitle:
        "Creating employment and growth opportunities for professionals across every city and field.",
      buttonText: "Be Part of the Network",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full min-h-screen bg-[#0b1020] text-white">
      {/* 🌅 HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 flex flex-col justify-center items-center text-center p-4 md:p-6">
              <h1 className="text-2xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg mb-4 text-gray-200 max-w-xl">
                {slide.subtitle}
              </p>
              <button
                onClick={() => navigate("/artisans")}
                className="relative inline-flex items-center justify-center px-6 py-2 md:py-3 text-sm md:text-lg rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 transition-all duration-300"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 👷 FEATURED PROFESSIONALS */}
      <section className="bg-gradient-to-b from-white to-gray-100 text-gray-900 py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Featured Professionals
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Explore our top-rated professionals providing trusted, high-quality services
            across engineering, education, and maintenance fields.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                id: "p1",
                image: Fe1,
                title: "Ahmed Raza",
                role: "Certified Electrician | Karachi",
              },
              {
                id: "p2",
                image: Fe2,
                title: "Bilal Khan",
                role: "Professional Plumber | Lahore",
              },
              {
                id: "p3",
                image: Fe3,
                title: "Sara Ali",
                role: "Building Instructor | Islamabad",
              },
              {
                id: "p4",
                image: Fe4,
                title: "Engr. Usman Ahmed",
                role: "Civil Engineer | Multan",
              },
            ].map((pro) => (
              <div
                key={pro.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all text-center flex flex-col items-center"
              >
                <div className="w-full h-48 overflow-hidden rounded-lg">
                  <img
                    src={pro.image}
                    alt={pro.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <h3 className="font-bold mt-3">{pro.title}</h3>
                <p className="text-indigo-600 font-semibold">{pro.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📰 COMMUNITY INVITE */}
      <section className="bg-indigo-600 py-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Join the Artisan Connect Community
        </h2>
        <p className="mb-6 text-gray-100">
          Register today to promote your services, connect with clients, and grow your professional presence online.
        </p>
        <div className="flex justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-md outline-none text-black w-full"
          />
          <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800">
            Join Now
          </button>
        </div>
      </section>

      {/* 🛡 TRUST BADGES */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { img: securePayment, text: "Secure Transactions" },
            { img: freeShipping, text: "Reliable Service Access" },
            { img: easyReturn, text: "Easy Job Management" },
            { img: customerSupport, text: "24/7 Support & Verification" },
          ].map((badge) => (
            <div key={badge.text} className="flex flex-col items-center">
              <img src={badge.img} alt={badge.text} className="w-16 h-16 mb-4" />
              <p className="text-black font-semibold">{badge.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💳 PAYMENT METHODS */}
      <section className="bg-white py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Flexible and Secure Payment Options
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 px-6">
          {[
            { img: paypalLogo, name: "PayPal" },
            { img: gpayLogo, name: "Google Pay" },
            { img: stripeLogo, name: "Stripe" },
            { img: easypaisaLogo, name: "Easypaisa" },
            { img: bitcoinLogo, name: "Crypto" },
            { img: codLogo, name: "Cash on Delivery" },
            { img: bankLogo, name: "Bank Transfer" },
          ].map((pm) => (
            <div key={pm.name} className="flex flex-col items-center">
              <img src={pm.img} alt={pm.name} className="h-12 object-contain" />
              <p className="text-sm font-semibold mt-2 text-gray-600">
                {pm.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
