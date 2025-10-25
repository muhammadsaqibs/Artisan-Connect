import { useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryFilter({ categories }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Close dropdown when subcategory selected
  const handleSelect = () => {
    setOpenDropdown(false);
    setHoveredCategory(null);
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
      >
        Shop by Category
      </button>

      {/* Categories Dropdown */}
      {openDropdown && (
        <div className="absolute mt-2 bg-white border shadow-lg rounded-lg w-56 z-20">
          {/* Close Button */}
          <div className="flex justify-between items-center border-b px-4 py-2">
            <span className="font-semibold text-gray-600">Categories</span>
            <button
              onClick={() => setOpenDropdown(false)}
              className="text-gray-500 hover:text-red-500 text-sm"
            >
              ✕
            </button>
          </div>

          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                {cat.name}
              </div>

              {/* Subcategories on hover */}
              {hoveredCategory?.id === cat.id && (
                <div className="absolute left-full top-0 bg-white border shadow-lg rounded-lg w-56">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/products/${cat.id}/${sub.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={handleSelect}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
