import React from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

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
  name,
  price,
  category,
  image,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "border border-muted-background rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]",
        className
      )}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-sm text-blue-600 font-medium">{category}</span>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold">${price}</span>
          <button className="bg-primary-foreground text-primary-background px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
            <i className="ri-shopping-cart-line  text-xl"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
