"use server";

import db from "@repo/db/client";
import { OrderStatus, UserRole } from "@prisma/client";

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number }[]
) {
  if (!userId || items.length === 0) {
    return { error: "Invalid order data" };
  }

  const orderItems = await Promise.all(
    items.map(async ({ productId, quantity }) => {
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product || product.stock < quantity) {
        throw new Error(`Product ${productId} is out of stock or unavailable.`);
      }

      return {
        product: { connect: { id: productId } }, // Connect existing product
        quantity,
        price: product.price,
      };
    })
  );

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await db.order.create({
    data: {
      userId,
      totalPrice: totalPrice,
      status: OrderStatus.PROCESSING,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      orderItems: true,
    },
  });

  return { success: true, order };
}

export async function getAllOrders(userId: string) {
  if (!userId) {
    return { error: "user ID is required" };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "User not found" };
  }

  const orders = await db.order.findMany({
    where: {
      userId,
    },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    orders,
    message: "All orders retrieved successfully!",
  };
}

export async function getOrderById(orderId: string) {
  if (!orderId) {
    return { error: "order ID is required" };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  return { success: true, order, message: "Order retrieved successfully!" };
}

export async function cancelOrder(orderId: string, userId: string) {
  if (!orderId || !userId) {
    return { error: "order ID and user ID are required" };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  if (order.userId !== userId) {
    return { error: "You are not authorized to cancel this order" };
  }

  if (order.status !== OrderStatus.PROCESSING) {
    return { error: "Order cannot be canceled after it has been shipped" };
  }

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });

  return {
    success: true,
    order: updatedOrder,
    message: "Order canceled successfully",
  };
}

// ADMIN

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  userRole: UserRole
) {
  if (!orderId || !status) {
    return { error: "Invalid inputs" };
  }

  if (userRole !== UserRole.ADMIN) {
    return {
      error: "Unauthorize request, Only admins can update order status",
    };
  }

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  return {
    success: true,
    order: updatedOrder,
    message: "Order status updated successfully",
  };
}

export async function deleteOrder(orderId: string, userRole: UserRole) {
  if (!orderId) {
    return { error: "Order ID is required" };
  }
  if (userRole !== UserRole.ADMIN) {
    return {
      error: "Unauthorize request, Only admins can delete orders",
    };
  }

  await db.order.delete({
    where: { id: orderId },
  });

  return { success: true, message: "Order deleted successfully" };
}
