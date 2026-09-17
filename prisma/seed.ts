import { PrismaClient, type Prisma } from "@prisma/client";
import { categories, products } from "../src/data/products";

const prisma = new PrismaClient();

function skuFromSlug(slug: string): string {
  return slug.toUpperCase().replace(/-/g, "_").slice(0, 24);
}

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, image: category.image },
      create: {
        name: category.name,
        slug: category.slug,
        image: category.image,
      },
    });
    categoryIdBySlug.set(category.slug, created.id);
  }

  console.log("Seeding products...");
  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug "${product.categorySlug}" for product ${product.slug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        stock: product.stock,
        categoryId,
        variants: (product.variants as Prisma.InputJsonValue | undefined) ?? undefined,
        highlights: product.highlights ?? [],
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew ?? false,
        images: {
          deleteMany: {},
          create: product.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: index,
          })),
        },
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        sku: skuFromSlug(product.slug),
        stock: product.stock,
        categoryId,
        variants: (product.variants as Prisma.InputJsonValue | undefined) ?? undefined,
        highlights: product.highlights ?? [],
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew ?? false,
        images: {
          create: product.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: index,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
