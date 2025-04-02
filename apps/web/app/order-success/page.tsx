"use client";

import OrderSuccess from "@/components/order-success";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  console.log("orderId: ", orderId);

  return <OrderSuccess orderId={orderId || ""} />;
}
