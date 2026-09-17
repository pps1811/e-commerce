import type { Metadata } from "next";
import { FilterPanel, ProductsToolbar } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { getAllCategories, queryProducts } from "@/lib/products";
import { db } from "@/lib/db";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    price?: string;
    sort?: string;
    filter?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;

  if (params.q) {
    return { title: `Results for "${params.q}"`, alternates: { canonical: "/products" } };
  }

  if (params.category && !params.category.includes(",")) {
    const category = await db.category.findUnique({ where: { slug: params.category } });
    if (category) {
      return {
        title: category.name,
        description: `Shop ${category.name} at Aurelle — quality essentials, curated for everyday life.`,
        alternates: { canonical: `/products?category=${category.slug}` },
      };
    }
  }

  return {
    title: "Shop All Products",
    description: "Browse the full Aurelle catalog — footwear, audio, bags, watches, and more.",
    alternates: { canonical: "/products" },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [categories, filtered] = await Promise.all([
    getAllCategories(),
    queryProducts(params),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {params.q ? `Results for "${params.q}"` : "Shop All Products"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quality essentials, curated for everyday life.
        </p>
      </div>

      <ProductsToolbar categories={categories} resultCount={filtered.length} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:h-fit">
          <FilterPanel categories={categories} />
        </aside>
        <div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
