"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "actions/cart.action";
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
import { CartItem } from "@prisma/client";
import { toast } from "sonner";

interface CartItemWithDetails {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart({
  initialItems,
}: {
  initialItems: CartItemWithDetails[];
}) {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>(
    initialItems || []
  );
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(!initialItems);
  const [isQuantityLoading, setIsQuantityLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [itemToRemove, setItemToRemove] = useState<CartItemWithDetails | null>(
    null
  );

  const updateQuantityHandler = async (
    cartItemId: string,
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      toast.info("Quantity must be atleast 1");
      return;
    }
    setIsQuantityLoading((prev) => ({ ...prev, [cartItemId]: true }));
    try {
      const response = await updateQuantity(productId, newQuantity);

      if (response.success) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity:", response.error);
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setIsQuantityLoading((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const removeItem = async () => {
    if (!itemToRemove) return;
    const { productId, id } = itemToRemove;
    setIsLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await removeFromCart(productId);
      if (response.success) {
        setCartItems((items) =>
          items.filter((item) => item.productId !== productId)
        );
        setItemToRemove(null);
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }));
      setItemToRemove(null);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getShippingCharge = (itemCount: number) => {
    if (itemCount <= 2) return 99.99;
    if (itemCount <= 4) return 199.99;
    if (itemCount <= 6) return 299.99;
    return 300; // Default to 300 for more than 6 items
  };

  const shipping = getShippingCharge(totalItems);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!initialItems) {
      async function fetchCartItems() {
        const response = await getCart();
        if (response.success) {
          setCartItems(response.cartItems);
        } else {
          console.error("Failed to fetch products:", response.error);
        }
      }
      fetchCartItems();
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted-background/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            Shopping Cart
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center px-3 py-2 text-sm text-secondary-foreground hover:text-primary-foreground hover:bg-secondary-background/10 transition-all duration-150 rounded-full"
          >
            <i className="ri-arrow-left-line mr-1 text-lg"></i>
            Continue Shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 max-h-[40rem] overflow-auto p-4 border border-muted-background rounded-2xl custom-scrollbar">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-card p-4 rounded-lg border border-muted-foreground"
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-4 justify-between w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-primary-foreground">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary-foreground">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between w-full md:justify-normal md:w-fit space-x-4">
                        <div className="flex items-center border border-muted-foreground rounded-md">
                          <button
                            onClick={() =>
                              updateQuantityHandler(
                                item.id,
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="p-2 text-secondary-foreground transition-colors cursor-pointer hover:text-primary-foreground"
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className=" w-6 text-center text-sm font-medium">
                            {isQuantityLoading[item.id] ? (
                              <div className="animate-spin">
                                <i className="ri-loader-4-line"></i>
                              </div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantityHandler(
                                item.id,
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="p-2 text-secondary-foreground transition-colors cursor-pointer hover:text-primary-foreground"
                          >
                            <i className="ri-add-line w-4"></i>
                          </button>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setItemToRemove(item)}
                              className="p-2 text-secondary-foreground transition-colors cursor-pointer hover:text-destructive"
                            >
                              {isLoading[item.id] ? (
                                <div className="animate-spin text-center">
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
                                Remove from cart?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <strong>{item.name}</strong> from your cart?
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
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-card rounded-lg border border-muted-foreground p-6">
                <h2 className="text-lg font-medium text-primary-foreground mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Shipping</span>
                    <span className="font-medium">₹{shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-muted-foreground pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-base font-medium">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full mt-6 mb-4 bg-secondary-background text-primary-background cursor-pointer hover:bg-secondary-background/80 transition-colors duration-150 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  Checkout
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
                <div className="flex items-center text-xs text-info mt-1 text-muted-foreground">
                  <i className="ri-information-line mr-1"></i>
                  <span>
                    Shipping charge is refundable only for online payments
                  </span>
                </div>
              </div>

              {/* Secure Checkout Notice */}
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center text-sm text-muted-foreground">
                  <i className="ri-shopping-bag-3-line text-lg mr-2"></i>
                  <p>
                    Secure checkout powered by{" "}
                    <span className="text-[#673ab7]">PhonePe</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-shopping-bag-3-line text-6xl text-muted-foreground mx-auto"></i>
            <h2 className="mt-4 text-lg font-medium text-primary-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-secondary-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center mt-6 bg-secondary-background text-primary-background hover:bg-secondary-background/80 px-6 py-3 rounded-lg font-medium"
            >
              Start Shopping
              <i className="ri-arrow-right-line ml-2 "></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
