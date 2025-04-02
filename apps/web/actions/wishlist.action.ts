"use server";

import db from "@repo/db/client";
import { auth } from "../../web/lib/auth";

export async function addToWishlist(productId: string) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return { error: { message: "Unaouthorized request" } };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: { message: "Product not found" } };
  }

  const userId = session.user.id;

  const existingWishlistItem = await db.wishlistItem.findFirst({
    where: { userId, productId },
  });

  if (existingWishlistItem) {
    return { error: { message: "Product already in wishlist" } };
  }
  const wishlistItem = await db.wishlistItem.create({
    data: { userId, productId },
  });

  return { success: true, wishlistItem, message: "Product added to wishlist" };
}

export async function removeFromWishlist(productId: string) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: { message: "Product not found" } };
  }
  const userId = session.user.id;
  const existingWishlistItem = await db.wishlistItem.findFirst({
    where: { userId, productId },
  });
  if (!existingWishlistItem) {
    return { error: { message: "Product not in wishlist" } };
  }
  const wishlist = await db.wishlistItem.delete({
    where: { id: existingWishlistItem.id },
  });

  return { success: true, message: "Product removed from wishlist" };
}

export async function getWishlist() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const userId = session.user.id;
  const wishlistItems = await db.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const formatedWishlistItems = wishlistItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images?.[0] ?? "",
    stock: item.product.stock,
    createdAt: item.createdAt,
  }));

  return {
    success: true,
    wishlistItems: formatedWishlistItems,
    message: "Wishlist items retrieved successfully",
  };
}

export async function clearWishlist() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const userId = session.user.id;
  const wishlistItems = await db.wishlistItem.deleteMany({
    where: { userId },
  });
  return {
    success: true,
    message: "Wishlist cleared successfully",
  };
}
