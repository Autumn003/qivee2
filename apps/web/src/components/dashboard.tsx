"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn, getSession } from "next-auth/react";
import { User } from "next-auth";
import {
  updateUserAvatarSchema,
  updateUserNameSchema,
} from "schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { useForm } from "react-hook-form";
import { updateAvatar, updateName } from "actions/user.action";
import { Address } from "@prisma/client";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  updateAddress,
} from "actions/address.action";
import { addressSchema } from "schemas/address-schema";

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

type UserNameFormValues = z.infer<typeof updateUserNameSchema>;
type AvatarFormValues = z.infer<typeof updateUserAvatarSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;

export default function Dashboard() {
  const { data: session, update } = useSession();
  const user = session?.user ?? ({} as User);

  const form = useForm<UserNameFormValues>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(updateUserAvatarSchema),
    defaultValues: {
      avatar: user.avatar || "",
    },
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "profile">(
    "overview"
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditAvatar(false);
    form.reset({
      name: user.name || "",
    });
  };

  const onUpdateNameSubmit = async (data: UserNameFormValues) => {
    if (!user.id) {
      console.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateName(user.id, data.name);

      if (response?.error) {
        console.error("Validation Error:", response.error);
        return;
      }

      await update({
        ...session,
        user: { ...session?.user, name: response.updatedUser.name },
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateAvatarSubmit = async (data: AvatarFormValues) => {
    if (!user.id) {
      console.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateAvatar(user.id, data.avatar);

      if (response?.error) {
        console.error("Validation Error:", response.error);
        return;
      }

      await update({
        user: { ...session?.user, avatar: response.updatedUser.avatar },
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    async function fetchAddresses() {
      const response = await getUserAddresses();
      if (response.success) {
        setAddresses(response.addresses);
      }
    }
    fetchAddresses();
  }, []);

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      house: "",
      street: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
      mobile: "",
      isDefault: false,
    },
  });

  const handleSubmitAddress = async (data: AddressFormValues) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("house", data.house);
    formData.append("street", data.street);
    formData.append("city", data.city);
    formData.append("zipCode", data.zipCode);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("mobile", data.mobile);
    formData.append("isDefault", data.isDefault ? "true" : "false");
    formData.append("userId", session?.user.id || "");

    if (editingAddress) {
      const response = await updateAddress(editingAddress.id, formData);

      if (response.error) {
        console.error("Error while updating address: ", response.error);
        return;
      }

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? response.address
            : { ...addr, isDefault: false }
        )
      );
    } else {
      const response = await createAddress(formData);
      if (response.error) {
        console.error("Error while creating address: ", response.error);
        return;
      }
      setAddresses((prev) =>
        response.address.isDefault
          ? prev
              .map((addr) => ({ ...addr, isDefault: false }))
              .concat(response.address)
          : [...prev, response.address]
      );
    }

    setEditingAddress(null);
    addressForm.reset();
    setIsAddingAddress(false);
    setIsLoading(false);
  };

  const handleEditAddress = async (address: Address) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    const response = await deleteAddress(id);
    if (response.success) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-secondary-foreground overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || ""}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              ) : (
                <i className="ri-user-3-line text-4xl text-secondary-foreground"></i>
              )}
              <button
                className="absolute bottom-0 bg-primary-background/50 cursor-pointer w-full"
                onClick={() => {
                  setEditAvatar(true), setIsModalOpen(true);
                }}
              >
                <i className="ri-edit-fill"></i>
              </button>
            </div>

            <div className="ml-4">
              <h1 className="text-2xl font-bold text-foreground">
                {user.name
                  ?.toString()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-around">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 mr-2 bg-primary-foreground border-2 border-primary-foreground hover:border-primary-foreground/80 text-primary-background rounded-lg hover:bg-primary-foreground/80 cursor-pointer transition-all duration-150"
            >
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-primary-background/90 backdrop-blur-sm z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4 ">
              <div className="bg-late-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-muted-foreground custom-scrollbar">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {editAvatar ? "Update avatar" : "Update user name"}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-secondary rounded-md text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <form
                    onSubmit={
                      editAvatar
                        ? avatarForm.handleSubmit(onUpdateAvatarSubmit)
                        : form.handleSubmit(onUpdateNameSubmit)
                    }
                    className="space-y-6"
                  >
                    {!editAvatar ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          User Name
                        </label>
                        <input
                          {...form.register("name")}
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                        />
                        {form.formState.errors.name && (
                          <p className="mt-1 text-sm text-destructive">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          User Avatar
                        </label>
                        <input
                          {...avatarForm.register("avatar")}
                          type="text"
                          placeholder="Enter avatar URL"
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                        />
                        {avatarForm.formState.errors.avatar && (
                          <p className="mt-1 text-sm text-destructive">
                            {avatarForm.formState.errors.avatar.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary-foreground text-primary-background rounded-md hover:bg-primary-foreground/80 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                      >
                        {isLoading && (
                          <div className="animate-spin">
                            <i className="ri-loader-4-line text-lg"></i>
                          </div>
                        )}
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                >
                  <i className="ri-edit-box-line text-xl"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-secondary-foreground">
                    Full Name
                  </label>
                  <p className="mt-1 font-medium">
                    {user.name
                      ?.toString()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
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
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex items-center text-xl">
                  <i className="ri-map-pin-line mr-2"></i>
                  <h2 className="text-lg font-medium">Saved Address</h2>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    addressForm.reset({
                      name: "",
                      house: "",
                      street: "",
                      city: "",
                      zipCode: "",
                      state: "",
                      country: "",
                      mobile: "",
                      isDefault: false,
                    });
                    setIsAddingAddress(true);
                  }}
                  className="inline-flex items-center text-sm text-primary-background bg-primary-foreground hover:bg-primary-foreground/80 cursor-pointer px-2 py-1 rounded-md transition-colors duration-150"
                >
                  <i className="ri-add-line mr-1 text-lg"></i>
                  Add New Address
                </button>
              </div>

              {isAddingAddress ? (
                <form
                  onSubmit={addressForm.handleSubmit(handleSubmitAddress)}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        {...addressForm.register("name")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        House / Flat
                      </label>
                      <input
                        {...addressForm.register("house")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Street Address
                      </label>
                      <input
                        {...addressForm.register("street")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        {...addressForm.register("city")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        {...addressForm.register("state")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP Code
                      </label>
                      <input
                        {...addressForm.register("zipCode")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <input
                        {...addressForm.register("country")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mobile
                      </label>
                      <input
                        {...addressForm.register("mobile")}
                        type="text"
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex gap-5">
                        <span className="text-sm font-medium">
                          Set as default address
                        </span>
                        <input
                          {...addressForm.register("isDefault")}
                          type="checkbox"
                          className="w-5 h-5 rounded-md self-center"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer border border-secondary-foreground hover:border-primary-foreground rounded-md transition-all duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 cursor-pointer transition-all duration-150"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className={`p-4 rounded-lg border`}>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{address.name}</p>
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-muted-background text-primary-foreground text-xs rounded-md">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-secondary-foreground mt-1">
                          {address.house}
                        </p>
                        <p className="text-sm text-secondary-foreground mt-1">
                          {address.street}
                        </p>
                        <p className="text-sm text-secondary-foreground">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-secondary-foreground">
                          {address.country}
                        </p>
                        <p className="text-sm mt-1">{address.mobile}</p>
                        <div className="flex items-center justify-end space-x-2">
                          {deleteConfirmId === address.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleDeleteAddress(address.id || "")
                                }
                                className="p-2 hover:bg-destructive/10 rounded-md cursor-pointer text-destructive"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="animate-spin">
                                    <i className="ri-loader-4-line text-xl"></i>
                                  </div>
                                ) : (
                                  <i className="ri-check-line text-2xl"></i>
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-2 text-secondary-foreground hover:text-primary-foreground transition-colors duration-150"
                              >
                                <i className="ri-close-line text-2xl"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 rounded-md text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-all duration-150"
                              >
                                <i className="ri-edit-box-line text-xl"></i>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirmId(address.id || "")
                                }
                                className="p-2 text-secondary-foreground hover:text-destructive cursor-pointer transition-colors duration-150"
                              >
                                <i className="ri-delete-bin-6-line text-xl"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
