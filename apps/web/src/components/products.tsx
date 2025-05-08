"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "./product-card";
import Dropdown from "./drop-down";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getAllProducts } from "actions/product.action";
import { Product, productCategory } from "@prisma/client";

const Products = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const selectedCategory = searchParams.get("category") as
    | productCategory
    | null
    | "All";

  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts = (
    !selectedCategory || selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === (selectedCategory as productCategory)
        )
  )
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

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

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.products);
      }
    };
    fetchProducts();
  }, []);

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
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground"></i>
              <input
                type="text"
                placeholder="Search for a featured product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-secondary-background/20"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-secondary-background/20 bg-primary-background"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
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
