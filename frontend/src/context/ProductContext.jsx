import { createContext, useContext } from "react";

// ✅ All product images import yahan rakho
import filter2 from "../assets/filter2.png";
import filter3 from "../assets/filter3.png";
import filter4 from "../assets/filter4.png";
import filter5 from "../assets/filter5.png";
import filter6 from "../assets/filter6.png";
import filter7 from "../assets/filter7.png";
import filter8 from "../assets/filter8.png";
import filter9 from "../assets/filter9.png";
import filter10 from "../assets/filter10.png";
import filter11 from "../assets/filter11.png";
import filter12 from "../assets/filter12.png";
import filter13 from "../assets/filter13.png";
import filter14 from "../assets/filter14.png";
import filter15 from "../assets/filter15.png";
import filter16 from "../assets/filter16.png";
import filter17 from "../assets/filter17.png";
import filter18 from "../assets/filter18.png";
import filter19 from "../assets/filter19.png";
import filter20 from "../assets/filter20.png";
import filter21 from "../assets/filter21.png";
import filter22 from "../assets/filter22.png";
import filter23 from "../assets/filter23.png";
import filter24 from "../assets/filter24.png";
import filter25 from "../assets/filter25.png";
import filter26 from "../assets/filter26.png";
import filter27 from "../assets/filter27.png";
import filter28 from "../assets/filter28.png";
import filter29 from "../assets/filter29.png";
import filter30 from "../assets/filter30.png";
import filter31 from "../assets/filter31.png";
import filter32 from "../assets/filter32.png";
import filter33 from "../assets/filter33.png";
import filter34 from "../assets/filter34.png";
import filter35 from "../assets/filter35.png";
import filter36 from "../assets/filter36.png";
import filter37 from "../assets/filter37.png";
import filter38 from "../assets/filter38.png"; // fallback

// ✅ Categories Data Centralized
const categories = [
  {
    id: "apple",
    name: "Apple",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "apple-silicone-1", name: "Apple Silicone Case 1", price: 1200, image: filter2 },
          { id: "apple-silicone-2", name: "Apple Silicone Case 2", price: 1300, image: filter3 },
          { id: "apple-silicone-3", name: "Apple Silicone Case 3", price: 1500, image: filter4 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "apple-leather-1", name: "Apple Leather Case 1", price: 2200, image: filter5 },
          { id: "apple-leather-2", name: "Apple Leather Case 2", price: 2500, image: filter6 },
          { id: "apple-leather-3", name: "Apple Leather Case 3", price: 2700, image: filter7 },
        ],
      },
    ],
  },
  {
    id: "samsung",
    name: "Samsung",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "samsung-silicone-1", name: "Samsung Silicone Case 1", price: 1100, image: filter8 },
          { id: "samsung-silicone-2", name: "Samsung Silicone Case 2", price: 1400, image: filter9 },
          { id: "samsung-silicone-3", name: "Samsung Silicone Case 3", price: 1600, image: filter10 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "samsung-leather-1", name: "Samsung Leather Case 1", price: 2300, image: filter11 },
          { id: "samsung-leather-2", name: "Samsung Leather Case 2", price: 2500, image: filter12 },
          { id: "samsung-leather-3", name: "Samsung Leather Case 3", price: 2700, image: filter13 },
        ],
      },
    ],
  },
  {
    id: "oppo",
    name: "Oppo",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "oppo-silicone-1", name: "Oppo Silicone Case 1", price: 1000, image: filter14 },
          { id: "oppo-silicone-2", name: "Oppo Silicone Case 2", price: 1200, image: filter15 },
          { id: "oppo-silicone-3", name: "Oppo Silicone Case 3", price: 1400, image: filter16 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "oppo-leather-1", name: "Oppo Leather Case 1", price: 2100, image: filter17 },
          { id: "oppo-leather-2", name: "Oppo Leather Case 2", price: 2300, image: filter18 },
          { id: "oppo-leather-3", name: "Oppo Leather Case 3", price: 2500, image: filter19 },
        ],
      },
    ],
  },
  {
    id: "vivo",
    name: "Vivo",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "vivo-silicone-1", name: "Vivo Silicone Case 1", price: 1100, image: filter20 },
          { id: "vivo-silicone-2", name: "Vivo Silicone Case 2", price: 1300, image: filter21 },
          { id: "vivo-silicone-3", name: "Vivo Silicone Case 3", price: 1500, image: filter22 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "vivo-leather-1", name: "Vivo Leather Case 1", price: 2200, image: filter23 },
          { id: "vivo-leather-2", name: "Vivo Leather Case 2", price: 2400, image: filter24 },
          { id: "vivo-leather-3", name: "Vivo Leather Case 3", price: 2600, image: filter25 },
        ],
      },
    ],
  },
  {
    id: "realme",
    name: "Realme",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "realme-silicone-1", name: "Realme Silicone Case 1", price: 1000, image: filter26 },
          { id: "realme-silicone-2", name: "Realme Silicone Case 2", price: 1200, image: filter27 },
          { id: "realme-silicone-3", name: "Realme Silicone Case 3", price: 1400, image: filter28 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "realme-leather-1", name: "Realme Leather Case 1", price: 2100, image: filter29 },
          { id: "realme-leather-2", name: "Realme Leather Case 2", price: 2300, image: filter30 },
          { id: "realme-leather-3", name: "Realme Leather Case 3", price: 2500, image: filter31 },
        ],
      },
    ],
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    subcategories: [
      {
        id: "silicone",
        name: "Silicone",
        products: [
          { id: "xiaomi-silicone-1", name: "Xiaomi Silicone Case 1", price: 1100, image: filter32 },
          { id: "xiaomi-silicone-2", name: "Xiaomi Silicone Case 2", price: 1300, image: filter33 },
          { id: "xiaomi-silicone-3", name: "Xiaomi Silicone Case 3", price: 1500, image: filter34 },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        products: [
          { id: "xiaomi-leather-1", name: "Xiaomi Leather Case 1", price: 2200, image: filter35 },
          { id: "xiaomi-leather-2", name: "Xiaomi Leather Case 2", price: 2400, image: filter36 },
          { id: "xiaomi-leather-3", name: "Xiaomi Leather Case 3", price: 2600, image: filter37 },
        ],
      },
    ],
  },
];

const ProductContext = createContext();

export function ProductProvider({ children }) {
  return (
    <ProductContext.Provider value={{ categories, fallbackImage: filter38 }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
