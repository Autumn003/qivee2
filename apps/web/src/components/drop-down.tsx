"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  className,
  showcategory = false,
}: {
  className?: string;
  showcategory?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: "All",
      target: "/products",
    },
    {
      name: "Backpack",
      target: "/products?category=backpacks",
    },
    {
      name: "Baby products",
      target: "/products?category=baby_products",
    },
    {
      name: "Mobile Accessories",
      target: "/products?category=mobile_accessories",
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <div
          className={cn(
            "flex items-center justify-center cursor-pointer text-secondary-foreground  transition-colors duration-200 hover:text-primary-foreground",
            isOpen && "text-primary-foreground"
          )}
        >
          <p className="text-sm">Categories</p>
          <i className="ri-arrow-down-s-line mx-1"></i>
        </div>
      </button>
      {showcategory && <p>{currentCategory}</p>}
      {isOpen && (
        <div className="absolute lg:top-full -top-4 lg:left-0 left-30 mt-5 w-fit bg-primary-background  rounded-lg overflow-hidden z-50">
          <div className="rounded-lg">
            {categories.map((category) => (
              <div key={category.name} className=" flex">
                <Link
                  href={category.target}
                  className="w-full text-left px-4 py-1 my-1  text-sm text-secondary-foreground   hover:text-primary-foreground transition-colors duration-150"
                  onClick={() => {
                    setIsOpen(false);
                    setCurrentCategory(category.name);
                  }}
                >
                  <Link href={category.target}>{category.name}</Link>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
