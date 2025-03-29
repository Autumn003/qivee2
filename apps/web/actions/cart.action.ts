"use server";

import db from "@repo/db/client";
import { auth } from "../../web/lib/auth";

export async function addToCart(productId: string, quantity: number) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return { error: { message: "Unaouthorized request" } };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < 1) {
    return { error: { message: "Product not found or out of stock" } };
  }

  const userId = session.user.id;

  const existingCartItem = await db.cartItem.findFirst({
    where: { userId, productId },
  });

  if (existingCartItem) {
    return { error: { message: "Product already in cart" } };
  }
  const cartItem = await db.cartItem.create({
    data: { userId, productId, quantity },
  });

  return { success: true, cartItem, message: "Product added to cart" };
}

export async function removeFromCart(productId: string) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: { message: "Product not found" } };
  }
  const userId = session.user.id;
  const existingCartItem = await db.cartItem.findFirst({
    where: { userId, productId },
  });
  if (!existingCartItem) {
    return { error: { message: "Product not in cart" } };
  }
  const cartItem = await db.cartItem.delete({
    where: { id: existingCartItem.id },
  });

  return { success: true, message: "Product removed from cart" };
}

export async function updateQuantity(productId: string, quantity: number) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    return { error: { message: "Product not found or out of stock" } };
  }
  const userId = session.user.id;
  const existingCartItem = await db.cartItem.findFirst({
    where: { userId, productId },
  });
  if (!existingCartItem) {
    return { error: { message: "Product not in cart" } };
  }
  const cartItem = await db.cartItem.update({
    where: { id: existingCartItem.id },
    data: { quantity },
  });

  return { success: true, cartItem, message: "Quantity updated" };
}

export async function getCart() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }
  const userId = session.user.id;
  const cartItems = await db.cartItem.findMany({
    where: { userId },
  });

  return {
    success: true,
    cartItems,
    message: "Cart items retrieved successfully",
  };
}
