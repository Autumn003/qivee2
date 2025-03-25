"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

interface UserProfile {
  avatar?: string;
  memberSince: string;
}

interface DashboardStats {
  totalOrders: number;
  wishlistItems: number;
  savedAddresses: number;
  paymentMethods: number;
}

interface RecentOrder {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  total: number;
  items: Array<{
    name: string;
    image: string;
  }>;
}

// Example data
const userProfile: UserProfile = {
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150",
  memberSince: "2024-01-15",
};

const dashboardStats: DashboardStats = {
  totalOrders: 12,
  wishlistItems: 5,
  savedAddresses: 2,
  paymentMethods: 3,
};

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-2024-001",
    date: "2024-03-20",
    status: "delivered",
    total: 329.97,
    items: [
      {
        name: "Nike Air Max 2024 Limited Edition",
        image:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150",
      },
      {
        name: "Nike Zoom Pegasus 40",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-18",
    status: "shipped",
    total: 199.99,
    items: [
      {
        name: "Nike Air Max 2024 Limited Edition",
        image:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150",
      },
    ],
  },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user ?? ({} as User);

  const [activeTab, setActiveTab] = useState<"overview" | "profile">(
    "overview"
  );

  const getStatusColor = (status: RecentOrder["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border border-secondary-foreground">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || ""}
                  className="h-15 w-15 rounded-full object-cover"
                />
              ) : (
                <i className="ri-user-3-line text-4xl text-secondary-foreground"></i>
              )}
            </div>

            <div className="ml-4">
              <h1 className="text-2xl font-bold text-foreground">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-around">
            <button className="px-4 py-2 mr-2 bg-primary-foreground border-2 border-primary-foreground hover:border-primary-foreground/80 text-primary-background rounded-lg hover:bg-primary-foreground/80 cursor-pointer transition-all duration-150">
              Edit Profile
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-destructive border-2 border-destructive rounded-lg font-medium hover:bg-destructive hover:text-white cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-muted-foreground mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 text-sm font-medium border-b-2 cursor-pointer transition-all duration-200 ${
                activeTab === "overview"
                  ? "border-primary-foreground text-primary-foreground"
                  : "border-transparent text-secondary-foreground hover:text-primary-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 text-sm font-medium border-b-2 cursor-pointer transition-all duration-200 ${
                activeTab === "profile"
                  ? "border-primary-foreground text-primary-foreground"
                  : "border-transparent text-secondary-foreground hover:text-primary-foreground"
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8 mb-20">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Link
                href="/orders"
                className="bg-card p-6 rounded-lg border border-muted-foreground hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <i className="ri-box-1-line text-4xl"></i>
                  <i className="ri-arrow-right-s-line text-secondary-foreground text-xl"></i>
                </div>
                <p className="mt-4 text-2xl font-bold">
                  {dashboardStats.totalOrders}
                </p>
                <p className="text-sm text-secondary-foreground">
                  Total Orders
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="bg-card p-6 rounded-lg border border-muted-foreground hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <i className="ri-heart-line text-4xl"></i>
                  <i className="ri-arrow-right-s-line text-secondary-foreground text-xl"></i>
                </div>
                <p className="mt-4 text-2xl font-bold">
                  {dashboardStats.wishlistItems}
                </p>
                <p className="text-sm text-secondary-foreground">
                  Wishlist Items
                </p>
              </Link>

              <div className="bg-card p-6 rounded-lg border border-muted-foreground">
                <div className="flex items-center justify-between">
                  <i className="ri-map-pin-line text-4xl"></i>
                  <i className="ri-add-line text-xl text-secondary-foreground"></i>
                </div>
                <p className="mt-4 text-2xl font-bold">
                  {dashboardStats.savedAddresses}
                </p>
                <p className="text-sm text-secondary-foreground">
                  Saved Addresses
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
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
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-card rounded-lg border border-muted-foreground p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{order.id}</h3>
                        <p className="text-sm text-secondary-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        <span className="text-sm capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {order.items.map((item, index) => (
                          <img
                            key={index}
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-md border-2 border-muted-background"
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-foreground">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-card rounded-lg border border-muted-foreground p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <button className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer">
                  <i className="ri-edit-box-line text-xl"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-secondary-foreground">
                    Full Name
                  </label>
                  <p className="mt-1 font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-foreground">
                    Email
                  </label>
                  <p className="mt-1 font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-card rounded-lg border border-muted-foreground p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Addresses</h2>
                <button className="text-secondary-foreground transition-colors duration-150 hover:text-primary-foreground flex items-center cursor-pointer">
                  <i className="ri-add-line text-xl mr-1"></i>
                  Add New Address
                </button>
              </div>
              {/* Address list would go here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
