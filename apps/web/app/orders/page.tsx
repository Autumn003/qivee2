// import { Orders } from "@/components";

// const page = () => {
//   return <Orders />;
// };

// export default page;

import { Orders } from "@/components";
import { Order, OrderItem } from "@prisma/client";
import { getOrdersByUserId } from "actions/order.action";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "lib/authOptions";

export const metadata = {
  title: "My orders | Qivee",
  description:
    "View and track all your Qivee orders in one place. Stay updated on order status, delivery progress, and past purchases.",
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
  // Get session server-side
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Fetch products server-side
  let orders: OrderWithItems[] | null = null;

  try {
    const response = await getOrdersByUserId(session.user.id || "");
    if (response.success) {
      orders = response.orders.map((order: any) => ({
        ...order,
        shippingAddress: order.shippingAddress || {},
        items: order.orderItems.map((orderItem: any) => ({
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

  return <Orders initialOrders={orders} />;
}
