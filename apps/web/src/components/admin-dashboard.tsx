// "use client";

// import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import Link from "next/link";
// import { Order, OrderItem, OrderStatus, productCategory } from "@prisma/client";
// import { getAllOrders } from "actions/order.action";
// import { getAllUsers } from "actions/user.action";

// interface ExtendedOrderItem extends OrderItem {
//   category: productCategory;
//   name: string;
//   image: string;
// }

// interface OrderWithItems extends Order {
//   items: ExtendedOrderItem[];
//   shippingAddress: {
//     name: string;
//     house: string;
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//     mobile: string;
//   };
// }

// export default function AdminDashboard() {
//   const [recentOrders, setRecentOrders] = useState<OrderWithItems[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [statsData, setStatsData] = useState({
//     totalRevenue: 0,
//     totalOrders: 0,
//     monthlyRevenue: [] as { name: string; sales: number }[],
//     categoryData: [] as { name: string; value: number }[],
//     previousPeriodRevenue: 0,
//     previousPeriodOrders: 0,
//     previousPeriodUsers: 0,
//     previousPeriodConversion: 0,
//   });

//   const getStatusColor = (status: OrderStatus) => {
//     switch (status) {
//       case OrderStatus.PROCESSING:
//         return "bg-amber-300/30 text-amber-500";
//       case OrderStatus.SHIPPED:
//         return "bg-sky-300/30 text-sky-500";
//       case OrderStatus.DELIVERED:
//         return "bg-emerald-300/30 text-emerald-500";
//       case OrderStatus.CANCELLED:
//         return "bg-red-300/30 text-red-500";
//       default:
//         return "bg-slate-300/30 text-slate-500";
//     }
//   };

//   const getStatusIcon = (status: OrderStatus) => {
//     switch (status) {
//       case OrderStatus.PROCESSING:
//         return <i className="ri-time-line text-lg"></i>;
//       case OrderStatus.SHIPPED:
//         return <i className="ri-truck-line text-lg"></i>;
//       case OrderStatus.DELIVERED:
//         return <i className="ri-checkbox-circle-line text-lg"></i>;
//       case OrderStatus.CANCELLED:
//         return <i className="ri-close-circle-line text-lg"></i>;
//       default:
//         return null;
//     }
//   };

//   useEffect(() => {
//     async function fetchOrders() {
//       const response = await getAllOrders();
//       if (response.success) {
//         const formatedOrders = response.orders.map((order) => ({
//           ...order,
//           shippingAddress: order.shippingAddress || {},
//           items: order.orderItems.map((orderItem) => ({
//             id: orderItem.id,
//             productId: orderItem.product.id,
//             orderId: orderItem.orderId,
//             name: orderItem.product.name,
//             price: orderItem.price,
//             quantity: orderItem.quantity,
//             image: orderItem.product.images[0] || "",
//             category: orderItem.product.category,
//           })),
//         }));
//         setRecentOrders(formatedOrders);

//         calculateStats(formatedOrders);
//       }
//     }

//     async function fetchUsers() {
//       const response = await getAllUsers();
//       if (response.success) {
//         setUsers(response.users);
//       }
//     }

//     fetchOrders();
//     fetchUsers();
//   }, []);

//   const calculateStats = (orders: OrderWithItems[]) => {
//     // Current date for period calculations
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );
//     const firstDayOfPreviousMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       1
//     );
//     const firstDayOfTwoMonthsAgo = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 2,
//       1
//     );

//     // Filter orders by period
//     const currentMonthOrders = orders.filter(
//       (order) => new Date(order.createdAt) >= firstDayOfMonth
//     );

//     const previousMonthOrders = orders.filter(
//       (order) =>
//         new Date(order.createdAt) >= firstDayOfPreviousMonth &&
//         new Date(order.createdAt) < firstDayOfMonth
//     );

//     const twoMonthsAgoOrders = orders.filter(
//       (order) =>
//         new Date(order.createdAt) >= firstDayOfTwoMonthsAgo &&
//         new Date(order.createdAt) < firstDayOfPreviousMonth
//     );

