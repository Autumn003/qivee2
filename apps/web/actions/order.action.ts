"use server";

import db from "@repo/db/client";
import { OrderStatus, UserRole, PaymentMethod } from "@prisma/client";
import { sendEmail } from "lib/mail";

const getOrderStatusMessage = (
  userName: string,
  orderId: string,
  status: string
) => {
  let statusMessage = "";

  switch (status) {
    case OrderStatus.SHIPPED:
      statusMessage = `🚀 Your order has been **shipped** and is on its way!`;
      break;
    case OrderStatus.DELIVERED:
      statusMessage = `🎉 Your order has been **delivered** successfully!`;
      break;
    case OrderStatus.CANCELLED:
      statusMessage = `❌ Your order has been **cancelled**. If this was a mistake, please contact our support team.`;
      break;
    default:
      statusMessage = `ℹ️ Your order status has been updated to: ${status}.`;
  }

  return `Hello ${userName},  

  ${statusMessage}  

  🛍️Order Details:  
  Order ID: ${orderId}  
  Current Status: ${status}  



  If you have any questions, feel free to reach out to our support team.  

  Best Regards,  
  The Qivee Team  
  support@qivee.com | www.qivee.com  
  `;
};

export async function createOrder(
  userId: string,
  addressId: string,
  paymentMethod: PaymentMethod,
  items: { productId: string; quantity: number }[]
) {
  if (!userId || !addressId || items.length === 0) {
    return { error: "Invalid order data" };
  }

  return await db.$transaction(async (tx) => {
    // Fetch the address snapshot
    const address = await tx.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error("Invalid shipping address");
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Validate products and calculate total price
    const orderItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product || product.stock < quantity) {
          throw new Error(
            `Product ${productId} is out of stock or unavailable.`
          );
        }

        // Decrease stock
        await tx.product.update({
          where: { id: productId },
          data: { stock: product.stock - quantity },
        });

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

    // Create the order with address snapshot
    const order = await tx.order.create({
      data: {
        userId,
        totalPrice,
        status: OrderStatus.PROCESSING,
        shippingAddressId: addressId,
        paymentMethod,

        // Store snapshot of address details
        shippingName: address.name,
        shippingHouse: address.house,
        shippingStreet: address.street,
        shippingCity: address.city,
        shippingZipCode: address.zipCode,
        shippingState: address.state,
        shippingCountry: address.country,
        shippingMobile: address.mobile,

        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    const formattedShippingAddress = `${address.name} \n${address.house}, ${address.street}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`;

    const message = `Hello ${user.name},  

    YOUR ORDER HAS BEEN PLACED SUCCESSFULLY!

    Thank you for shopping with Qivee! Your order is confirmed, and we're preparing it for shipment.  

    Order Details:  
    Order ID: ${order.id}  
    Total Amount: ${totalPrice}  
    Payment Method: ${paymentMethod}  
    Shipping To: ${formattedShippingAddress}
    Contact: ${address.mobile}  

    What Happens Next?  
    - We will notify you once your order is shipped.  
    - You can track your order status anytime in your account.  

    Track your order here: www.qivee.com/orders 

    If you have any questions, feel free to reach out to our support team.  

    Happy shopping! 🛒  
    Best Regards,  
    The Qivee Team  
    support@qivee.com | www.qivee.com  
  `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Order Confirmation",
        message,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return { success: true, order, message: "Order placed successfully" };
  });
}

export async function getOrdersByUserId(userId: string) {
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
    include: {
      orderItems: { include: { product: true } },
      shippingAddress: true,
    },
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
    include: { user: true },
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

  const emailMessage = getOrderStatusMessage(
    order.user.name,
    order.id,
    OrderStatus.CANCELLED
  );
  try {
    await sendEmail({
      email: order.user.email,
      subject: "Order Status Update",
      message: emailMessage,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }

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

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
  if (!order) {
    return { error: { message: "Order not found" } };
  }

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  const emailMessage = getOrderStatusMessage(order.user.name, order.id, status);
  try {
    await sendEmail({
      email: order.user.email,
      subject: "Order Status Update",
      message: emailMessage,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }

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

export async function getAllOrders() {
  const orders = await db.order.findMany({
    include: {
      orderItems: { include: { product: true } },
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    orders,
    message: "All orders retrieved successfully!",
  };
}
