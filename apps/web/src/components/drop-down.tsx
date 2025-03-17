"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      name: "All",
      target: "/products",
    },
    {
      name: "Women’s Backpack",
      target: "/women-bacgpack",
    },
    {
      name: "Baby products",
      target: "/baby-products",
    },
    {
      name: "Mobile Accessories",
      target: "/mobile-accessories",
    },
  ];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <div
          className={cn(
            "flex items-center justify-center cursor-pointer text-secondary-foreground  transition-colors duration-200 hover:text-primary-foreground",
            isOpen && "text-primary-foreground"
          )}
        >
          <h4>Categories</h4>
          <i className="ri-arrow-down-s-line mx-1"></i>
        </div>
      </button>
      {isOpen && (
        <div className="absolute lg:top-full -top-4 lg:left-0 left-30 mt-5 w-fit bg-primary-background  rounded-lg overflow-hidden z-50">
          <div className="rounded-lg">
            {categories.map((category) => (
              <div key={category.name} className=" flex">
                <Link
                  href={category.target}
                  className="w-full text-left px-4 py-1 my-1  text-sm text-secondary-foreground   hover:text-primary-foreground transition-colors duration-150"
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