//     // Calculate current period metrics
//     const currentRevenue = currentMonthOrders.reduce(
//       (sum, order) => sum + order.totalPrice,
//       0
//     );
//     const currentOrdersCount = currentMonthOrders.length;

//     // Calculate previous period metrics
//     const previousRevenue = previousMonthOrders.reduce(
//       (sum, order) => sum + order.totalPrice,
//       0
//     );
//     const previousOrdersCount = previousMonthOrders.length;

//     // Calculate active users for current and previous periods
//     // In a real app, you would use actual user activity data
//     // For now, we'll count users who placed orders in each period
//     const uniqueCurrentUsers = new Set(
//       currentMonthOrders.map((order) => order.userId)
//     ).size;
//     const uniquePreviousUsers = new Set(
//       previousMonthOrders.map((order) => order.userId)
//     ).size;

//     // Calculate conversion rates
//     const totalActiveUsers = users.length;
//     const currentConversionRate =
//       totalActiveUsers > 0 ? (currentOrdersCount / totalActiveUsers) * 100 : 0;
//     const previousConversionRate =
//       totalActiveUsers > 0 ? (previousOrdersCount / totalActiveUsers) * 100 : 0;

//     // Calculate total revenue (all time)
//     const totalRevenue = orders.reduce(
//       (sum, order) => sum + order.totalPrice,
//       0
//     );

//     // Calculate total orders count (all time)
//     const totalOrders = orders.length;

//     // Calculate monthly revenue for the bar chart
//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];

//     // Create an array to hold monthly data for the past 12 months
//     const monthlySales = Array(12).fill(0);

//     // Get current month and year
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     // Fill the monthly sales data
//     orders.forEach((order) => {
//       const orderDate = new Date(order.createdAt);
//       const orderMonth = orderDate.getMonth();
//       const orderYear = orderDate.getFullYear();

//       // Only count orders from the past 12 months
//       if (orderYear === currentYear && orderMonth <= currentMonth) {
//         monthlySales[orderMonth] += order.totalPrice;
//       } else if (orderYear === currentYear - 1 && orderMonth > currentMonth) {
//         // For months from the previous year that fall within the 12-month window
//         monthlySales[orderMonth] += order.totalPrice;
//       }
//     });

//     // Rearrange the monthly data to start from the current month going back 12 months
//     const monthlyRevenue: { name: string; sales: number }[] = [];
//     for (let i = 0; i < 12; i++) {
//       const monthIndex = (currentMonth - i + 12) % 12; // Handle wraparound for previous year
//       monthlyRevenue.unshift({
//         //@ts-ignore
//         name: monthNames[monthIndex], // This is always a string from the monthNames array
//         sales: monthlySales[monthIndex] || 0, // Ensure we have a number (default to 0)
//       });
//     }

//     // Calculate category distribution for the pie chart
//     const categoryMap = new Map<string, number>();

//     orders.forEach((order) => {
//       order.items.forEach((item) => {
//         // Using the category from the product data
//         const category = item.category;
//         const currentValue = categoryMap.get(category) || 0;
//         categoryMap.set(category, currentValue + item.price * item.quantity);
//       });
//     });

//     const categoryData = Array.from(categoryMap.entries())
//       .map(([name, value]) => ({
//         name,
//         value,
//       }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 5); // Top 5 categories

//     setStatsData({
//       totalRevenue,
//       totalOrders,
//       monthlyRevenue,
//       categoryData,
//       previousPeriodRevenue: previousRevenue,
//       previousPeriodOrders: previousOrdersCount,
//       previousPeriodUsers: uniquePreviousUsers,
//       previousPeriodConversion: previousConversionRate,
//     });
//   };

//   // Properly calculate growth percentage between current and previous periods
//   const calculateGrowth = (current: number, previous: number) => {
//     if (previous === 0) {
//       return current > 0 ? "100%" : "0%";
//     }

