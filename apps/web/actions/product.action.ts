"use server";

import db from "@repo/db/client";
import { productSchema } from "schemas/product-schema";

export async function createProduct(formData: FormData) {
  const rawData = Object.fromEntries(formData);

  const images = formData
    .getAll("images[]")
    .map((img) => (typeof img === "string" ? img : ""))
    .filter(Boolean) as string[];

  const parsedData = productSchema.safeParse({
    ...rawData,
    price: Number(rawData.price),
    stock: Number(rawData.stock),
    images,
  });

  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const { name, description, price, stock, category } = parsedData.data;

  const product = await db.product.create({
    data: {
      name,
      description,
      price,
      images,
      stock,
      category,
    },
  });

  return { success: true, product, message: "Product created successfully" };
}

export async function getAllProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" }, // Sorting by latest products first
    });

    // Convert Decimal price to number
    const serializedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price), // Convert Decimal to number
    }));

    return { success: true, products: serializedProducts };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: "Failed to fetch products" };
  }
}
