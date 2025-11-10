import { motion } from "framer-motion";
import { useState } from "react";

// Import images (replace with your own)
import About6 from "../assets/About6.png";
import About2 from "../assets/About2.png";
import About3 from "../assets/About3.png";
import About5 from "../assets/About5.png";

export default function AboutPage() {
  const testimonials = [
    {
      id: 1,
      image: About5,
      text: "Artisan Connect helped me find a verified electrician in minutes. The reliability score really builds confidence before booking!",
    },
    {
      id: 2,
      image: About2,
      text: "Finally, a platform that connects you with nearby service providers who actually show up on time and deliver quality work.",
    },
    {
      id: 3,
      image: About3,
      text: "As a local artisan, Artisan Connect gave me steady work opportunities and helped me build trust with new clients.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      {/* Hero Section */}
      <motion.div
        className="relative h-[70vh] w-full flex items-center justify-center text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.img
          src="/src/assets/About1.png"
          alt="About Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <h1 className="text-4xl md:text-6xl font-extrabold text-white relative z-10">
          
        </h1>
      </motion.div>

      {/* About Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Who We Are</h2>
          <p className="mt-3 text-gray-400">
            Artisan Connect is a trusted digital platform designed to connect
            customers with verified local service providers such as plumbers,
            electricians, and handymen. We believe in building a community of
            reliability, safety, and transparency.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Our Vision & History</h2>
          <p className="mt-3 text-gray-400">
            The idea for Artisan Connect was born from everyday frustrations of
            finding trustworthy local workers. Our team turned that problem into
            a mission — to create a hyper-local network where every artisan is
            recognized for skill and reliability, not just star ratings.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="mt-3 text-gray-400">
            Our mission is to simplify home service hiring through technology.
            By introducing a data-driven “Reliability Score,” we empower users to
            hire confidently and enable artisans to grow their local reputation.
          </p>
        </div>
      </div>

      {/* Performance Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 space-y-4">
          <p className="text-cyan-400 font-semibold uppercase tracking-wide">
            Our Performance
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            We Believe in Trust & Transparency
          </h2>
          <p className="text-gray-400">
            Every booking, rating, and completion status on Artisan Connect feeds
            into our backend Reliability Score system. This ensures fair,
            data-driven trust for artisans — and peace of mind for customers.
            Our MERN-based architecture guarantees quick searches, secure
            transactions, and smooth performance.
          </p>
        </div>
        <div className="md:w-1/2">
          <img src={About6} alt="Performance" className="rounded-xl shadow-lg" />
        </div>
      </div>

      {/* Our Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">
          Meet the Creators
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              img: About2,
              name: "Muhammad Saqib",
              role: "Full-Stack Developer | SP23-BCS-116",
            },
            {
              img: About3,
              name: "Waqas Ali",
              role: "Full-Stack Developer | SP23-BCS-096",
            },
            {
              img: "/src/assets/About4.png",
              name: "Dr. Waseem Akram",
              role: "Project Supervisor",
            },
            {
              img: About5,
              name: "Artisan Connect Team",
              role: "Design & Backend Support",
            },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/30 transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-60 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feedback/Testimonial Section */}
      <section className="bg-gray-800 py-16 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <img
            src={testimonials[activeIndex].image}
            alt="testimonial"
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <p className="text-gray-300 text-lg md:text-xl mb-6">
            {testimonials[activeIndex].text}
          </p>
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? "bg-cyan-400" : "bg-gray-500"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