//     const growthRate = ((current - previous) / previous) * 100;
//     return growthRate.toFixed(1) + "%";
//   };

//   // Determine if growth is positive or negative
//   const growthTrend = (growthString: string) => {
//     return parseFloat(growthString) >= 0 ? "up" : "down";
//   };

//   // Get stats for the stats cards
//   const getStats = () => {
//     // Calculate current month metrics
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );

//     const currentMonthOrders = recentOrders.filter(
//       (order) => new Date(order.createdAt) >= firstDayOfMonth
//     );

//     const currentRevenue = currentMonthOrders.reduce(
//       (sum, order) => sum + order.totalPrice,
//       0
//     );

//     const currentOrdersCount = currentMonthOrders.length;

//     // Get unique users who placed orders this month
//     const uniqueCurrentUserIds = new Set(
//       currentMonthOrders.map((order) => order.userId)
//     );
//     const activeUsers = uniqueCurrentUserIds.size;

//     // Calculate conversion rate for current month
//     const totalActiveUsers = users.length;
//     const currentConversionRate =
//       totalActiveUsers > 0
//         ? (uniqueCurrentUserIds.size / totalActiveUsers) * 100
//         : 0;

//     // Calculate growth rates
//     const revenueGrowth = calculateGrowth(
//       currentRevenue,
//       statsData.previousPeriodRevenue
//     );

//     const orderGrowth = calculateGrowth(
//       currentOrdersCount,
//       statsData.previousPeriodOrders
//     );

//     const userGrowth = calculateGrowth(
//       activeUsers,
//       statsData.previousPeriodUsers
//     );

//     const conversionGrowth = calculateGrowth(
//       currentConversionRate,
//       statsData.previousPeriodConversion
//     );

//     return [
//       {
//         title: "Total Revenue",
//         value: `₹${currentRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
//         change: revenueGrowth,
//         trend: growthTrend(revenueGrowth),
//         icon: "ri-money-rupee-circle-line",
//       },
//       {
//         title: "Total Orders",
//         value: currentOrdersCount.toString(),
//         change: orderGrowth,
//         trend: growthTrend(orderGrowth),
//         icon: "ri-shopping-bag-3-line",
//       },
//       {
//         title: "Active Users",
//         value: activeUsers.toString(),
//         change: userGrowth,
//         trend: growthTrend(userGrowth),
//         icon: "ri-group-line",
//       },
//       {
//         title: "Conversion Rate",
//         value: currentConversionRate.toFixed(1) + "%",
//         change: conversionGrowth,
//         trend: growthTrend(conversionGrowth),
//         icon: "ri-funds-line",
//       },
//     ];
//   };

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ];

