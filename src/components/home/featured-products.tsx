import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/types/product";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export function FeaturedProducts({
  title,
  subtitle,
  products,
  viewAllHref,
}: FeaturedProductsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
