// Import blog images
import Blog1 from "../assets/blog1.png";
import Blog2 from "../assets/blog2.png";
import Blog3 from "../assets/blog3.png";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Meet the Masters: Inspiring Artisan Stories",
      excerpt:
        "Discover local artisans transforming ideas into exceptional services. Learn about their journey, expertise, and how they make a difference through Artisan Connect.",
      image: Blog1,
    },
    {
      id: 2,
      title: "How to Choose the Right Artisan for Your Project",
      excerpt:
        "Find and hire the perfect artisan for your project with confidence using verified profiles, reliability scores, and authentic reviews on Artisan Connect.",
      image: Blog2,
    },
    {
      id: 3,
      title: "Sustainable and Efficient Services: The Future of Artisans",
      excerpt:
        "Explore how digital platforms like Artisan Connect are helping local artisans improve efficiency, embrace modern practices, and deliver quality services.",
      image: Blog3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
          Insights & <span className="text-white">Stories</span>
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto text-lg mb-12">
          Explore inspiring stories, tips, and guides from skilled artisans shaping the future of services.
        </p>

        {/* Blog Grid */}
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-t-3xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
                <button className="mt-6 inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
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
