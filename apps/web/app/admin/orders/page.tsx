export const dynamic = "force-dynamic";

import { AdminOrders } from "@/components";
import { Order, OrderItem } from "@prisma/client";
import { getAllOrders } from "actions/order.action";

export const metadata = {
  title: "Orders | Admin Panel | Qivee",
  description:
    "Manage and review all customer orders efficiently from the Qivee admin panel. Track order statuses, view details, and handle fulfillment with ease.",
};

interface ExtendedOrderItem extends OrderItem {
  name: string;
  image: string;
}

interface ShippingAddress {
  name: string;
  house: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobile: string;
}

interface OrderWithItems extends Omit<Order, "shippingAddress"> {
  items: ExtendedOrderItem[];
  shippingAddress: ShippingAddress;
}

// Helper function to safely parse shipping address
function parseShippingAddress(
  shippingAddress: any,
  order: Order
): ShippingAddress {
  // If shippingAddress is already a properly structured object
  if (
    shippingAddress &&
    typeof shippingAddress === "object" &&
    !Array.isArray(shippingAddress)
  ) {
    return {
      name: shippingAddress.name || order.shippingName || "",
      house: shippingAddress.house || order.shippingHouse || "",
      street: shippingAddress.street || order.shippingStreet || "",
      city: shippingAddress.city || order.shippingCity || "",
      state: shippingAddress.state || order.shippingState || "",
      zipCode: shippingAddress.zipCode || order.shippingZipCode || "",
      country: shippingAddress.country || order.shippingCountry || "",
      mobile: shippingAddress.mobile || order.shippingMobile || "",
    };
  }

  // Fallback to individual fields from Order model
  return {
    name: order.shippingName || "",
    house: order.shippingHouse || "",
    street: order.shippingStreet || "",
    city: order.shippingCity || "",
    state: order.shippingState || "",
    zipCode: order.shippingZipCode || "",
    country: order.shippingCountry || "",
    mobile: order.shippingMobile || "",
  };
}

export default async function Page() {
  // Fetch orders server-side
  let orders: OrderWithItems[] | null = null;

  try {
    const response = await getAllOrders();
    if (response.success) {
      orders = response.orders.map(
        (order): OrderWithItems => ({
          ...order,
          shippingAddress: parseShippingAddress(order.shippingAddress, order),
          items: order.orderItems.map(
            (orderItem): ExtendedOrderItem => ({
              id: orderItem.id,
              productId: orderItem.product.id,
              orderId: orderItem.orderId,
              name: orderItem.product.name,
              price: orderItem.price,
              quantity: orderItem.quantity,
              image: orderItem.product.images[0] || "",
            })
          ),
        })
      );
    }
  } catch (error) {
    console.error("Failed to fetch orders server-side", error);
  }

  return <AdminOrders initialOrders={orders} />;
}
