// app/order-failure/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderFailurePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason") || "payment_failed";

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    payment_failed:
      "Your payment was not successful. Please try again or choose a different payment method.",
    transaction_not_found:
      "We couldn't find your transaction. Please contact customer support.",
    processing_error: "An error occurred while processing your payment.",
    missing_parameters:
      "Some required information was missing from your payment request.",
    default:
      "There was an issue with your order. Please try again or contact customer support.",
  };

  const errorMessage = errorMessages[reason] || errorMessages.default;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto bg-card rounded-lg p-8 shadow-md">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 flex items-center justify-center rounded-full mx-auto mb-4">
            <i className="ri-close-line text-5xl text-red-600"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-secondary-foreground mb-6">{errorMessage}</p>

          {orderId && (
            <div className="mb-6 p-4 bg-muted-background rounded-md">
              <p className="text-secondary-foreground">
                Order Reference: {orderId}
              </p>
              <p className="text-xs mt-1">
                Please keep this reference number if you contact support.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/checkout"
              className="px-6 py-3 bg-secondary-background text-primary-background rounded-md"
            >
              Try Again
            </Link>
            <Link
              href="/contact-support"
              className="px-6 py-3 border border-secondary-foreground text-secondary-foreground rounded-md"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
