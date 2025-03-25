"use server";

import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { registerSchema } from "schemas/register-schema";
import {
  updateUserAvatarSchema,
  updateUserNameSchema,
} from "schemas/user-schema";

export async function createUser(formData: FormData) {
  const parsedData = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const { name, email, password } = parsedData.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: { email: "Email is already in use" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}

export async function updateName(id: string, name: string) {
  console.log("update Name called");

  if (!id || !name) {
    return { error: { message: "Invalid input" } };
  }

  const parsedData = updateUserNameSchema.safeParse({ id, name });
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: { id: "User not found" } };
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: { name },
  });

  return {
    success: true,
    updatedUser,
    message: "User name updated successfully",
  };
}

export async function updateAvatar(id: string, avatar: string) {
  console.log("update avatar called");

  if (!id || !avatar) {
    return { error: { message: "Invalid input" } };
  }

  const parsedData = updateUserAvatarSchema.safeParse({ id, avatar });
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: { id: "User not found" } };
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: { avatar },
  });

  return {
    success: true,
    updatedUser,
    message: "User avatar updated successfully",
  };
}
