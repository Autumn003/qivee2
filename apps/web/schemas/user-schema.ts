import { z } from "zod";

export const updateUserNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const updateUserAvatarSchema = z.object({
  avatar: z.string().url("Invalid avatar URL"),
});
