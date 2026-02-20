// top of file
const API = import.meta.env.VITE_API_URL;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Shop() {
  const [products, setProducts] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const params = {
          keyword: keyword || undefined,
          category: category || undefined,
          sort: sort || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        };
        const { data } = await axios.get(`${API}/api/products`, {
          params,
          signal: controller.signal,
        });
        // API returns {success, data, page, pages, total}
        setProducts(data.data || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching products:", err);
      }
    };
    load();
    return () => controller.abort();
  }, [keyword, category, sort, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
        Our Products
      </h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="bg-black/20 border border-white/10 text-white placeholder-gray-400 p-2 rounded"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select className="bg-black/20 border border-white/10 text-white p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Sports">Sports</option>
          <option value="Books">Books</option>
        </select>
        <select className="bg-black/20 border border-white/10 text-white p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="bg-black/20 border border-white/10 text-white p-2 rounded w-1/2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="bg-black/20 border border-white/10 text-white p-2 rounded w-1/2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg animate-pulse">Loading products...</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/5 border border-white/10 backdrop-blur rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-60 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h2>
                <p className="text-cyan-300 font-bold mb-4">
                  ${Number(product.price).toFixed(2)}
                </p>
                <Link
                  to={`/product/${product._id}`}
                  className="block w-full text-center relative inline-flex items-center justify-center py-2 rounded-lg overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <span className="relative">View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
