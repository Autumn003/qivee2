"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "./product-card";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    category: "mobile-accessories",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality.",
  },
  {
    id: 2,
    name: "Leather Messenger Bag",
    price: 89.99,
    category: "women-bagpacks",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    description:
      "Handcrafted leather messenger bag perfect for daily use and business meetings.",
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 149.99,
    category: "mobile-accessories",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    category: "baby-products",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    description:
      "Comfortable and eco-friendly cotton t-shirt made from organic materials.",
  },
  {
    id: 5,
    name: "Wireless Gaming Mouse",
    price: 79.99,
    category: "mobile-accessories",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    description:
      "Professional gaming mouse with customizable RGB lighting and precision tracking.",
  },
];

const categories = [...new Set(products.map((product) => product.category))];

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") || "All";

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
