// Import single shared image
import About1 from "../assets/About1.png";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Meet the Masters: Inspiring Artisan Stories",
      excerpt:
        "Step into the world of craftsmanship and meet local artisans transforming tradition into timeless art. Discover their passion, process, and journey on Artisan Connect.",
      image: About1,
    },
    {
      id: 2,
      title: "How to Choose the Right Artisan for Your Project",
      excerpt:
        "Whether it’s home décor, tailoring, or custom design — learn how to find and hire the perfect artisan using reliability scores, verified profiles, and authentic reviews.",
      image: About1,
    },
    {
      id: 3,
      title: "Sustainable Craftsmanship: The Future of Handmade Work",
      excerpt:
        "Explore how digital platforms like Artisan Connect are helping local artisans embrace eco-friendly materials and sustainable practices to preserve culture and craft.",
      image: About1,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
          Craft <span className="text-white">Insights</span> & Stories
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto text-lg">
          Explore inspiring stories, tips, and guides from skilled artisans shaping the world of handmade excellence.
        </p>

        {/* Blog Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-56 w-full object-cover transform group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="mt-5 inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition">
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
