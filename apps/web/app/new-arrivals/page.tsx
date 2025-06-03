export const dynamic = "force-dynamic";

import { getAllProducts } from "actions/product.action";
import { NewArrivals } from "@/components";
import { Product } from "@prisma/client";

export const metadata = {
  title: "New Arrivals | Qivee",
  description: "Discover our latest collection of premium products",
};

export default async function Page() {
  // Fetch products server-side
  let products: Product[] | null = null;
  let featuredProducts: Product[] | null = null;

  try {
    const response = await getAllProducts();
    if (response.success) {
      products = response.products.slice(0, 12);
      featuredProducts = response.products
        .filter((product) => product.isFeatured)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return (
    <NewArrivals
      initialProducts={products}
      initialFeaturedProducts={featuredProducts}
    />
  );
}
