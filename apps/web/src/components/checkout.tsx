"use client";

import { useState } from "react";
import Link from "next/link";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

const savedAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    street: "456 Park Avenue",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "United States",
    isDefault: false,
  },
];

const cartItems: CartItem[] = [
  {
    id: "example",
    name: "Nike Air Max 2024 Limited Edition",
    price: 199.99,
    color: "Summit White",
    size: "US 9.5",
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800",
  },
  {
    id: "product2",
    name: "Nike Zoom Pegasus 40",
    price: 129.99,
    color: "Black/White",
    size: "US 10",
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800",
  },
];

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState<string>(
    savedAddresses[0]?.id ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "UPI" | "COD">(
    "card"
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 12.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle new address submission
    setIsAddingAddress(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="inline-flex items-center px-3 py-2 text-sm text-secondary-foreground hover:text-primary-foreground-foreground hover:bg-secondary-background/10 transition-all duration-150 rounded-full"
          >
            <i className="ri-arrow-left-line mr-1 text-lg"></i>
            Back to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Address */}
            <div className="bg-card rounded-lg border border-muted-foreground p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-xl">
                  <i className="ri-map-pin-line mr-2"></i>
                  <h2 className="text-lg font-medium">Shipping Address</h2>
                </div>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="inline-flex items-center text-sm text-primary-foreground hover:text-primary-foreground/80 cursor-pointer"
                >
                  <i className="ri-add-line mr-1 text-lg"></i>
                  Add New Address
                </button>
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer border border-secondary-foreground hover:border-primary-foreground rounded-md transition-all duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 cursor-pointer transition-all duration-150"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* {savedAddresses.length > 0 && */}
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg border ${
                        selectedAddress === address.id
                          ? "border-primary-foreground bg-primary-background/5"
                          : "border-muted-foreground"
                      }`}
                    >
                      <label className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{address.name}</p>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-background/10 text-primary-foreground text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary-foreground mt-1">
                            {address.street}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            {address.country}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg border border-muted-foreground p-6">
              <div className="flex items-center mb-6">
                <i className="ri-bank-card-line mr-2 text-xl"></i>
                <h2 className="text-lg font-medium">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    paymentMethod === "card"
                      ? "border-primary-foreground bg-primary-background/5"
                      : "border-muted-foreground"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-bank-card-line mr-2 text-xl"></i>
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                  {paymentMethod === "card" && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    paymentMethod === "UPI"
                      ? "border-primary-foreground bg-primary-background/5"
                      : "border-muted-foreground"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <img
                        src="/media/upi-icon.svg"
                        alt="UPI"
                        className="h-6 mr-2"
                      />
                      <span>UPI</span>
                    </div>
                  </label>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    paymentMethod === "COD"
                      ? "border-primary-foreground bg-primary-background/5"
                      : "border-muted-foreground"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <img
                        src="/media/cod-icon.svg"
                        alt="COD"
                        className="h-6 mr-2 dark:invert"
                      />
                      <span>Cash on delivery</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg border border-muted-foreground p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <i className="ri-box-1-line mr-2 text-xl"></i>
                <h2 className="text-lg font-medium">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-secondary-foreground">
                        {item.color} • Size {item.size}
                      </p>
                      <p className="text-sm text-secondary-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

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

              <button className="w-full mt-6 bg-secondary-background text-primary-background cursor-pointer hover:bg-secondary-background/80 transition-colors duration-150 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                Place Order
                <i className="ri-checkbox-circle-line ml-2 "></i>
              </button>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
