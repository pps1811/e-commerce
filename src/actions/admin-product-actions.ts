"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-guards";
import { deleteBlobUrls } from "@/lib/blob";
import { adminProductSchema, adminCategorySchema } from "@/lib/validations/admin-product";

export interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Deletes uploaded files that no remaining product or category still uses
 * (the same URL could have been pasted into two products).
 */
async function removeUnusedBlobs(urls: string[]) {
  if (urls.length === 0) return;
  const [stillUsedByProducts, stillUsedByCategories] = await Promise.all([
    db.productImage.findMany({ where: { url: { in: urls } }, select: { url: true } }),
    db.category.findMany({ where: { image: { in: urls } }, select: { image: true } }),
  ]);
  const inUse = new Set([
    ...stillUsedByProducts.map((i) => i.url),
    ...stillUsedByCategories.map((c) => c.image ?? ""),
  ]);
  await deleteBlobUrls(urls.filter((url) => !inUse.has(url)));
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

  const previousImages = await db.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });

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

  // Images the admin removed or replaced are no longer needed in storage.
  const keptUrls = new Set(images.map((img) => img.url));
  await removeUnusedBlobs(previousImages.map((i) => i.url).filter((url) => !keptUrls.has(url)));

  return { success: true, id };
}

export async function setProductStatus(id: string, isActive: boolean): Promise<ActionResult> {
  await requireAdminAction();

  const product = await db.product.update({ where: { id }, data: { isActive } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  return { success: true };
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

  const images = await db.productImage.findMany({ where: { productId: id }, select: { url: true } });

  await db.product.delete({ where: { id } });

  // Product rows are gone, so their uploaded files can go too.
  await removeUnusedBlobs(images.map((i) => i.url));

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
