import { getproductById } from "actions/product.action";
import { ProductDetails } from "@/components";
import { Product } from "@prisma/client";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: productId } = await params;
  try {
    const response = await getproductById(productId);
    if (response.success && response.product) {
      const product = response.product;
      return {
        title: `${product.name} | Qivee`,
        description:
          product.description ||
          `Discover ${product.name} — available now on Qivee with premium quality and fast delivery.`,
      };
    }
  } catch (error) {
    console.error("Failed to fetch product metadata", error);
  }

  return {
    title: "Product Not Found | Qivee",
    description: "Sorry, we couldn't find the product you're looking for.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id: productId } = await params;
  let product: Product | null = null;

  try {
    const response = await getproductById(productId);
    if (response.success) {
      product = response.product;
    }
  } catch (error) {
    console.error("Failed to fetch product server-side", error);
  }

  return <ProductDetails initialProduct={product} />;
}
