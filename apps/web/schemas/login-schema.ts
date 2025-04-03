import { z } from "zod";
import { passwordSchema } from "./user-schema";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema.shape.password,
});
