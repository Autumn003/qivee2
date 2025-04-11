"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, removeFromWishlist } from "actions/wishlist.action";
import { addToCart } from "actions/cart.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import { toast } from "sonner";

interface WishlistItemWithDetails {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  createdAt: Date;
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItemWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [isAddCartLoading, setIsAddCartLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [itemToRemove, setItemToRemove] =
    useState<WishlistItemWithDetails | null>(null);

  const filteredWishlist = wishlist.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStock = showInStockOnly ? item.stock > 0 : true;
    return matchesSearch && matchesStock;
  });

  const removeItem = async () => {
    if (!itemToRemove) return;
    const id = itemToRemove.productId;
    setIsLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await removeFromWishlist(id);
      if (response.success) {
        setWishlist((items) => items.filter((item) => item.productId !== id));
        setItemToRemove(null);
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const addToCartHandler = async (productId: string) => {
    try {
      setIsAddCartLoading((prev) => ({ ...prev, [productId]: true }));
      const response = await addToCart(productId, 1);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsAddCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    async function fetchCartItems() {
      const response = await getWishlist();
      if (response.success) {
        setWishlist(response.wishlistItems);
      } else {
        console.error("Failed to fetch products:", response.error);
      }
    }
    fetchCartItems();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
            <p className="mt-2 text-sm text-secondary-foreground">
              {wishlist.length} items saved for later
            </p>
          </div>

          <div className="relative mt-4 md:mt-0 ">
            <i className="ri-search-line text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground"></i>
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-secondary-foreground/50"
            />
          </div>
        </div>
        <label className="flex items-center space-x-2 my-4 cursor-pointer">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
            className="rounded border-muted-foreground "
          />
          <span className="text-sm text-secondary-foreground">
            Show in-stock only
          </span>
        </label>

        {filteredWishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredWishlist.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-muted-foreground p-6"
              >
                <div className="flex items-start space-x-6">
                  <div className="md:h-32 md:w-32 h-20 w-20  flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-lg font-medium flex items-center"
                    >
                      {item.name}
                      <i className="ri-arrow-right-up-line ml-1"></i>
                    </Link>
                    <div className="mt-2 flex items-start space-x-4">
                      <p className="text-lg font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.stock > 0
                            ? "bg-emerald-100 text-emerald-500"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {item.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className=" flex justify-between flex-col md:flex-row md:items-center items-start">
                      <p className="mt-2 text-sm text-secondary-foreground">
                        Added on{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center self-end space-x-4">
                        <button
                          onClick={() => addToCartHandler(item.productId)}
                          className="p-2 text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                          title="Add to Cart"
                        >
                          {isAddCartLoading[item.productId] ? (
                            <div className="animate-spin">
                              <i className="ri-loader-4-line text-xl"></i>
                            </div>
                          ) : (
                            <i className="ri-shopping-cart-line text-xl"></i>
                          )}
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setItemToRemove(item)}
                              className="p-2 text-secondary-foreground hover:text-destructive transition-colors duration-150 cursor-pointer"
                              title="Remove from Wishlist"
                            >
                              {isLoading[item.productId] ? (
                                <div className="animate-spin">
                                  <i className="ri-loader-4-line text-xl text-destructive"></i>
                                </div>
                              ) : (
                                <i className="ri-delete-bin-6-line text-xl"></i>
                              )}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove from wishlist?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <strong>{item.name}</strong> from your wishlist?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer border border-secondary-foreground hover:border-primary-foreground rounded-md transition-all duration-150"
                                onClick={() => setItemToRemove(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 cursor-pointer transition-all duration-150"
                                onClick={removeItem}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-heart-line text-5xl text-secondary-foreground"></i>
            <h2 className="mt-4 text-lg font-medium">Your wishlist is empty</h2>
            <p className="mt-2 text-secondary-foreground">
              {searchQuery
                ? "No items match your search criteria"
                : "Start adding items you love to your wishlist"}
            </p>
            {!searchQuery && (
              <Link
                href="/products"
                className="inline-flex items-center mt-6 bg-primary-foreground text-primary-background hover:bg-primary-foreground/80 px-6 py-3 rounded-lg font-medium transition-colors duration-150"
              >
                Browse Products
                <i className="ri-arrow-right-up-line ml-2"></i>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
