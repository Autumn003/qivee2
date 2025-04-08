// app/api/phonepe/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
import { PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const transactionId = searchParams.get("id");
  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code") || ""; // PhonePe status code

  console.log(
    "Payment status callback received for transaction:",
    transactionId
  );
  console.log("Order ID:", orderId);
  console.log("Status code:", code);

  // Check if we have a valid transaction ID
  if (!transactionId || !orderId) {
    console.error("Missing transaction ID or order ID");
    return NextResponse.redirect(
      new URL(`/order-failure?reason=missing_parameters`, req.url)
    );
  }

  try {
    // Find the transaction in the database
    const transaction = await db.transaction.findUnique({
      where: { phonePeTxnId: transactionId },
    });

    if (!transaction) {
      console.error("Transaction not found:", transactionId);
      return NextResponse.redirect(
        new URL(
          `/order-failure?orderId=${orderId}&reason=transaction_not_found`,
          req.url
        )
      );
    }

    // Check the payment status
    let redirectUrl: string;

    // If code is provided by PhonePe, use it to determine status
    if (code === "PAYMENT_SUCCESS") {
      // Update transaction status if it's still pending
      if (transaction.status === PaymentStatus.PENDING) {
        await db.transaction.update({
          where: { id: transaction.id },
          data: { status: PaymentStatus.SUCCESS },
        });

        await db.order.update({
          where: { id: transaction.orderId },
          data: { paymentStatus: PaymentStatus.SUCCESS },
        });
      }

      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`;
    } else if (code === "PAYMENT_ERROR" || code === "PAYMENT_FAILED") {
      // Update transaction status if needed
      if (transaction.status === PaymentStatus.PENDING) {
        await db.transaction.update({
          where: { id: transaction.id },
          data: { status: PaymentStatus.FAILED },
        });

        await db.order.update({
          where: { id: transaction.orderId },
          data: { paymentStatus: PaymentStatus.FAILED },
        });
      }

      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-failure?orderId=${orderId}`;
    } else {
      // Check the current status in our database
      if (transaction.status === PaymentStatus.SUCCESS) {
        redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`;
      } else if (transaction.status === PaymentStatus.FAILED) {
        redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-failure?orderId=${orderId}`;
      } else {
        // Still pending, redirect to a pending page
        redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-pending?orderId=${orderId}`;
      }
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (error) {
    console.error("Error processing payment status:", error);
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-failure?orderId=${orderId}&reason=processing_error`,
        req.url
      )
    );
  }
}