//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//             <p className="mt-2 text-sm text-secondary-foreground">
//               A comprehensive overview of your store's performance
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link
//               href="/admin/orders"
//               className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md cursor-pointer"
//             >
//               Orders
//               <i className="ri-arrow-right-up-line ml-1"></i>
//             </Link>
//             <Link
//               href="/admin/products"
//               className="px-4 py-2 border border-muted-foreground rounded-md cursor-pointer"
//             >
//               Products
//               <i className="ri-arrow-right-up-line ml-1"></i>
//             </Link>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {getStats().map((stat, index) => (
//             <div
//               key={index}
//               className="rounded-lg border border-muted-foreground p-6 hover:border-secondary-foreground/50 transition-colors"
//             >
//               <div className="flex items-center justify-between">
//                 {/* <stat.icon className="h-8 w-8" /> */}
//                 <i className={`${stat.icon} text-4xl`}></i>
//                 <span
//                   className={`text-sm font-medium flex items-center ${
//                     stat.trend === "up" ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {stat.trend === "up" ? (
//                     <i className="ri-arrow-right-up-line text-xl mr-1"></i>
//                   ) : (
//                     <i className="ri-arrow-right-down-line text-xl mr-1"></i>
//                   )}
//                   {stat.change}
//                 </span>
//               </div>
//               <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
//               <p className="text-sm text-secondary-foreground">{stat.title}</p>
//             </div>
//           ))}
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
//           {/* Category Distribution */}
//           <div className="rounded-lg border border-muted-foreground p-6">
//             <h3 className="text-lg font-medium mb-8">Sales by Category</h3>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={
//                       statsData.categoryData.length > 0
//                         ? statsData.categoryData
//                         : [{ name: "No Data", value: 1 }]
//                     }
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {statsData.categoryData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value) =>
//                       `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
//                     }
//                     contentStyle={{
//                       backgroundColor: "lightgray",
//                       borderRadius: "0.5rem",
//                     }}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Sales Chart */}
//           <div className="rounded-lg border border-muted-foreground p-6">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-lg font-medium">Monthly Sales Overview</h3>
//             </div>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={statsData.monthlyRevenue}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     className="stroke-border"
//                   />
//                   <XAxis dataKey="name" className="text-xs" />
//                   <YAxis className="text-xs" />
//                   <Tooltip
//                     formatter={(value) =>
//                       `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
//                     }
//                     contentStyle={{
//                       backgroundColor: "lightgray",
//                       color: "black",
//                       borderRadius: "0.5rem",
//                     }}
//                   />
//                   <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
//                     {statsData.monthlyRevenue.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % 2 === 0 ? 0 : 1]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="mb-24">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold">Recent Orders</h2>
//             <Link
//               href="/orders"
//               className="text-sm text-secondary-foreground hover:text-primary-foreground duration-150 transition-colors flex items-center"
//             >
//               View All Orders
//               <i className="ri-arrow-right-up-line text-lg ml-1"></i>
//             </Link>
//           </div>

//           <div className="space-y-4">
//             {recentOrders.slice(0, 5).map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-card rounded-lg border border-muted-foreground p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="font-medium">{order.id}</h3>
//                     <p className="text-sm text-secondary-foreground">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div
//                     className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1.5 ${getStatusColor(order.status)}`}
//                   >
//                     {getStatusIcon(order.status)}
//                     <span className="capitalize">{order.status}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <div className="flex -space-x-2">
//                     {order.items.slice(0, 3).map((item, index) => (
//                       <img
//                         key={index}
//                         src={item.image}
//                         alt={item.name}
//                         className="h-12 w-12 rounded-md border-2 border-muted-background object-cover"
//                       />
//                     ))}
//                     {order.items.length > 3 && (
//                       <div className="h-12 w-12 rounded-md border-2 border-muted-background bg-muted-foreground flex items-center justify-center text-primary-foreground">
//                         +{order.items.length - 3}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-secondary-foreground">
//                       {order.items.map((item) => item.name).join(", ")}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">
//                       ₹{order.totalPrice.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {recentOrders.length === 0 && (
//               <div className="text-center py-12">
//                 <i className="ri-box-1-line text-6xl text-muted-foreground"></i>
//                 <h2 className="mt-4 text-lg font-medium text-foreground">
//                   No orders found
//                 </h2>
//                 <p className="mt-2 text-secondary-foreground">
//                   You haven't received any orders yet
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Link from "next/link";
import { Order, OrderItem, OrderStatus, productCategory } from "@prisma/client";
import { DashboardSkeleton } from "./dashboard-skeleton";

interface ExtendedOrderItem extends OrderItem {
  category: productCategory;
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

interface AdminDashboardProps {
  initialOrders: any[];
  initialUsers: any[];
}

export default function AdminDashboard({
  initialOrders,
  initialUsers,
}: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<OrderWithItems[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    monthlyRevenue: [] as { name: string; sales: number }[],
    categoryData: [] as { name: string; value: number }[],
    previousPeriodRevenue: 0,
    previousPeriodOrders: 0,
    previousPeriodUsers: 0,
    previousPeriodConversion: 0,
  });

  useEffect(() => {
    // Use the data passed from the server component
    if (initialOrders.length > 0) {
      const formattedOrders = initialOrders.map((order) => ({
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
          category: orderItem.product.category,
        })),
      }));

