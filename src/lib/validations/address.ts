import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Address is required").max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{4,10}$/, "Enter a valid postal code"),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
