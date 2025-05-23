import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { createOrder } from "actions/order.action";

export async function POST(req: Request) {
  // Constants
  const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
  const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
  const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;

  // Check if environment variables are defined
  if (!PHONEPE_SALT_KEY || !PHONEPE_MERCHANT_ID || !PHONEPE_SALT_INDEX) {
    console.error(
      "Missing required environment variables for PhonePe integration"
    );
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  // PhonePe API URL - use sandbox URL for testing
  const API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

  try {
    let reqData = await req.json(); // Parse the request data
    console.log("Received payment request:", reqData);

    // Extract transaction details
    const { userId, addressId, amount, name, mobile, items, shipping, tax } =
      reqData;

    // Validate required fields
    if (
      !userId ||
      !addressId ||
      !amount ||
      !mobile ||
      !items ||
      shipping === undefined ||
      tax === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required payment details" },
        { status: 400 }
      );
    }

    // First, create the order in the database
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("addressId", addressId);
    formData.append("paymentMethod", PaymentMethod.PHONEPE);

    // Add items to formData
    items.forEach((item: any, index: any) => {
      formData.append(`items[${index}][productId]`, item.productId);
      formData.append(`items[${index}][quantity]`, item.quantity.toString());
    });

    // Create the order with PENDING status
    const orderResponse = await createOrder(
      userId,
      addressId,
      PaymentMethod.PHONEPE,
      items,
      shipping,
      tax
    );

    if (!orderResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: orderResponse.error || "Failed to create order",
        },
        { status: 400 }
      );
    }

    const order = orderResponse.order;
    const merchantTransactionId = `TXN_${Date.now()}_${order.id.substring(0, 8)}`;

    // Create a transaction record in the database
    const transaction = await db.transaction.create({
      data: {
        orderId: order.id,
        phonePeTxnId: merchantTransactionId,
        amount: order.totalPrice,
        status: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.PHONEPE,
      },
    });

    // Convert amount to paise (ensure it's an integer)
    const amountInPaise = Math.round(order.totalPrice * 100);

    // Prepare the payload for PhonePe
    const data = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `MUID_${userId.substring(0, 8)}`,
      amount: amountInPaise,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/status?id=${merchantTransactionId}&orderId=${order.id}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/webhook`,
      mobileNumber: mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    console.log("PhonePe payload:", data);

    // Encode payload as Base64
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate checksum
    const keyIndex = PHONEPE_SALT_INDEX;
    const string = payloadMain + "/pg/v1/pay" + PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    console.log("Generated checksum:", checksum);

    // API call options
    const options = {
      method: "POST",
      url: API_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    // Make the API call
    console.log("Sending request to PhonePe...");
    const response = await axios(options);
    console.log("PhonePe API Response:", response.data);

    // Process the response
    if (response.data && response.data.success) {
      // Extract the payment URL
      const redirectUrl =
        response.data.data.instrumentResponse.redirectInfo.url;

      return NextResponse.json({
        success: true,
        redirectUrl: redirectUrl,
        orderId: order.id,
        transactionId: merchantTransactionId,
      });
    } else {
      console.error("PhonePe returned unsuccessful response:", response.data);

      // Update transaction and order status to FAILED
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.FAILED,
          phonePeResponseJson: JSON.stringify(response.data),
        },
      });

      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      return NextResponse.json(
        {
          success: false,
          error: response.data.message || "Payment initiation failed",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in PhonePe payment initiation:");
    console.error(error.response?.data || error.message || error);

    // Return a more detailed error response
    return NextResponse.json(
      {
        success: false,
        error: "Payment initiation failed",
        details: error.response?.data || error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
