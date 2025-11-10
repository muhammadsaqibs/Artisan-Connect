import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative w-full text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="../assets/HeroSec2.jpeg"
          alt="Artisan background"
          className="w-full h-full object-center object-cover opacity-40"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />

        {/* Soft Light Effects */}
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-cyan-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-fuchsia-500/25 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-28 md:py-36">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side Text */}
          <div className="space-y-6">
            <p className="inline-block px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-sm tracking-wide backdrop-blur-sm">
              Empowering Local Artisans
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Discover Authentic Handmade Creations & Local Talent
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Explore unique handcrafted products from skilled artisans near you. 
              Support creativity, tradition, and sustainable craftsmanship through every purchase.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/artisans"
                className="relative inline-flex items-center justify-center px-7 py-3 text-gray-900 font-semibold rounded-xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300" />
                <span className="absolute inset-0 opacity-0 hover:opacity-20 transition bg-white" />
                <span className="relative">Explore Artisans</span>
              </Link>
              <Link
                to="/shop"
                className="px-7 py-3 rounded-xl border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition"
              >
                View Handmade Products
              </Link>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 blur-2xl -z-10 rounded-3xl" />
            <img
              src="../assets/HeroSec3.jpeg"
              alt="Handcrafted products"
              className="rounded-3xl shadow-2xl w-full h-[420px] md:h-[460px] object-cover transform hover:scale-[1.03] transition duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
