import { db } from "@/lib/db";
import type { Category, Product, ProductVariant } from "@/types/product";
import type { Prisma } from "@prisma/client";

const productWithRelations = {
  include: {
    category: true,
    images: { orderBy: { sortOrder: "asc" } },
  },
} satisfies Prisma.ProductDefaultArgs;

type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

function toProduct(row: ProductWithRelations): Product {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    comparePrice: row.comparePrice ? Number(row.comparePrice) : undefined,
    images: row.images.map((image) => ({ url: image.url, alt: image.alt })),
    category: row.category.name,
    categorySlug: row.category.slug,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stock: row.stock,
    isNew: row.isNew,
    variants: (row.variants as ProductVariant[] | null) ?? undefined,
    highlights: row.highlights,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    image: row.image ?? "",
    productCount: row._count.products,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { slug, isActive: true },
    ...productWithRelations,
  });
  return row ? toProduct(row) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: {
      category: { slug: product.categorySlug },
      id: { not: product.id },
      isActive: true,
    },
    take: limit,
    ...productWithRelations,
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: limit,
    ...productWithRelations,
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { isActive: true, isNew: true },
    take: limit,
    ...productWithRelations,
  });
  return rows.map(toProduct);
}

export interface ProductQueryParams {
  q?: string;
  filter?: string;
  category?: string;
  price?: string;
  sort?: string;
}

export async function queryProducts(params: ProductQueryParams): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.filter === "new") {
    where.isNew = true;
  }

  if (params.category) {
    where.category = { slug: { in: params.category.split(",") } };
  }

  if (params.price) {
    const [min, max] = params.price.split("-").map(Number);
    where.price = { gte: min, ...(Number.isFinite(max) ? { lte: max } : {}) };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
        ? { price: "desc" }
        : params.sort === "rating"
          ? { rating: "desc" }
          : params.sort === "newest"
            ? { createdAt: "desc" }
            : { createdAt: "asc" };

  const rows = await db.product.findMany({ where, orderBy, ...productWithRelations });
  return rows.map(toProduct);
}
