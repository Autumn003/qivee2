import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  house: z.string().min(1, "House/Flat/Apartment is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(4, "Zip Code must be valid"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  isDefault: z.boolean().optional(),
});
