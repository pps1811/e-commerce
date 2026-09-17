import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().trim().url("Enter a valid image URL"),
  alt: z.string().trim().min(1, "Alt text is required").max(200),
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(10, "Description is required").max(5000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  comparePrice: z.coerce.number().positive().optional().or(z.literal("")),
  sku: z.string().trim().min(2, "SKU is required").max(64),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Select a category"),
  isActive: z.boolean().optional(),
  isNew: z.boolean().optional(),
  images: z.array(productImageSchema).min(1, "Add at least one image"),
  highlights: z.array(z.string().trim().min(1)).optional().default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
export type AdminProductFormInput = z.input<typeof adminProductSchema>;

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  image: z.string().trim().url("Enter a valid image URL").optional().or(z.literal("")),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
