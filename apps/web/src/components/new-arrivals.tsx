"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "actions/product.action";
import { Product } from "@prisma/client";
import { addToWishlist } from "actions/wishlist.action";

export default function NewArrivals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [newArrivals, setnewArrivals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Filter and sort products
  const filteredProducts = newArrivals
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

  const addToWishlistHandler = async (productId: string) => {
    try {
      setLoadingProductId(productId);
      const response = await addToWishlist(productId);
      if (response.error) {
        console.error("Validation Error:", response.error.message);
        alert(response.error.message);
        return;
      }
      alert("Product added to wishlist");
    } catch (error) {
      console.error("Error while adding product to wishlist:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.success) {
          setnewArrivals(response.products.slice(0, 12));
          const featuredProducts = response.products
            .filter((product: Product) => product.isFeatured)
            .slice(0, 4);

          setFeaturedProducts(featuredProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto container py-8">
        <div className="mb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/products"
                className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary-foreground mb-8 hover:bg-secondary-background/10 px-3 transition-all duration-150 py-1 rounded-full"
              >
                <i className="ri-arrow-left-line text-xl mr-2"></i>
                Back to all Products
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                New Arrivals
              </h1>
              <p className="mt-2 text-secondary-foreground">
                Discover our latest collection of premium products
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground"></i>
                <input
                  type="text"
                  placeholder="Search new arrivals..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-muted-foreground overflow-hidden hover:border-primary-foreground/50 transition-colors duration-150"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToWishlistHandler(product.id);
                        }}
                        className="h-10 w-10 rounded-full bg-secondary-background/30 hover:bg-red-100/80 hover:text-red-400 backdrop-blur-md transition-colors duration-200"
                      >
                        {loadingProductId === product.id ? (
                          <div className="animate-spin">
                            <i className="ri-loader-4-line text-xl"></i>
                          </div>
                        ) : (
                          <i className="ri-heart-line text-xl"></i>
                        )}
                      </button>
                    </div>
                    <div className="absolute top-3 left-2">
                      <span className="px-2 py-0.5 rounded-full text-emerald-500 bg-emerald-400/30 border-emerald-400 border backdrop-blur-md transition-colors duration-200 text-sm">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-secondary-foreground group-hover:text-primary-foreground transition-colors duration-150">
                        {product.name}
                      </h3>
                      <i className="ri-arrow-right-up-line text-xl text-muted-foreground group-hover:text-primary-foreground transition-colors duration-150"></i>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-error-warning-line text-6xl mx-auto text-muted-foreground"></i>
              <h2 className="mt-4 text-lg font-medium">No products found</h2>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter settings
              </p>
            </div>
          )}
        </div>
        <div className={`my-16 ${featuredProducts.length < 1 ? "hidden" : ""}`}>
          <div className="flex justify-between mb-6 items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Featured
              </h1>
            </div>
            <Link
              href="/featured"
              className="flex gap-2 text-secondary-foreground hover:text-primary-foreground transition-colors duration-150"
            >
              <p className="text-sm">Featured products</p>
              <i className="ri-arrow-right-up-line"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-muted-foreground overflow-hidden hover:border-primary-foreground/50 transition-colors duration-150"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToWishlistHandler(product.id);
                        }}
                        className="h-10 w-10 rounded-full bg-secondary-background/30 hover:bg-red-100/80 hover:text-red-400 backdrop-blur-md transition-colors duration-200"
                      >
                        {loadingProductId === product.id ? (
                          <div className="animate-spin">
                            <i className="ri-loader-4-line text-xl"></i>
                          </div>
                        ) : (
                          <i className="ri-heart-line text-xl"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-secondary-foreground group-hover:text-primary-foreground transition-colors duration-150">
                        {product.name}
                      </h3>
                      <i className="ri-arrow-right-up-line text-xl text-muted-foreground group-hover:text-primary-foreground transition-colors duration-150"></i>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