      setRecentOrders(formattedOrders);
      calculateStats(formattedOrders);
    }

    if (initialUsers.length > 0) {
      setUsers(initialUsers);
    }

    setIsLoading(false);
  }, [initialOrders, initialUsers]);

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

  const calculateStats = (orders: OrderWithItems[]) => {
    // Current date for period calculations
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const firstDayOfTwoMonthsAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 2,
      1
    );

    // Filter orders by period
    const currentMonthOrders = orders.filter(
      (order) => new Date(order.createdAt) >= firstDayOfMonth
    );

    const previousMonthOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= firstDayOfPreviousMonth &&
        new Date(order.createdAt) < firstDayOfMonth
    );

    const twoMonthsAgoOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= firstDayOfTwoMonthsAgo &&
        new Date(order.createdAt) < firstDayOfPreviousMonth
    );

    // Calculate current period metrics
    const currentRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const currentOrdersCount = currentMonthOrders.length;

    // Calculate previous period metrics
    const previousRevenue = previousMonthOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const previousOrdersCount = previousMonthOrders.length;

    // Calculate active users for current and previous periods
    const uniqueCurrentUsers = new Set(
      currentMonthOrders.map((order) => order.userId)
    ).size;
    const uniquePreviousUsers = new Set(
      previousMonthOrders.map((order) => order.userId)
    ).size;

    // Calculate conversion rates
    const totalActiveUsers = users.length;
    const currentConversionRate =
      totalActiveUsers > 0 ? (currentOrdersCount / totalActiveUsers) * 100 : 0;
    const previousConversionRate =
      totalActiveUsers > 0 ? (previousOrdersCount / totalActiveUsers) * 100 : 0;

    // Calculate total revenue (all time)
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Calculate total orders count (all time)
    const totalOrders = orders.length;

    // Calculate monthly revenue for the bar chart
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Create an array to hold monthly data for the past 12 months
    const monthlySales = Array(12).fill(0);

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Fill the monthly sales data
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      // Only count orders from the past 12 months
      if (orderYear === currentYear && orderMonth <= currentMonth) {
        monthlySales[orderMonth] += order.totalPrice;
      } else if (orderYear === currentYear - 1 && orderMonth > currentMonth) {
        // For months from the previous year that fall within the 12-month window
        monthlySales[orderMonth] += order.totalPrice;
      }
    });

    // Rearrange the monthly data to start from the current month going back 12 months
    const monthlyRevenue: { name: string; sales: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Handle wraparound for previous year
      monthlyRevenue.unshift({
        //@ts-ignore
        name: monthNames[monthIndex],
        sales: monthlySales[monthIndex] || 0, // Ensure we have a number (default to 0)
      });
    }

    // Calculate category distribution for the pie chart
    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Using the category from the product data
        const category = item.category;
        const currentValue = categoryMap.get(category) || 0;
        categoryMap.set(category, currentValue + item.price * item.quantity);
      });
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories

    setStatsData({
      totalRevenue,
      totalOrders,
      monthlyRevenue,
      categoryData,
      previousPeriodRevenue: previousRevenue,
      previousPeriodOrders: previousOrdersCount,
      previousPeriodUsers: uniquePreviousUsers,
      previousPeriodConversion: previousConversionRate,
    });
  };

  // Properly calculate growth percentage between current and previous periods
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) {
      return current > 0 ? "100%" : "0%";
    }

    const growthRate = ((current - previous) / previous) * 100;
    return growthRate.toFixed(1) + "%";
  };

  // Determine if growth is positive or negative
  const growthTrend = (growthString: string) => {
    return parseFloat(growthString) >= 0 ? "up" : "down";
  };

  // Get stats for the stats cards
  const getStats = () => {
    // Calculate current month metrics
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const currentMonthOrders = recentOrders.filter(
      (order) => new Date(order.createdAt) >= firstDayOfMonth
    );

    const currentRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const currentOrdersCount = currentMonthOrders.length;

    // Get unique users who placed orders this month
    const uniqueCurrentUserIds = new Set(
      currentMonthOrders.map((order) => order.userId)
    );
    const activeUsers = uniqueCurrentUserIds.size;

    // Calculate conversion rate for current month
    const totalActiveUsers = users.length;
    const currentConversionRate =
      totalActiveUsers > 0
        ? (uniqueCurrentUserIds.size / totalActiveUsers) * 100
        : 0;

    // Calculate growth rates
    const revenueGrowth = calculateGrowth(
      currentRevenue,
      statsData.previousPeriodRevenue
    );

    const orderGrowth = calculateGrowth(
      currentOrdersCount,
      statsData.previousPeriodOrders
    );

    const userGrowth = calculateGrowth(
      activeUsers,
      statsData.previousPeriodUsers
    );

    const conversionGrowth = calculateGrowth(
      currentConversionRate,
      statsData.previousPeriodConversion
    );

    return [
      {
        title: "Total Revenue",
        value: `₹${currentRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
        change: revenueGrowth,
        trend: growthTrend(revenueGrowth),
        icon: "ri-money-rupee-circle-line",
      },
      {
        title: "Total Orders",
        value: currentOrdersCount.toString(),
        change: orderGrowth,
        trend: growthTrend(orderGrowth),
        icon: "ri-shopping-bag-3-line",
      },
      {
        title: "Active Users",
        value: activeUsers.toString(),
        change: userGrowth,
        trend: growthTrend(userGrowth),
        icon: "ri-group-line",
      },
      {
        title: "Conversion Rate",
        value: currentConversionRate.toFixed(1) + "%",
        change: conversionGrowth,
        trend: growthTrend(conversionGrowth),
        icon: "ri-funds-line",
      },
    ];
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // If loading, show skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex md:flex-row flex-col gap-4 justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-secondary-foreground">
              A comprehensive overview of your store's performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md cursor-pointer"
            >
              Orders <i className="ri-arrow-right-up-line ml-1"></i>
            </Link>
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-muted-foreground rounded-md cursor-pointer"
            >
              Products <i className="ri-arrow-right-up-line ml-1"></i>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStats().map((stat, index) => (
            <div
              key={index}
              className="rounded-lg border border-muted-foreground p-6 hover:border-secondary-foreground/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <i className={`${stat.icon} text-4xl`}></i>
                <span
                  className={`text-sm font-medium flex items-center ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <i className="ri-arrow-right-up-line text-xl mr-1"></i>
                  ) : (
                    <i className="ri-arrow-right-down-line text-xl mr-1"></i>
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-secondary-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Category Distribution */}
          <div className="rounded-lg border border-muted-foreground p-6">
            <h3 className="text-lg font-medium mb-8">Sales by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      statsData.categoryData.length > 0
                        ? statsData.categoryData
                        : [{ name: "No Data", value: 1 }]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsData.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
                    }
                    contentStyle={{
                      backgroundColor: "lightgray",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="rounded-lg border border-muted-foreground p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-medium">Monthly Sales Overview</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.monthlyRevenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
                    }
                    contentStyle={{
                      backgroundColor: "lightgray",
                      color: "black",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {statsData.monthlyRevenue.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % 2 === 0 ? 0 : 1]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link
              href="/orders"
              className="text-sm text-secondary-foreground hover:text-primary-foreground duration-150 transition-colors flex items-center"
            >
              View All Orders
              <i className="ri-arrow-right-up-line text-lg ml-1"></i>
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-lg border border-muted-foreground p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{order.id}</h3>
                    <p className="text-sm text-secondary-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1.5 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md border-2 border-muted-background object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-12 w-12 rounded-md border-2 border-muted-background bg-muted-foreground flex items-center justify-center text-primary-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-foreground">
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {recentOrders.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-box-1-line text-6xl text-muted-foreground"></i>
                <h2 className="mt-4 text-lg font-medium text-foreground">
                  No orders found
                </h2>
                <p className="mt-2 text-secondary-foreground">
                  You haven't received any orders yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
