"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "./product-card";
import Dropdown from "./drop-down";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    category: "women's-bagpack",
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

const Products = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const scrollHandle = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", scrollHandle);
    return () => window.removeEventListener("scroll", scrollHandle);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl text-center font-bold text-secondary-foreground mb-8">
          Our Products
        </h1>

        <div
          className={cn(
            "sticky mb-8 top-20 z-10 bg-muted-background/30 backdrop-blur-lg w-fit rounded-2xl px-4 py-2 h-fit flex items-center transition-all duration-300",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          )}
        >
          <Dropdown className="flex" showcategory={true} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredProducts.map((product) => (
            <ProductCard
              className="md:my-5 my-2"
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
