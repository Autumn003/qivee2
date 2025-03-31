"use server";

import db from "@repo/db/client";
import { productSchema } from "schemas/product-schema";
import { productCategory } from "@prisma/client";

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

export async function getproductById(id: string) {
  if (!id) {
    return { error: "Product ID is required" };
  }

  const product = await db.product.findUnique({ where: { id } });
  if (!product) {
    return { error: { message: "Product not found" } };
  }

  return { success: true, product, message: "product retrieved successfully" };
}

export async function getRecommendedProducts(
  productId: string,
  category: productCategory
) {
  try {
    let categoryProducts = await db.product.findMany({
      where: { category, NOT: { id: productId } },
      take: 8,
    });

    if (categoryProducts.length < 8) {
      const needed = 8 - categoryProducts.length;
      const recentProducts = await db.product.findMany({
        where: { NOT: { id: productId } },
        orderBy: { createdAt: "desc" },
        take: needed,
      });

      const serializedRecentProducts = recentProducts.map((product) => ({
        ...product,
      }));

      // Merge and ensure uniqueness
      const combinedProducts = [
        ...categoryProducts,
        ...serializedRecentProducts,
      ].filter(
        (p, index, self) => index === self.findIndex((t) => t.id === p.id)
      );

      return { success: true, products: combinedProducts };
    }

    return { success: true, products: categoryProducts };
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return { error: "Failed to fetch recommended products" };
  }
}

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

export async function updateProduct(id: string, formData: FormData) {
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

  const updatedProduct = await db.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      images,
      stock,
      category,
    },
  });

  return {
    success: true,
    updatedProduct,
    message: "Product updated successfully",
  };
}

export async function deleteProduct(id: string) {
  await db.product.delete({
    where: { id },
  });

  return {
    success: true,
    message: "Product deleted successfully",
  };
}
