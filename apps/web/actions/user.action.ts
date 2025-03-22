"use server";

import { z } from "zod";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

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
