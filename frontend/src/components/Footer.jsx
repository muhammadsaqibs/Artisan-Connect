export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 py-12 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo & About */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">Artisan Connect</h3>
          <p className="text-gray-400 text-sm">
            Hire trusted local professionals. Quality service, clear pricing, easy booking.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/shop" className="hover:underline">Shop</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">Email: support@artisanconnect.app</p>
          <p className="text-sm">Phone: +92 300 1234567</p>
          <p className="text-sm">Lahore, Pakistan</p>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} ArtisanConnect. All rights reserved.
      </div>
    </footer>
  );
}
