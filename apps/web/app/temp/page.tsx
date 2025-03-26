"use client";

import { useState } from "react";
import { createOrder } from "actions/order.action";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user.id || "";
  const [items, setItems] = useState([
    { productId: "99b9a4cf-db43-495d-a419-f99db519d8e4", quantity: 1 },
  ]);

  const handleCreateOrder = async () => {
    try {
      const response = await createOrder(userId, items);
      console.log("Order Response:", response);
      if (response.error) {
        alert("Failed to create order: " + response.error);
      } else {
        alert("Order created successfully!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while creating the order");
    }
  };

  return (
    <div>
      <button onClick={handleCreateOrder}>Create Order</button>
    </div>
  );
}
