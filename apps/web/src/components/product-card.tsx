"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Product, productCategory } from "@prisma/client";
import { addToCart } from "actions/cart.action";
import { toast } from "sonner";

interface ProductCardProps extends Product {
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  category,
  images,
  description,
  className,
}) => {
  const formatCategory = (category: string) => {
    return category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const [loading, setLoading] = useState(false);

  const addToCartHandler = async (id: string) => {
    try {
      setLoading(true);
      const response = await addToCart(id, 1);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "border border-muted-background rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]",
        className
      )}
    >
      <div>
        <Link href={`/products/${id}`}>
          <img
            src={images[0]}
            alt={name}
            className="w-full h-48 object-cover"
          />
        </Link>
        <div className="p-4">
          <span
            className={cn(
              "text-sm font-medium  px-2 py-1 rounded-full",
              category === productCategory.women_bagpacks &&
                "text-emerald-500 bg-emerald-100",
              category === productCategory.baby_products &&
                "text-cyan-500 bg-cyan-100",
              category === productCategory.mobile_accessories &&
                "text-amber-500 bg-amber-100"
            )}
          >
            {formatCategory(category)}
          </span>
          <Link href={`/products/${id}`}>
            <h3 className="text-lg font-semibold mt-3">{name}</h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {description}
            </p>
          </Link>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold">${price}</span>
            <button
              disabled={loading}
              onClick={!loading ? () => addToCartHandler(id) : undefined}
              className="bg-primary-foreground hover:bg-primary-foreground/80 text-primary-background px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <i className="ri-loader-4-line text-xl"></i>
                  </div>
                  Add to Cart
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="ri-shopping-cart-line  text-xl"></i>
                  Add to Cart
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
