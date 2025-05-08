// import { Featured } from "@/components";

// const Page = () => {
//   return <Featured />;
// };

// export default Page;

import { getAllProducts } from "actions/product.action";
import { Featured } from "@/components";
import { Product } from "@prisma/client";

export const metadata = {
  title: "New Arrivals | Qivee",
  description: "Discover our latest collection of premium products",
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
