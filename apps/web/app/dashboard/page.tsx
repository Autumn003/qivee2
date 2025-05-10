import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "lib/authOptions";
import { getUserAddresses } from "actions/address.action";
import { getOrdersByUserId } from "actions/order.action";
import { getWishlist } from "actions/wishlist.action";
import { Dashboard } from "@/components";

export const metadata = {
  title: "Your Dashboard | Qivee",
  description:
    "Manage your Qivee profile, track orders, update personal details, and view your activity all in one place.",
};

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

  // Format orders data
  const orders = ordersPromise.success
    ? ordersPromise.orders.map((order) => ({
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
      }))
    : [];

  const wishlistItems = wishlistPromise.success
    ? wishlistPromise.wishlistItems
    : [];

  return (
    <Dashboard
      // userr={session.user}
      addresses={addresses}
      orders={orders}
      wishlistCount={wishlistItems.length}
    />
  );
}
