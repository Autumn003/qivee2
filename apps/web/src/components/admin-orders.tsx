"use client";

import { useEffect, useState } from "react";
import { OrderStatus, Order, OrderItem, UserRole } from "@prisma/client";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "actions/order.action";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ExtendedOrderItem extends OrderItem {
  name: string;
  image: string;
}

interface OrderWithItems extends Order {
  items: ExtendedOrderItem[];
  shippingAddress: {
    name: string;
    house: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    mobile: string;
  };
}

export default function AdminOrders() {
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      const response = await getAllOrders();
      if (response.success) {
        const formattedOrders = response.orders.map((order) => ({
          ...order,
          shippingAddress: order.shippingAddress || {},
          items: order.orderItems.map((orderItem) => ({
            id: orderItem.id,
            productId: orderItem.product.id,
            orderId: orderItem.orderId,
            name: orderItem.product.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            image: orderItem.product.images[0] || "",
          })),
        }));
        setOrders(formattedOrders);
      }
    }
    fetchOrders();
  }, []);

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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return "bg-amber-300/30 text-amber-500";
      case OrderStatus.SHIPPED:
        return "bg-sky-300/30 text-sky-500";
      case OrderStatus.DELIVERED:
        return "bg-emerald-300/30 text-emerald-500";
      case OrderStatus.CANCELLED:
        return "bg-red-300/30 text-red-500";
      default:
        return "bg-slate-300/30 text-slate-500";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return <i className="ri-time-line text-lg"></i>;
      case OrderStatus.SHIPPED:
        return <i className="ri-truck-line text-lg"></i>;
      case OrderStatus.DELIVERED:
        return <i className="ri-checkbox-circle-line text-lg"></i>;
      case OrderStatus.CANCELLED:
        return <i className="ri-close-circle-line text-lg"></i>;
      default:
        return null;
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    if (!user || user.role !== UserRole.ADMIN) {
      alert("Unauthorized action");
      return;
    }
    setIsLoading(true);
    const response = await updateOrderStatus(orderId, newStatus, user.role);
    if (response.success) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setEditingOrder(null);
    } else {
      alert("Failed to update status: " + response.error);
    }
    setIsLoading(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!user || user.role !== UserRole.ADMIN) {
      alert("Unauthorized action");
      return;
    }

    setIsLoading(true);

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const response = await deleteOrder(orderId, user.role);

      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        setEditingOrder(null);
        alert("Order deleted successfully!");
      } else {
        alert("Failed to delete order: " + response.error);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <h1 className="text-3xl font-bold tracking-tight">
              Orders Management
            </h1>
            <p className="mt-2 text-sm text-secondary-foreground">
              View and manage all orders
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
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="px-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary-background"
            >
              <option value="all">All Orders</option>
              <option value={OrderStatus.PROCESSING}>Processing</option>
              <option value={OrderStatus.SHIPPED}>Shipped</option>
              <option value={OrderStatus.DELIVERED}>Delivered</option>
              <option value={OrderStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-lg border border-muted-foreground overflow-hidden"
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
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center justify-between md:justify-normal space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full flex items-center space-x-1.5 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
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
                        className={`transition-transform ${
                          selectedOrder === order.id
                            ? "transform rotate-180"
                            : ""
                        }`}
                      >
                        <i className="ri-arrow-down-s-line text-xl"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order.id && (
                <div className="p-6 bg-muted-background/30">
                  {editingOrder?.id === order.id ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-4">Order Status</h3>
                          <select
                            value={editingOrder.status}
                            onChange={(e) =>
                              setEditingOrder({
                                ...editingOrder,
                                status: e.target.value as OrderStatus,
                              })
                            }
                            className="w-full px-3 py-2 border border-muted-foreground rounded-md bg-primary-background"
                          >
                            <option value={OrderStatus.PROCESSING}>
                              Processing
                            </option>
                            <option value={OrderStatus.SHIPPED}>Shipped</option>
                            <option value={OrderStatus.DELIVERED}>
                              Delivered
                            </option>
                            <option value={OrderStatus.CANCELLED}>
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setEditingOrder(null)}
                          className="px-4
                          py-2 bg-red-500/70 hover:bg-red-500 transition-colors duration-150 text-white rounded-md flex items-center space-x-2 cursor-pointer"
                        >
                          <i className="ri-close-line text-xl"></i>
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, editingOrder.status)
                          }
                          className="px-4 py-2 bg-green-500/70 hover:bg-green-500 transition-colors duration-150 text-white rounded-md flex items-center space-x-2 cursor-pointer"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <i className="ri-loader-4-line text-lg animate-spin"></i>
                          ) : (
                            <i className="ri-save-3-line"></i>
                          )}
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Order Details</h3>
                      <div>
                        <strong>Customer</strong>
                        <p className="text-secondary-foreground text-sm">
                          {order.userId}
                        </p>
                      </div>
                      <div>
                        <strong>Address</strong>{" "}
                        <div className="text-secondary-foreground text-sm">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.mobile}</p>
                          <p>
                            {`${order.shippingAddress?.house}, ${order.shippingAddress?.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`}
                          </p>
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mt-4">Items</h4>
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
                              <p className="text-sm text-secondary-foreground">
                                Qty: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${item.quantity * item.price}
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
                              <span className="text-primary-foreground font-semibold text-xl">
                                Total
                              </span>
                              <span className="font-semibold text-xl">
                                ${order.totalPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      {user?.role === UserRole.ADMIN && (
                        <div className="mt-6 flex flex-wrap md:justify-normal justify-between gap-4">
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md hover:bg-primary/90"
                          >
                            Edit Order
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="px-4 py-2 border border-muted-foreground rounded-md hover:bg-secondary"
                          >
                            Delete Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                : "You haven't get any orders yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
