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
  const selectedCategory = searchParams.get("category") as
    | productCategory
    | null
    | "All";

  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts =
    !selectedCategory || selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === (selectedCategory as productCategory)
        );

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
