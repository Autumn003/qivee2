"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "actions/product.action";
import { Product } from "@prisma/client";
import { FeaturedCard } from "@/components";

interface Props {
  count: number;
  variant: "newest" | "featured";
}

export default function FeaturedProducts({ count, variant }: Props) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.success) {
          if (variant === "featured") {
            const featuredProducts = response.products
              .filter((product: Product) => product.isFeatured)
              .slice(0, count);

            setFeaturedProducts(featuredProducts);
          } else if (variant === "newest") {
            const featuredProducts = response.products.slice(0, count);
            setFeaturedProducts(featuredProducts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={`my-16 ${featuredProducts.length < 1 ? "hidden" : ""}`}>
      <div className="flex justify-between flex-col sm:flex-row mb-8 items-end gap-3">
        <div className="w-full hidden lg:block"></div>
        <div className="w-full lg:text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {(variant === "newest" && "New Arrivals") ||
              (variant === "featured" && "Featured products")}
          </h1>
        </div>
        <div className="w-full flex justify-end">
          <Link
            href="/featured"
            className="flex gap-2 text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 w-fit justify-end"
          >
            <p className="text-sm">
              {(variant === "newest" && "New Arrivals") ||
                (variant === "featured" && "Featured products")}
            </p>
            <i className="ri-arrow-right-up-line"></i>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <Link href={`/products/${product.id}`}>
            <FeaturedCard
              title={product.name}
              imageURL={product.images[0] || ""}
              price={product.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
