"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createAddress, getUserAddresses } from "actions/address.action";
import { Address } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema } from "schemas/address-schema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { clearCart, getCart } from "actions/cart.action";
import { createOrder } from "actions/order.action";
import { PaymentMethod } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface CartItemWithDetails {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    savedAddresses[0]?.id ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    async function fetchAddresses() {
      const response = await getUserAddresses();

      if (response.success) {
        setSavedAddresses(response?.addresses);
        if (response.addresses.length > 0) {
          setSelectedAddress(
            response.addresses.find((addr) => addr.isDefault)?.id || ""
          );
        }
      }
    }
    fetchAddresses();

    async function fetchCartItems() {
      const response = await getCart();
      if (response.success) {
        setCartItems(response.cartItems);
      } else {
        console.error("Failed to fetch products:", response.error);
      }
    }
    fetchCartItems();
  }, []);

  type AddressFormValues = z.infer<typeof addressSchema>;

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      house: "",
      street: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
      mobile: "",
      isDefault: false,
    },
  });

  const handleSubmitAddress = async (data: AddressFormValues) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("house", data.house);
    formData.append("street", data.street);
    formData.append("city", data.city);
    formData.append("zipCode", data.zipCode);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("mobile", data.mobile);
    formData.append("isDefault", data.isDefault ? "true" : "false");
    formData.append("userId", session?.user.id || "");

    const response = await createAddress(formData);
    if (response.error) {
      console.error("Error while creating address: ", response.error);
      toast.error("Failed to add address");
      return;
    }
    setSavedAddresses((prev) =>
      response.address.isDefault
        ? prev
            .map((addr) => ({ ...addr, isDefault: false }))
            .concat(response.address)
        : [...prev, response.address]
    );

    toast.success("Address added successfully");

    addressForm.reset();
    setIsAddingAddress(false);
    setIsLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.info("Please select a shipping address.");
      return;
    }

    setIsLoading(true);

    if (paymentMethod === PaymentMethod.COD) {
      // Handle COD Order
      const response: any = await createOrder(
        session?.user.id || "",
        selectedAddress,
        paymentMethod,
        cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shipping,
        tax
      );

      setIsLoading(false);

      if (response.success) {
        toast.success("Order placed successfully");
        await clearCart();
        router.push(`/order-success?orderId=${response.order.id}`);
      } else {
        toast.error("Error placing order: " + response.error);
      }
    } else {
      // Handle PhonePe Payment
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/initiate`,
          {
            userId: session?.user.id,
            addressId: selectedAddress,
            amount: total,
            name: session?.user.name,
            mobile:
              savedAddresses.find((addr) => addr.id === selectedAddress)
                ?.mobile || "9999999999",
            items: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            shipping,
            tax,
          }
        );

        setIsLoading(false);

        if (data.success && data.redirectUrl) {
          // Store order info in localStorage for reference after payment
          localStorage.setItem("currentOrderId", data.orderId);
          localStorage.setItem("currentTransactionId", data.transactionId);

          // Clear cart before redirecting
          await clearCart();
          toast.success("Order placed successfully");

          // Redirect to PhonePe
          window.location.href = data.redirectUrl;
        } else {
          alert(
            "Payment initiation failed: " + (data.error || "Unknown error")
          );
        }
      } catch (error: any) {
        console.error("PhonePe payment error:", error);
        alert(
          "Payment initiation failed: " +
            (error.response?.data?.error || error.message || "Unknown error")
        );
        setIsLoading(false);
      }
    }
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
                <form
                  onSubmit={addressForm.handleSubmit(handleSubmitAddress)}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        {...addressForm.register("name")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        House / Flat
                      </label>
                      <input
                        {...addressForm.register("house")}
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
                        {...addressForm.register("street")}
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
                        {...addressForm.register("city")}
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
                        {...addressForm.register("state")}
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
                        {...addressForm.register("zipCode")}
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
                        {...addressForm.register("country")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mobile
                      </label>
                      <input
                        {...addressForm.register("mobile")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex gap-5">
                        <span className="text-sm font-medium">
                          Set as default address
                        </span>
                        <input
                          {...addressForm.register("isDefault")}
                          type="checkbox"
                          className="w-5 h-5 rounded-md self-center"
                        />
                      </label>
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
                      className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 flex gap-2 cursor-pointer transition-all duration-150"
                    >
                      {isLoading && (
                        <div className="animate-spin">
                          <i className="ri-loader-4-line"></i>
                        </div>
                      )}
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
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
                              <span className="ml-2 px-2 py-0.5 bg-muted-background text-primary-foreground text-xs rounded-md">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary-foreground mt-1">
                            {address.house}
                          </p>
                          <p className="text-sm text-secondary-foreground mt-1">
                            {address.street}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            {address.country}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            {address.mobile}
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
                  className={`p-4 rounded-lg border cursor-not-allowed ${
                    paymentMethod === PaymentMethod.UPI
                      ? "border-primary-foreground bg-primary-background/5"
                      : "border-muted-foreground"
                  }`}
                >
                  <label className="flex items-center cursor-not-allowed">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === PaymentMethod.UPI}
                      onChange={() => setPaymentMethod(PaymentMethod.UPI)}
                      className="mr-3 cursor-not-allowed"
                      disabled
                    />
                    <div className="flex items-center">
                      <i className="ri-secure-payment-line text-xl mr-2"></i>
                      <p>
                        Online Gateway{" "}
                        <span className="text-secondary-foreground">
                          (Currently unavailable)
                        </span>
                      </p>
                    </div>
                  </label>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    paymentMethod === PaymentMethod.COD
                      ? "border-primary-foreground bg-primary-background/5"
                      : "border-muted-foreground"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === PaymentMethod.COD}
                      onChange={() => setPaymentMethod(PaymentMethod.COD)}
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

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-secondary-background text-primary-background cursor-pointer hover:bg-secondary-background/80 transition-colors duration-150 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
              >
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
