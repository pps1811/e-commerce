"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-guards";
import { adminProductSchema, adminCategorySchema } from "@/lib/validations/admin-product";

export interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createProduct(input: unknown): Promise<ActionResult> {
  await requireAdminAction();
  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existingSlug = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug) return { success: false, error: "A product with this slug already exists" };

  const existingSku = await db.product.findUnique({ where: { sku: parsed.data.sku } });
  if (existingSku) return { success: false, error: "A product with this SKU already exists" };

  const { images, comparePrice, ...rest } = parsed.data;

  const product = await db.product.create({
    data: {
      ...rest,
      comparePrice: comparePrice || null,
      images: { create: images.map((img, index) => ({ ...img, sortOrder: index })) },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, id: product.id };
}

export async function updateProduct(id: string, input: unknown): Promise<ActionResult> {
  await requireAdminAction();
  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const conflictingSlug = await db.product.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (conflictingSlug) return { success: false, error: "A product with this slug already exists" };

  const conflictingSku = await db.product.findFirst({
    where: { sku: parsed.data.sku, id: { not: id } },
  });
  if (conflictingSku) return { success: false, error: "A product with this SKU already exists" };

  const { images, comparePrice, ...rest } = parsed.data;

  await db.product.update({
    where: { id },
    data: {
      ...rest,
      comparePrice: comparePrice || null,
      images: {
        deleteMany: {},
        create: images.map((img, index) => ({ ...img, sortOrder: index })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${parsed.data.slug}`);
  return { success: true, id };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdminAction();

  const orderItemCount = await db.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    // Products referenced by past orders must stay for order-history
    // integrity (see OrderItem's price/name snapshot). Deactivate instead.
    await db.product.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  }

  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  await requireAdminAction();
  const parsed = adminCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false, error: "A category with this slug already exists" };

  await db.category.create({
    data: { name: parsed.data.name, slug: parsed.data.slug, image: parsed.data.image || null },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdminAction();

  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { success: false, error: "Move or delete products in this category first" };
  }

  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}
