"use client";

import { FeaturedCard } from "@/components";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const exampleProduct = {
  id: "example",
  name: "Nike Air Max 2024 Limited Edition",
  price: 199.99,
  description:
    "Step into the future with the Nike Air Max 2024 Limited Edition. These revolutionary sneakers combine cutting-edge design with unparalleled comfort. Featuring Nike's latest Air cushioning technology, a breathable knit upper, and sustainable materials, these shoes deliver both performance and style. The iridescent accents and premium materials make this limited edition release a must-have for sneaker enthusiasts.",
  rating: 4.9,
  images: [
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1605408499391-6368c628ef42?auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800",
  ],
  sizes: [
    "US 7",
    "US 8",
    "US 8.5",
    "US 9",
    "US 9.5",
    "US 10",
    "US 10.5",
    "US 11",
    "US 12",
  ],
  colors: ["Summit White", "Phantom Black", "University Blue", "Infrared"],
  features: [
    "Next-generation Air cushioning",
    "Sustainable materials - 20% recycled content by weight",
    "Dynamic Fit technology",
    "Reflective design elements",
    "Premium leather and textile upper",
  ],
  ratingBreakdown: {
    5: 198,
    4: 42,
    3: 12,
    2: 3,
    1: 1,
  },
  reviews: [
    {
      id: 1,
      user: {
        name: "Michael Thompson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100",
        verified: true,
      },
      rating: 5,
      date: "2024-03-15",
      title: "Best Running Shoes Ever!",
      content:
        "These are hands down the most comfortable running shoes I've ever owned. The air cushioning is incredible, and I love the sustainable materials used. Perfect for both long runs and casual wear.",
      images: [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300",
        "https://images.unsplash.com/photo-1605408499391-6368c628ef42?auto=format&fit=crop&w=300",
      ],
    },
    {
      id: 2,
      user: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100",
        verified: true,
      },
      rating: 5,
      date: "2024-03-12",
      title: "Exceeded My Expectations",
      content:
        "The attention to detail on these shoes is remarkable. The iridescent accents catch the light beautifully, and the comfort level is outstanding. I've received numerous compliments wearing these.",
    },
    {
      id: 3,
      user: {
        name: "David Martinez",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100",
        verified: true,
      },
      rating: 4,
      date: "2024-03-10",
      title: "Great But Runs Slightly Large",
      content:
        "The shoes are fantastic in terms of comfort and style. Just note that they run about half a size larger than expected. Once I sized down, they were perfect. The sustainable materials are a huge plus.",
    },
  ],
};

const featuredProducts = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  {
    id: 2,
    name: "Leather Tote Bag",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
  },
  {
    id: 3,
    name: "Minimal Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  },
  {
    id: 4,
    name: "Silk Summer Dress",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    id: 5,
    name: "Classic White Sneakers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  {
    id: 6,
    name: "Leather Tote Bag",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
  },
  {
    id: 7,
    name: "Minimal Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  },
  {
    id: 8,
    name: "Silk Summer Dress",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
];

export default function Product() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(exampleProduct.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(exampleProduct.colors[0]);

  const totalReviews = Object.values(exampleProduct.ratingBreakdown).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary-foreground mb-8 hover:bg-secondary-background/10 px-3 transition-all duration-150 py-1 rounded-full"
        >
          <i className="ri-arrow-left-line text-xl mr-2"></i>
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={exampleProduct.images[selectedImage]}
                alt={exampleProduct.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {exampleProduct.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                    selectedImage === idx ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${exampleProduct.name} ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
                {exampleProduct.name}
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-2xl font-semibold text-primary-foreground">
                  ${exampleProduct.price.toFixed(2)}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, idx) => (
                    <i
                      key={idx}
                      className={cn(
                        "ri-star-fill",
                        idx < Math.floor(exampleProduct.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    ></i>
                  ))}
                  <span className="ml-2 text-sm text-secondary-foreground">
                    ({exampleProduct.reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-secondary-foreground leading-relaxed">
              {exampleProduct.description}
            </p>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-primary-foreground">
                Key Features
              </h3>
              <ul className="space-y-2">
                {exampleProduct.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-secondary-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-primary-foreground">
                  Size
                </h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {exampleProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 text-sm font-medium rounded-md border border-muted-background cursor-pointer ${
                      selectedSize === size
                        ? " bg-secondary-background text-primary-background"
                        : "bg-primary-background text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary-foreground">
                Color
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {exampleProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-3 px-4 text-sm font-medium rounded-md border border-muted-background cursor-pointer ${
                      selectedColor === color
                        ? "bg-secondary-background text-primary-background"
                        : "bg-primary-background text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button className="flex-1 font-medium justify-center bg-primary-foreground text-primary-background px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <i className="ri-shopping-cart-line  text-xl"></i>
                Add to Cart
              </button>
              <button className="py-3 px-4 cursor-pointer rounded-lg bg-secondary-background text-primary-background ">
                <i className="ri-heart-line text-2xl"></i>
              </button>
              <button className="py-3 px-4 cursor-pointer rounded-lg bg-secondary-background text-primary-background ">
                <i className="ri-share-line text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      <section className="container mx-auto my-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Recommended Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link href="/" key={product.id} className="group">
              <FeaturedCard
                title={product.name}
                imageURL={product.image}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <div className="space-y-8 container my-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Product Reviews</h2>

        {/* Rating Summary */}
        <div className="bg-secondary/50 rounded-lg p-6 flex">
          <div className="flex flex-col md:flex-row items-center w-full justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{exampleProduct.rating}</h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, idx) => (
                  <i
                    key={idx}
                    className={cn(
                      "ri-star-fill",
                      idx < Math.floor(exampleProduct.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  ></i>
                ))}
              </div>
              <p className="text-sm text-secondary-foreground mt-1 text red">
                Based on {totalReviews} reviews
              </p>
            </div>
            <div className="space-y-2 flex-1 w-full ml-8">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm text-seondary-foreground w-6">
                    {rating}
                  </span>
                  <div className="flex-1 mx-2 h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-yellow-400"
                      style={{
                        width: `${
                          ((exampleProduct.ratingBreakdown[
                            rating as keyof typeof exampleProduct.ratingBreakdown
                          ] || 0) /
                            totalReviews) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {
                      exampleProduct.ratingBreakdown[
                        rating as keyof typeof exampleProduct.ratingBreakdown
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:block hidden"></div>
        </div>

        {/* Reviews List */}
        <div className="space-y-8 h-96 md:h-[30rem] overflow-auto no-scrollbar">
          {exampleProduct.reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{review.user.name}</span>
                      {review.user.verified && (
                        <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, idx) => (
                        <i
                          key={idx}
                          className={cn(
                            "ri-star-fill",
                            idx < Math.floor(exampleProduct.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        ></i>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="font-medium mt-4">{review.title}</h4>
              <p className="mt-2 text-secondary-foreground/70">
                {review.content}
              </p>
              {review.images && (
                <div className="flex space-x-4 mt-4">
                  {review.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Review image ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <button className="flex items-center text-sm text-muted-foreground hover:text-primary-foreground mt-4"></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
