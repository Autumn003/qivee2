import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  category,
  image,
  description,
  className,
}) => {
  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      className={cn(
        "border border-muted-background rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]",
        className
      )}
    >
      <Link href={`/product/${id}`}>
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <span
            className={cn(
              "text-sm font-medium  px-2 py-1 rounded-full",
              category === "women's-bagpack" &&
                "text-emerald-600 bg-emerald-300/30",
              category === "baby-products" && "text-cyan-600 bg-cyan-300/30",
              category === "mobile-accessories" &&
                "text-amber-600 bg-amber-300/30"
            )}
          >
            {formatCategory(category)}
          </span>
          <h3 className="text-lg font-semibold mt-3">{name}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold">${price}</span>
            <button className="bg-primary-foreground hover:bg-primary-foreground/80 text-primary-background px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
              <i className="ri-shopping-cart-line  text-xl"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
