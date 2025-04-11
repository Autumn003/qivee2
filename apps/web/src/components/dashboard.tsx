"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn, getSession } from "next-auth/react";
import { User } from "next-auth";
import {
  updatePasswordSchema,
  updateUserAvatarSchema,
  updateUserNameSchema,
} from "schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { updateAvatar, updateName, updatePassword } from "actions/user.action";
import { Address, Order, OrderItem, OrderStatus } from "@prisma/client";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  updateAddress,
} from "actions/address.action";
import { addressSchema } from "schemas/address-schema";
import { getOrdersByUserId } from "actions/order.action";
import { getWishlist } from "actions/wishlist.action";
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

type UserNameFormValues = z.infer<typeof updateUserNameSchema>;
type AvatarFormValues = z.infer<typeof updateUserAvatarSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;
type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function Dashboard() {
  const { data: session, update } = useSession();
  const user = session?.user ?? ({} as User);

  const profileAddAddressButtonRef = useRef(null);
  const addressSectionRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<UserNameFormValues>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(updateUserAvatarSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  const passwordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderWithItems[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatePasswordModelOpen, setIsUpdatePasswordModelOpen] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "profile">(
    "overview"
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [shouldScrollToAddress, setShouldScrollToAddress] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditAvatar(false);
    form.reset({
      name: user.name || "",
    });
  };
  const handleClosePasswordModel = () => {
    setIsUpdatePasswordModelOpen(false);
    passwordForm.reset({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const onUpdateNameSubmit = async (data: UserNameFormValues) => {
    if (!user.id) {
      toast.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateName(user.id, data.name);

      if (response?.error) {
        toast.error(response.error.toString);
        return;
      }

      await update({
        ...session,
        user: { ...session?.user, name: response.updatedUser.name },
      });

      toast.success("Your name updated successfully");

      handleCloseModal();
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdatePasswordSubmit = async (data: UpdatePasswordFormValues) => {
    if (!user.id) {
      toast.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      const response = await updatePassword(data.oldPassword, data.newPassword);

      if (response?.error) {
        toast.error(response.error.message);
        return;
      }
      toast.success("Password updated successfully");
      handleClosePasswordModel();
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateAvatarSubmit = async (data: AvatarFormValues) => {
    if (!user.id) {
      toast.error("User ID is missing");
      return;
    }

    if (!selectedImage) {
      toast.error("Select an image to upload");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await updateAvatar(user?.id || "", selectedImage);

      if (response?.error) {
        toast.error(response.error.message);
        return;
      }

      setSelectedImage(null);
      setPreview(null);

      await update({
        user: { ...session?.user, avatar: response.updatedUser.avatar },
      });
      toast.success("Profile picture updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      avatarForm.setValue("avatar", file);
      avatarForm.trigger("avatar");
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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

  useEffect(() => {
    async function fetchAddresses() {
      const response = await getUserAddresses();
      if (response.success) {
        setAddresses(response.addresses);
      }
    }
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    async function fetchOrders() {
      const response = await getOrdersByUserId(user.id || "");
      if (response.success) {
        const formatedOrders = response.orders.map((order) => ({
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
        setRecentOrders(formatedOrders);
      }
    }
    async function fetchWishlist() {
      const response = await getWishlist();
      if (response.success) {
        setWishlistCount(response.wishlistItems.length);
      } else {
        console.error("Failed to fetch products:", response.error);
      }
    }

    fetchOrders();
    fetchWishlist();
  }, [user.id]);

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
    setSaveAddressLoading(true);

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
        toast.error("Failed to update address");
        return;
      }

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? response.address
            : { ...addr, isDefault: false }
        )
      );
      toast.success("Address updated successfully");
    } else {
      const response = await createAddress(formData);
      if (response.error) {
        console.error("Error while creating address: ", response.error);
        toast.error("Failed to add address");
        return;
      }
      setAddresses((prev) =>
        response.address.isDefault
          ? prev
              .map((addr) => ({ ...addr, isDefault: false }))
              .concat(response.address)
          : [...prev, response.address]
      );
      toast.success("Address added successfully");
    }

    setEditingAddress(null);
    addressForm.reset();
    setIsAddingAddress(false);
    setSaveAddressLoading(false);
  };

  const handleEditAddress = async (address: Address) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    setDeleteLoading(true);
    try {
      const response = await deleteAddress(id);
      if (response.error) {
        toast.error(response.error.message);
      }
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error while deleting address: ", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOverviewAddAddress = () => {
    // Change to profile tab
    setActiveTab("profile");

    // Wait for the DOM to update
    setTimeout(() => {
      // Trigger click on the profile add address button
      if (profileAddAddressButtonRef.current) {
        (profileAddAddressButtonRef.current as HTMLButtonElement).click();
      }
    }, 0);
  };
  useEffect(() => {
    if (
      activeTab === "profile" &&
      shouldScrollToAddress &&
      addressSectionRef.current
    ) {
      // Wait a bit to ensure DOM is updated
      setTimeout(() => {
        addressSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setShouldScrollToAddress(false);
      }, 100);
    }
  }, [activeTab, shouldScrollToAddress]);

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-4 py-2 text-destructive border-2 border-destructive rounded-lg font-medium hover:bg-destructive hover:text-white cursor-pointer">
                  Sign Out
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Click <strong>Continue</strong> to sign out of your account
                    on this device. You can always sign back in later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="px-4 py-2 text-sm text-secondary-foreground hover:text-primary-foreground cursor-pointer border border-secondary-foreground hover:border-primary-foreground rounded-md transition-all duration-150">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="px-4 py-2 bg-secondary-background text-primary-background rounded-md hover:bg-secondary-background/80 cursor-pointer transition-all duration-150"
                    onClick={() => signOut()}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                        {/* Image Preview */}
                        {preview ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 p-1 rounded-full mb-4 border border-secondary-foreground object-cover"
                          />
                        ) : user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-32 h-32 p-1 rounded-full mb-4 border border-secondary-foreground object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 p-1 rounded-full flex items-center justify-center overflow-hidden border border-secondary-foreground mb-4">
                            <i className="ri-user-3-line text-7xl text-secondary-foreground"></i>
                          </div>
                        )}
                        <label className="block text-sm font-medium mb-1">
                          User Avatar
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20 cursor-pointer"
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

        {isUpdatePasswordModelOpen && (
          <div className="fixed inset-0 bg-primary-background/90 backdrop-blur-sm z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4 ">
              <div className="bg-late-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-muted-foreground custom-scrollbar">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Update password</h2>
                    <button
                      onClick={handleClosePasswordModel}
                      className="p-2 hover:bg-secondary rounded-md text-secondary-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <form
                    onSubmit={passwordForm.handleSubmit(onUpdatePasswordSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Old Password
                      </label>
                      <input
                        {...passwordForm.register("oldPassword")}
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                      />
                      {passwordForm.formState.errors.oldPassword && (
                        <p className="mt-1 text-sm text-destructive">
                          {passwordForm.formState.errors.oldPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                          className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                        >
                          {showPassword ? (
                            <i className="ri-eye-off-line"></i>
                          ) : (
                            <i className="ri-eye-line"></i>
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-destructive">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        className="w-full px-3 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring focus:ring-primary-foreground/20"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-destructive">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

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
                className="bg-late-background p-6 rounded-lg border border-muted-foreground hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <i className="ri-box-1-line text-4xl"></i>
                  <i className="ri-arrow-right-s-line text-secondary-foreground text-xl"></i>
                </div>
                <p className="mt-4 text-2xl font-bold">{recentOrders.length}</p>
                <p className="text-sm text-secondary-foreground">
                  Total Orders
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="bg-late-background p-6 rounded-lg border border-muted-foreground hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <i className="ri-heart-line text-4xl"></i>
                  <i className="ri-arrow-right-s-line text-secondary-foreground text-xl"></i>
                </div>
                <p className="mt-4 text-2xl font-bold">{wishlistCount}</p>
                <p className="text-sm text-secondary-foreground">
                  Wishlist Items
                </p>
              </Link>

              <div className="bg-late-background p-6 rounded-lg border border-muted-foreground">
                <div className="flex items-center justify-between">
                  <i className="ri-map-pin-line text-4xl"></i>
                  <button
                    id="overviewAddAddressButton"
                    onClick={handleOverviewAddAddress}
                    className="cursor-pointer"
                  >
                    <i className="ri-add-line text-xl text-secondary-foreground"></i>
                  </button>
                </div>
                <p className="mt-4 text-2xl font-bold">{addresses.length}</p>
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
                {recentOrders.slice(0, 3).map((order) => (
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
                        {order.items.map((item, index) => (
                          <img
                            key={index}
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-md border-2 border-muted-background object-cover"
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-foreground">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${order.totalPrice.toFixed(2)}
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
                      You haven't placed any orders yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="rounded-lg border border-muted-foreground p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <button
                  onClick={() => setIsUpdatePasswordModelOpen(true)}
                  className="px-4 py-2 text-secondary-foreground border border-secondary-foreground rounded-lg hover:text-primary-foreground hover:border-primary-foreground transition-colors duration-150 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-end">
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
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                  >
                    <i className="ri-edit-box-line text-xl"></i>
                  </button>
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
            <div
              ref={addressSectionRef}
              className="rounded-lg border border-muted-foreground p-6 "
            >
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex items-center text-xl">
                  <i className="ri-map-pin-line mr-2"></i>
                  <h2 className="text-lg font-medium">Saved Address</h2>
                </div>
                <button
                  id="profileAddAddressButton"
                  ref={profileAddAddressButtonRef}
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
                      {saveAddressLoading ? (
                        <div className="flex gap-2 items-center justify-center">
                          <div className="animate-spin">
                            <i className="ri-loader-4-line "></i>
                          </div>
                          Save Address
                        </div>
                      ) : (
                        <>Save Address</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 overflow-auto h-[32rem] no-scrollbar">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg border border-secondary-foreground`}
                    >
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
                                {deleteLoading ? (
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
