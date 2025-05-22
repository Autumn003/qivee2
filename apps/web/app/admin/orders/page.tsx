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

export default async function Page() {
  // Fetch products server-side
  let orders: OrderWithItems[] | null = null;

  try {
    const response = await getAllOrders();
    if (response.success) {
      orders = response.orders.map((order) => ({
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
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return <AdminOrders initialOrders={orders} />;
}
