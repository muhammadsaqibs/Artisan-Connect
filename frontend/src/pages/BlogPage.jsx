// Import local images
import trend1 from "../assets/trend1.jpg";
import trend2 from "../assets/trend2.jpg";
import trend3 from "../assets/trend3.jpg";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Fashion Trends of 2025",
      excerpt: "Discover the hottest styles and fashion trends you can’t miss this year...",
      image: trend1,
    },
    {
      id: 2,
      title: "How to Save Money While Shopping Online",
      excerpt: "Smart shopping tips to get the best deals without compromising quality...",
      image: trend2,
    },
    {
      id: 3,
      title: "Essential Gadgets for Your Home",
      excerpt: "From smart devices to everyday essentials, upgrade your home life...",
      image: trend3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
          Latest <span className="text-white">Blogs</span>
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto text-lg">
          Stay updated with the latest trends, tips, and insights from the world of fashion and shopping.
        </p>

        {/* Blog Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 border border-white/10 backdrop-blur rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.01] transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                <p className="text-gray-400 mt-3">{post.excerpt}</p>
                <button className="mt-4 text-cyan-300 hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
