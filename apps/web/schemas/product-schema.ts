import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .union([
      z.number(),
      z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    ])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val) && val >= 0, {
      message: "Stock must be a non-negative integer",
    }),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => new Date(val))
    .optional(),
});
