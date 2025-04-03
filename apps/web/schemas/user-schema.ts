import { z } from "zod";

export const updateUserNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const updateUserAvatarSchema = z.object({
  avatar: z.string().url("Invalid avatar URL"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});
