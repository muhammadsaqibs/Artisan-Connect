// top of file
const API = import.meta.env.VITE_API_URL || 'https://artisan-connect-production.up.railway.app';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryFilter from "../components/CategoryFilter";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const API_BASE = "API";
  const { addToCart } = useCart();
  const { category, subcategory } = useParams();
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await axios.get("API/api/categories");
        if (!ignore) setCategories(data?.data || []);
      } catch {
        if (!ignore) setCategories([]);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Load products
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const params = {};
        if (category) params.category = category;
        if (subcategory) params.subCategory = subcategory;
        if (search.trim()) params.keyword = search.trim();
        const { data } = await axios.get("API/api/products", { params, signal: controller.signal });
        setProducts(data?.data || []);
      } catch (e) {
        if (!axios.isCancel(e)) {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [category, subcategory, search]);

  const handleAddToCart = (p) => {
    addToCart({ id: p._id || p.id, title: p.name, image: p.image, price: p.price });
    setAlert(`✅ ${p.name} added to cart successfully!`);
    setTimeout(() => setAlert(""), 2500);
  };

  return (
    <div className="p-6">
      {alert && (
        <div className="mb-4 text-center bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow">
          {alert}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Explore Our Products</h2>
      </div>

      <p className="text-gray-500 text-center mb-6">
        Discover premium mobile covers by brand, category & style.  
        Search your favorite design or filter by category.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <CategoryFilter categories={categories.map(c => ({ id: c.id, name: c.name, subcategories: c.subcategories }))} />

        <div className="flex justify-center items-center w-full md:w-1/2 mx-auto rounded-2xl overflow-hidden bg-neutral-900 text-white ">
          <input
            type="text"
            placeholder="Search by keyword, category or style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 outline-none bg-gray-200 text-gray-800 placeholder-gray-500 rounded-md"
          />
        </div>
      </div>

      {!loading ? (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id || p.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-4 flex flex-col items-center text-center"
              >
                <img
                  src={p.image?.startsWith("http") ? p.image : `${API_BASE}${p.image || ""}`}
                  alt={p.name}
                  className="w-32 h-32 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-gray-600 font-medium mb-2">$ {p.price}</p>
                <p className="text-sm text-gray-500 mb-3">
                  {p.brand ? `${p.brand}` : "Premium mobile cover"}
                </p>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="mt-auto w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No products found.
          </div>
        )
      ) : (
        <div className="text-center text-gray-400 mt-20">Loading products...</div>
      )}
    </div>
  );
}
