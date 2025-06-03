export const dynamic = "force-dynamic";

import { getAllProducts } from "actions/product.action";
import { Featured } from "@/components";
import { Product } from "@prisma/client";

export const metadata = {
  title: "Featured Items | Qivee",
  description:
    "Explore Qivee's handpicked selection of featured products, showcasing the best in quality, style, and innovation.",
};

export default async function Page() {
  // Fetch products server-side
  let products: Product[] | null = null;
  let newArrivalsProducts: Product[] | null = null;

  try {
    const response = await getAllProducts();
    if (response.success) {
      products = response.products
        .filter((product) => product.isFeatured)
        .slice(0, 4);
      newArrivalsProducts = response.products.slice(0, 12);
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return (
    <Featured
      initialProducts={products}
      initialNewArrivalsProducts={newArrivalsProducts}
    />
  );
}
