export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
          Contact <span className="text-white">Artisan Connect</span>
        </h1>
        <p className="text-center text-gray-400 max-w-xl mx-auto text-lg">
          Have a question about hiring an artisan, selling your craft, or joining our community? 
          Fill out the form below and our support team will reach out to you soon.
        </p>

        {/* Contact Form */}
        <form className="mt-12 max-w-2xl mx-auto bg-white/5 backdrop-blur p-8 rounded-xl shadow-lg border border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Full Name"
              className="bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
            <input
              type="email"
              placeholder="Your Email Address"
              className="bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <textarea
            placeholder="How can we help you? (e.g. artisan inquiry, service issue, feedback)"
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
          <p>📍 Lahore, Pakistan</p>
          <p>📞 +92 300 9876543</p>
          <p>📧 support@artisanconnect.com</p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Our team is available <span className="text-cyan-400 font-semibold">24/7</span> to assist artisans and customers.
          </p>
          <p>
            You can also reach us via WhatsApp or visit our community support center.
          </p>
        </div>
      </div>
    </div>
  );
}
