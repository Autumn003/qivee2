"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrderById } from "actions/order.action";
import { Order, OrderItem } from "@prisma/client";

interface ExtendedOrderItem extends OrderItem {
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

interface OrderWithItems extends Order {
  orderItems: ExtendedOrderItem[];
  shippingName: string;
  shippingHouse: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  totalPrice: number;
}

export default function OrderSuccess({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResendEmail = () => {
    setIsEmailSent(true);
    // Implement email resending logic here
  };

  useEffect(() => {
    if (!orderId) return;
    async function fetchOrders() {
      const response = await getOrderById(orderId);
      if (response.success) {
        setOrder(response.order as OrderWithItems);
      }
    }
    fetchOrders();
  }, [orderId]);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-section");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (error) {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>${styles}</style>
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="max-width: 600px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 10px;">
              ${printContent.innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <i className="ri-checkbox-circle-line text-3xl text-emerald-600"></i>
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div
          id="printable-section"
          className="bg-card rounded-lg border border-muted-foreground overflow-hidden"
        >
          <div className="p-6 border-b border-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <i className="ri-box-1-line text-2xl"></i>
                <div>
                  <h2 className="text-lg font-medium">Order #{order.id}</h2>
                  <div className="flex items-center mt-1 space-x-2 text-sm text-secondary-foreground">
                    <i className="ri-calendar-line text-lg"></i>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center text-sm text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150 cursor-pointer"
              >
                <i className="ri-printer-line text-lg mr-1"></i>
                Print Receipt
              </button>
            </div>
          </div>

          {/* Order Items */}
          {order.orderItems.length > 0 && (
            <div className="p-6 border-b border-muted-foreground">
              <h3 className="font-medium mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-secondary-foreground">
                        Qty: {item.quantity} × ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Information */}
          <div className="p-6 border-b border-muted-foreground">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-sm text-secondary-foreground">
              <p>{order.shippingName}</p>
              <p>{order.shippingHouse}</p>
              <p>{order.shippingStreet}</p>
              <p>
                {order.shippingCity}, {order.shippingState}{" "}
                {order.shippingZipCode}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="flex justify-end">
              <div className="w-full md:w-72">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Subtotal</span>
                    <span className="font-medium">
                      ₹{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Shipping</span>
                    <span className="font-medium">₹12.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Tax</span>
                    <span className="font-medium">
                      ₹{(order.totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-muted-foreground pt-2 mt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      ₹
                      {(
                        order.totalPrice +
                        12.99 +
                        order.totalPrice * 0.18
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 border border-muted-foreground rounded-lg font-medium flex items-center justify-center "
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-secondary-background text-primary-background rounded-lg font-medium flex items-center justify-center hover:bg-secondary-background/80 transition-colors duration-150"
          >
            View Order Status
            <i className="ri-arrow-right-line text-lg ml-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
