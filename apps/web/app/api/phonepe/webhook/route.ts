import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@repo/db/client";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { updateOrderTransactionStatus } from "actions/order.action";

export async function POST(req: NextRequest) {
  console.log("📩 PhonePe Webhook Triggered");

  try {
    const rawBody = await req.text();
    console.log("Raw webhook data:", rawBody);

    const webhookData = JSON.parse(rawBody);

    if (!webhookData.response) {
      console.error("Missing 'response' field in webhook data");
      return NextResponse.json(
        { status: "error", message: "Invalid payload format" },
        { status: 400 }
      );
    }

    // Decode the base64 response
    try {
      const decodedResponse = JSON.parse(
        Buffer.from(webhookData.response, "base64").toString("utf8")
      );
      console.log("Decoded response:", decodedResponse);

      // Extract transaction details
      const code = decodedResponse.code;
      const merchantTxnId = decodedResponse.data?.merchantTransactionId;
      const transactionId = decodedResponse.data?.transactionId;

      if (!merchantTxnId) {
        console.warn("❓ Missing transaction ID in webhook data");
        return NextResponse.json(
          { status: "error", message: "Missing transaction ID" },
          { status: 400 }
        );
      }

      // Map PhonePe status to your PaymentStatus
      let paymentStatus: PaymentStatus;

      if (code === "PAYMENT_SUCCESS") {
        paymentStatus = PaymentStatus.SUCCESS;
        console.log("✅ Payment Success for:", merchantTxnId);
      } else if (code === "PAYMENT_ERROR" || code === "PAYMENT_FAILED") {
        paymentStatus = PaymentStatus.FAILED;
        console.log("❌ Payment Failed for:", merchantTxnId);
      } else {
        paymentStatus = PaymentStatus.PENDING;
        console.log("⏳ Payment Pending for:", merchantTxnId);
      }

      // Update transaction and order status
      const result = await updateOrderTransactionStatus(
        merchantTxnId,
        paymentStatus,
        JSON.stringify(decodedResponse)
      );

      if (!result.success) {
        console.error("Failed to update transaction:", result.error);
        return NextResponse.json(
          { status: "error", message: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ status: "ok" });
    } catch (decodeError) {
      console.error("Failed to decode base64 response:", decodeError);
      return NextResponse.json(
        { status: "error", message: "Failed to decode response" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
