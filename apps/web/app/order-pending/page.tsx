// app/order-pending/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getOrderById } from "actions/order.action";

function OrderPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Check order status periodically
  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function checkOrderStatus() {
      if (!orderId) return;

      try {
        const response = await getOrderById(orderId);
        if (response.success) {
          setOrderDetails(response.order);

          // If payment status has changed, redirect to appropriate page
          if (response.order.paymentStatus === "SUCCESS") {
            router.push(`/order-success?orderId=${orderId}`);
            return;
          } else if (response.order.paymentStatus === "FAILED") {
            router.push(`/order-failure?orderId=${orderId}`);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking order status:", err);
      } finally {
        setLoading(false);
      }

      // Schedule next check if still pending (and less than 5 refreshes)
      if (refreshCount < 5) {
        timer = setTimeout(() => {
          setRefreshCount((count) => count + 1);
        }, 5000); // Check every 5 seconds
      }
    }

    checkOrderStatus();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [orderId, refreshCount, router]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto bg-card rounded-lg p-8 shadow-md">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-100 flex items-center justify-center rounded-full mx-auto mb-4">
            <i className="ri-time-line text-4xl text-yellow-600"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Processing Your Order</h1>
          <p className="text-secondary-foreground mb-6">
            Your payment is being processed. This page will automatically update
            when completed.
          </p>

          {loading ? (
            <div className="flex justify-center items-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
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

              {orderDetails && (
                <div className="mb-6 p-4 bg-muted-background rounded-md text-left">
                  <h2 className="font-medium mb-2">Order Details</h2>
                  <p>
                    Status: <span className="font-medium">Pending</span>
                  </p>
                  {orderDetails.amount && (
                    <p>
                      Amount:{" "}
                      <span className="font-medium">
                        ${orderDetails.amount.toFixed(2)}
                      </span>
                    </p>
                  )}
                  {orderDetails.createdAt && (
                    <p>
                      Date:{" "}
                      <span className="font-medium">
                        {new Date(orderDetails.createdAt).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {refreshCount >= 5 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
                  <p className="text-amber-800">
                    This is taking longer than expected. You'll receive a
                    confirmation email when your order is processed.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-secondary-background text-primary-background rounded-md"
            >
              Return to Home
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 border border-secondary-foreground text-secondary-foreground rounded-md"
            >
              View Order History
            </Link>
          </div>

          {refreshCount < 5 && (
            <p className="mt-6 text-sm text-secondary-foreground">
              Checking order status... ({refreshCount + 1}/5)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto bg-card rounded-lg p-8 shadow-md">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-secondary-foreground">Loading order details...</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderPendingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderPendingContent />
    </Suspense>
  );
}
