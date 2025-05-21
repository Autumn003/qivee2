"use server";

import db from "@repo/db/client";
import {
  OrderStatus,
  UserRole,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
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
  items: { productId: string; quantity: number }[],
  shipping: number,
  tax: number
) {
  if (!userId || !addressId || items.length === 0) {
    return { error: "Invalid order data" };
  }

  try {
    // Fetch the address
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return { error: "Invalid shipping address" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Validate products and calculate total price
    let totalPrice = 0;
    let subToatal = 0;
    const orderItems = [];

    for (const { productId, quantity } of items) {
      const product = await db.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.stock < quantity) {
        return {
          error: `Product ${productId} is out of stock or unavailable.`,
        };
      }

      subToatal += product.price * quantity;
      totalPrice = subToatal + shipping + tax;
      orderItems.push({
        product: { connect: { id: productId } },
        quantity,
        price: product.price,
      });
    }

    // Create the order with address snapshot
    const order = await db.order.create({
      data: {
        userId,
        totalPrice,
        shippingCost: shipping,
        tax,
        status: "PROCESSING",
        shippingAddressId: addressId,
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,

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

    return { success: true, order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
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

export async function updateOrderTransactionStatus(
  phonePeTxnId: string,
  paymentStatus: PaymentStatus,
  phonePeResponseJson: string
) {
  if (!phonePeTxnId || !paymentStatus) {
    return { error: "Invalid inputs" };
  }

  // Find the transaction using PhonePe Transaction ID
  const transaction = await db.transaction.findUnique({
    where: { phonePeTxnId },
    include: { order: { include: { user: true } } },
  });

  if (!transaction) {
    return { error: "Transaction not found" };
  }

  // Update transaction status
  const updatedTransaction = await db.transaction.update({
    where: { phonePeTxnId },
    data: {
      status: paymentStatus,
      phonePeResponseJson, // Store raw response for reference
    },
  });

  // Update the related order status based on payment status
  let updatedOrder;
  if (paymentStatus === PaymentStatus.SUCCESS) {
    updatedOrder = await db.order.update({
      where: { id: transaction.orderId },
      data: {
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.SUCCESS,
      },
    });
  } else if (paymentStatus === PaymentStatus.FAILED) {
    updatedOrder = await db.order.update({
      where: { id: transaction.orderId },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.FAILED,
      },
    });
  }

  // Send email notification to the user
  const user = transaction.order.user;
  const emailMessage = `Dear ${user.name}, your payment for order #${transaction.orderId} is ${paymentStatus}.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Payment Status Update",
      message: emailMessage,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  return {
    success: true,
    transaction: updatedTransaction,
    order: updatedOrder,
    message: "Transaction status updated successfully",
  };
}
