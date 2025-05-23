"use client";

import OrderSuccess from "@/components/order-success";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto bg-card rounded-lg p-8 shadow-md">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-secondary-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return <OrderSuccess orderId={orderId || ""} />;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
