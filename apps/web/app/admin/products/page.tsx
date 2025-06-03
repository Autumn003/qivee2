export const dynamic = "force-dynamic";

import { getAllProducts } from "actions/product.action";
import { AdminProducts } from "@/components";
import { Product } from "@prisma/client";

export const metadata = {
  title: "All Products | Qivee",
  description:
    "Browse Qivee's full range of products across all categories, designed to meet your every need with quality and style.",
};

export default async function Page() {
  // Fetch products server-side
  let products: Product[] | null = null;

  try {
    const response = await getAllProducts();
    if (response.success) {
      products = response.products;
    }
  } catch (error) {
    console.error("Failed to fetch products server-side", error);
  }

  return <AdminProducts initialProducts={products} />;
}
