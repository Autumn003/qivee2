// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "lib/authOptions";
// import { getUserAddresses } from "actions/address.action";
// import { getOrdersByUserId } from "actions/order.action";
// import { getWishlist } from "actions/wishlist.action";
// import { Dashboard } from "@/components";

// export const metadata = {
//   title: "Your Dashboard | Qivee",
//   description:
//     "Manage your Qivee profile, track orders, update personal details, and view your activity all in one place.",
// };

// export default async function DashboardPage() {
//   // Get session server-side
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     redirect("/auth/signin");
//   }

//   // Fetch data in parallel
//   const [addressesResponse, ordersPromise, wishlistPromise] = await Promise.all(
//     [
//       getUserAddresses(),
//       getOrdersByUserId(session.user.id || ""),
//       getWishlist(),
//     ]
//   );

//   const addresses = addressesResponse.success
//     ? addressesResponse.addresses
//     : [];

//   // Format orders data
//   const orders = ordersPromise.success
//     ? ordersPromise.orders.map((order) => ({
//         ...order,
//         shippingAddress: order.shippingAddress || {},
//         items: order.orderItems.map((orderItem) => ({
//           id: orderItem.id,
//           productId: orderItem.product.id,
//           orderId: orderItem.orderId,
//           name: orderItem.product.name,
//           price: orderItem.price,
//           quantity: orderItem.quantity,
//           image: orderItem.product.images[0] || "",
//         })),
//       }))
//     : [];

//   const wishlistItems = wishlistPromise.success
//     ? wishlistPromise.wishlistItems
//     : [];

//   return (
//     <Dashboard
//       // userr={session.user}
//       addresses={addresses}
//       orders={orders}
//       wishlistCount={wishlistItems.length}
//     />
//   );
// }

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "lib/authOptions";
import { getUserAddresses } from "actions/address.action";
import { getOrdersByUserId } from "actions/order.action";
import { getWishlist } from "actions/wishlist.action";
import { Dashboard } from "@/components";
import { Order, OrderItem } from "@prisma/client";

export const metadata = {
  title: "Your Dashboard | Qivee",
  description:
    "Manage your Qivee profile, track orders, update personal details, and view your activity all in one place.",
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

export default async function DashboardPage() {
  // Get session server-side
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Fetch data in parallel
  const [addressesResponse, ordersPromise, wishlistPromise] = await Promise.all(
    [
      getUserAddresses(),
      getOrdersByUserId(session.user.id || ""),
      getWishlist(),
    ]
  );

  const addresses = addressesResponse.success
    ? addressesResponse.addresses
    : [];

  // Format orders data with proper typing
  const orders: OrderWithItems[] = ordersPromise.success
    ? ordersPromise.orders.map(
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
      )
    : [];

  const wishlistItems = wishlistPromise.success
    ? wishlistPromise.wishlistItems
    : [];

  return (
    <Dashboard
      addresses={addresses}
      orders={orders}
      wishlistCount={wishlistItems.length}
    />
  );
}
