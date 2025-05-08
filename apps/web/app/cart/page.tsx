import { Cart } from "@/components";
import { getCart } from "actions/cart.action";

interface CartItemWithDetails {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const metadata = {
  title: "Shopping Cart | Qivee",
  description:
    "Review the items in your shopping cart before checkout. Manage quantities, remove products, and proceed to a secure purchase on Qivee.",
};

export default async function Page() {
  // Fetch products server-side
  let products: CartItemWithDetails[] | null = null;

  try {
    const response = await getCart();
    if (response.success) {
      products = response.cartItems;
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return <Cart initialItems={products || []} />;
}
