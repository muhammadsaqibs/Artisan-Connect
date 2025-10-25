import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-yellow-100 via-white to-yellow-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-secondary leading-tight">
            Upgrade Your Lifestyle with{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
              ZepviStore
            </span>
          </h1>
          <p className="mt-6 text-gray-700 text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            Discover premium products at unbeatable prices. Enjoy fast delivery,
            secure checkout, and exceptional customer support — everything you need for a better shopping experience.
          </p>
          <div className="mt-8 flex justify-center md:justify-start gap-5">
            <Link
              to="/shop"
              className="bg-primary text-secondary font-semibold px-7 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              🛒 Shop Now
            </Link>
            <Link
              to="/about"
              className="border border-primary text-primary font-semibold px-7 py-3 rounded-lg hover:bg-primary hover:text-secondary transition-all duration-300"
            >
              ℹ️ Learn More
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative">
          <img
            src="https://images.unsplash.com/photo-1585386959984-a4155222dd0c?q=80&w=1200"
            alt="Shopping"
            className="rounded-xl shadow-2xl border border-gray-200 transform hover:scale-105 transition-transform duration-500"
          />
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-200 to-transparent blur-3xl opacity-60 -z-10"></div>
        </div>
      </div>

      {/* Background decorative circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce-slow"></div>
    </section>
  );
}
