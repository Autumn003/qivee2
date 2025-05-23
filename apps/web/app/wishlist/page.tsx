import { getWishlist } from "actions/wishlist.action";
import Wishlist from "@/components/wishlist";

export const dynamic = "force-dynamic";

interface WishlistItemWithDetails {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  createdAt: Date;
}

export const metadata = {
  title: "My Wishlist | Qivee",
  description:
    "View and manage your wishlist of saved items at Qivee, your one-stop shop for quality products.",
};

export default async function Page() {
  // Fetch products server-side
  let products: WishlistItemWithDetails[] | null = null;

  try {
    const response = await getWishlist();
    if (response.success) {
      products = response.wishlistItems;
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return <Wishlist initialItems={products || []} />;
}
