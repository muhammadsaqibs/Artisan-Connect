export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
          Contact <span className="text-white">Us</span>
        </h1>
        <p className="text-center text-gray-400 max-w-xl mx-auto text-lg">
          Have questions or need help? Fill out the form below and our team 
          will get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <form className="mt-12 max-w-2xl mx-auto bg-white/5 backdrop-blur p-8 rounded-xl shadow-lg border border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <textarea
            placeholder="Your Message"
            rows="5"
            className="mt-6 w-full bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
            required
          ></textarea>
          <button
            type="submit"
            className="mt-6 relative inline-flex items-center justify-center px-6 py-3 rounded-lg overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="relative">Send Message</span>
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-12 text-center text-gray-400">
          <p>📍 Karachi, Pakistan</p>
          <p>📞 +92 300 1234567</p>
          <p>📧 support@zepvistore.com</p>
        </div>
      </div>
    </div>
  );
}
