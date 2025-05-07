"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OrderStatus, Order, OrderItem } from "@prisma/client";

import { getOrdersByUserId, cancelOrder } from "../../actions/order.action";
import { useSession } from "next-auth/react";
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

export default function Orders() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [orderToCancel, setOrderToCancel] = useState<OrderWithItems | null>(
    null
  );

  const cancelOrderHandler = async () => {
    if (!orderToCancel) return;
    if (!userId) {
      return alert("You must be logged in to cancel an order");
    }

    const orderId = orderToCancel.id;
    setIsLoading((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await cancelOrder(orderId, userId);
      if (response.success) {
        toast.success("Order cancelled successfully");
        setOrders((prevOrder) =>
          prevOrder.map((order) =>
            order.id === orderId
              ? { ...order, status: OrderStatus.CANCELLED }
              : order
          )
        );
      } else {
        toast.error(response.error || "Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    if (!userId) return;
    async function fetchOrders() {
      const response = await getOrdersByUserId(userId || "");
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
  }, [userId]);

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

  return (
    <div className="min-h-screen">
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
                className="w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-primary-foreground/20"
              />
              <i className="ri-search-line absolute left-3 top-2 text-lg text-secondary-foreground"></i>
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="px-4 py-2 border border-muted-foreground rounded-lg focus:outline-none focus:ring focus:ring-primary-foreground/20 bg-primary-background"
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
              className="bg-muted-background/30 rounded-lg border border-muted-foreground overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <i className="ri-box-1-line text-2xl"></i>
                    <div>
                      <h2 className="text-lg font-medium">
                        {order.items.length === 1
                          ? order.items[0]?.name
                          : `${order.items[0]?.name}, ${order.items[1]?.name} and more`}
                      </h2>
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
                      className={`px-3 py-1 text-sm rounded-full flex items-center space-x-1.5 ${getStatusColor(order.status)}`}
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
                  <div className="mb-6 space-y-4 p-4 rounded-lg border border-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Number</h3>
                        <p className="text-sm text-secondary-foreground mt-1">
                          {order.id}
                        </p>
                      </div>
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
                  </div>

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
                          {/* <p className="text-sm text-secondary-foreground mt-1">
                              {item.color} • Size {item.size}
                            </p> */}
                          <p className="text-sm text-secondary-foreground">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{item.quantity * item.price}
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
                            ₹{order.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap md:justify-normal justify-between gap-4">
                    <button className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md hover:bg-primary/90 cursor-pointer">
                      Contact Support
                    </button>
                    {order.status === OrderStatus.PROCESSING && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => setOrderToCancel(order)}
                            className="px-4 py-2 border border-muted-foreground rounded-md hover:bg-secondary cursor-pointer"
                          >
                            {isLoading[order.id] ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin text-center">
                                  <i className="ri-loader-4-line text-xl"></i>
                                </div>
                                Cancel Order
                              </div>
                            ) : (
                              <>Cancel Order</>
                            )}
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel order?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel order with Order
                              ID: <strong>{order.id}</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer border border-secondary-foreground hover:border-primary-foreground rounded-md transition-all duration-150"
                              onClick={() => setOrderToCancel(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 cursor-pointer transition-all duration-150"
                              onClick={cancelOrderHandler}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
