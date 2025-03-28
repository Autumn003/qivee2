"use server";

import db from "@repo/db/client";
import { auth } from "../../web/lib/auth";
import { addressSchema } from "schemas/address-schema";

export async function createAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }

  const parsedData = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const address = await db.address.create({
    data: { userId: session.user.id, ...parsedData.data },
  });

  return { success: true, address, message: "Address Added successfully" };
}

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
  });

  return {
    success: true,
    addresses,
    message: "Addresses Retrieved successfully",
  };
}

export async function updateAddress(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }

  const parsedData = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const updatedAddress = await db.address.update({
    where: { id, userId: session.user.id },
    data: parsedData.data,
  });

  return {
    success: true,
    address: updatedAddress,
    message: "Address updated successfully",
  };
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: { message: "Unauthorized request" } };
  }

  await db.address.delete({ where: { id, userId: session.user.id } });
  return { success: true, message: "Address deleted successfully" };
}
