"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Example orders data
const orders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-03-20",
    status: "delivered",
    total: 329.97,
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-03-25",
    items: [
      {
        id: "item1",
        productId: "example",
        name: "Nike Air Max 2024 Limited Edition",
        price: 199.99,
        color: "Summit White",
        size: "US 9.5",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800",
      },
      {
        id: "item2",
        productId: "product2",
        name: "Nike Zoom Pegasus 40",
        price: 129.99,
        color: "Black/White",
        size: "US 10",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-18",
    status: "shipped",
    total: 199.99,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-03-23",
    items: [
      {
        id: "item3",
        productId: "example",
        name: "Nike Air Max 2024 Limited Edition",
        price: 199.99,
        color: "Phantom Black",
        size: "US 10",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-03-15",
    status: "processing",
    total: 259.98,
    items: [
      {
        id: "item4",
        productId: "product2",
        name: "Nike Zoom Pegasus 40",
        price: 129.99,
        color: "University Blue",
        size: "US 9",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800",
      },
    ],
  },
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <i className="ri-time-line text-lg"></i>;
      case "shipped":
        return <i className="ri-truck-line text-lg"></i>;
      case "delivered":
        return <i className="ri-checkbox-circle-line text-lg"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="mt-2 text-sm text-secondary-foreground">
              View and manage your order history
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <i className="ri-search-line absolute left-3 top-2 text-lg text-secondary-foreground"></i>
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Order["status"] | "all")
              }
              className="px-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary-background"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-muted-background/30 rounded-lg border border-muted-foreground overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <i className="ri-box-1-line text-2xl"></i>
                    <div>
                      <h2 className="text-lg font-medium">{order.id}</h2>
                      <div className="flex items-center mt-1 space-x-2 text-sm text-secondary-foreground">
                        <i className="ri-calendar-line text-lg"></i>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full flex items-center space-x-1.5 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder === order.id ? null : order.id
                        )
                      }
                      className="p-2 hover:bg-muted-background rounded-md"
                    >
                      <div
                        className={cn(
                          "transition-transform",
                          selectedOrder === order.id
                            ? "transform rotate-180"
                            : ""
                        )}
                      >
                        <i className="ri-arrow-down-s-line text-xl"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order.id && (
                <div className="p-6 bg-secondary/30">
                  {/* Tracking Information */}
                  {order.trackingNumber && (
                    <div className="mb-6 p-4 rounded-lg border border-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Tracking Number</h3>
                          <p className="text-sm text-secondary-foreground mt-1">
                            {order.trackingNumber}
                          </p>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="text-right">
                            <h3 className="font-medium">Estimated Delivery</h3>
                            <p className="text-sm text-secondary-foreground mt-1">
                              {new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="h-20 w-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-foreground hover:text-primary flex items-center"
                          >
                            <span className="font-medium">{item.name}</span>
                            <i className="ri-arrow-right-up-line ml-1 text-lg"></i>
                          </Link>
                          <p className="text-sm text-secondary-foreground mt-1">
                            {item.color} • Size {item.size}
                          </p>
                          <p className="text-sm text-secondary-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-muted-foreground">
                    <div className="flex justify-end">
                      <div className="w-full sm:w-72">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-foreground font-medium">
                            Total
                          </span>
                          <span className="font-medium">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    {order.status === "delivered" && (
                      <button className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md hover:bg-primary/90">
                        Write a Review
                      </button>
                    )}
                    <button className="px-4 py-2 border border-muted-foreground rounded-md hover:bg-secondary">
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-box-1-line text-6xl text-muted-foreground"></i>
            <h2 className="mt-4 text-lg font-medium text-foreground">
              No orders found
            </h2>
            <p className="mt-2 text-secondary-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter settings"
                : "You haven't placed any orders yet"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link
                href="/products"
                className="inline-flex items-center mt-6 bg-primary-foreground text-primary-background hover:bg-primary/90 px-6 py-3 rounded-lg font-medium"
              >
                Start Shopping
                <i className="ri-arrow-right-up-line ml-2 text-lg"></i>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
