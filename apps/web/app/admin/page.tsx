export const dynamic = "force-dynamic";

import { AdminDashboard } from "@/components";
import { getAllOrders } from "actions/order.action";
import { getAllUsers } from "actions/user.action";

export const metadata = {
  title: "Admin Dashboard | Qivee",
  description:
    "Access powerful tools to manage products, orders, users, and gain insights into Qivee’s platform performance.",
};

// Server component that fetches data
export default async function Page() {
  // Fetch data on the server side
  const [ordersResponse, usersResponse] = await Promise.all([
    getAllOrders(),
    getAllUsers(),
  ]);

  const orders = ordersResponse.success ? ordersResponse.orders : [];
  const users = usersResponse.success ? usersResponse.users : [];

  return <AdminDashboard initialOrders={orders} initialUsers={users} />;
}
