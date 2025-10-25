import { motion } from "framer-motion";
import { useState } from "react";

// Import images
import About6 from "../assets/About6.png";
import About2 from "../assets/About2.png";
import About3 from "../assets/About3.png";
import About5 from "../assets/About5.png";

export default function AboutPage() {
  const testimonials = [
    {
      id: 1,
      image: About5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum placerat diam eros eget ante suscipit porta sed sed elit.",
    },
    {
      id: 2,
      image: About2,
      text: "Aenean tincidunt porta molestie. Nullam sed viverra magna, ut iaculis arcu. Pellentesque habitant morbi tristique senectus et netus.",
    },
    {
      id: 3,
      image: About3,
      text: "Curabitur quis quam eget purus efficitur bibendum. Integer a est nec ligula blandit commodo ut sed ex.",
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
      </motion.div>

      {/* About Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Who We Are</h2>
          <p className="mt-3 text-gray-400">
            At ZepviStore, we bring the latest trends, unbeatable prices, and
            unmatched shopping experience to our customers worldwide.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Our History</h2>
          <p className="mt-3 text-gray-400">
            Since 1990, we’ve been growing into a trusted platform for millions,
            delivering excellence and building a community of happy clients.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="mt-3 text-gray-400">
            Our mission is to make shopping simple, secure, and affordable,
            while continuously innovating for the future.
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
            We Believe In Quality Products
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            pretium mollis ex, vel interdum augue faucibus sit amet. Proin
            tempor purus ac suscipit sagittis. Nunc finibus euismod enim, eu
            finibus nunc ullamcorper et.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={About6}
            alt="Performance"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Our Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">
          Our Team
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              img: About2,
              name: "John Hossain",
              role: "CEO & Founder",
            },
            {
              img: About3,
              name: "Jane Cooper",
              role: "Market Development",
            },
            {
              img: "/src/assets/About4.png",
              name: "Kristin Watson",
              role: "Head Engineer",
            },
            {
              img: About5,
              name: "Isabella",
              role: "Marketing",
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

          {/* Dots Navigation */}
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
