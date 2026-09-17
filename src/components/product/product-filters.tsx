"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import type { Category } from "@/types/product";

const priceRanges = [
  { label: "Under ₹2,500", min: 0, max: 2500 },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Over ₹10,000", min: 10000, max: Infinity },
];

function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const selectedPrice = searchParams.get("price");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { selectedCategories, selectedPrice, updateParams, pathname, router };
}

export function FilterPanel({ categories }: { categories: Category[] }) {
  const { selectedCategories, selectedPrice, updateParams } = useFilterParams();

  function toggleCategory(slug: string) {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    updateParams({ category: next.length ? next.join(",") : null });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <span>{category.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {category.productCount}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price</h3>
        <div className="flex flex-col gap-2.5">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedPrice === `${range.min}-${range.max}`}
                onCheckedChange={(checked) =>
                  updateParams({ price: checked ? `${range.min}-${range.max}` : null })
                }
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProductsToolbarProps {
  categories: Category[];
  resultCount: number;
}

export function ProductsToolbar({ categories, resultCount }: ProductsToolbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedCategories, selectedPrice, updateParams, pathname, router } = useFilterParams();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "featured";
  const hasActiveFilters = selectedCategories.length > 0 || !!selectedPrice;

  return (
    <div className="flex items-center justify-between gap-4 border-b pb-4">
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "product" : "products"}
      </p>
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
            <X className="size-3.5" /> Clear
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal className="size-3.5" /> Filters
        </Button>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) =>
            updateParams({ sort: e.target.value === "featured" ? null : e.target.value })
          }
          className="h-8 rounded-md border bg-background px-2 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-80 gap-0 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterPanel categories={categories} />
          </div>
          <SheetFooter className="border-t">
            <Button onClick={() => setMobileOpen(false)}>Show {resultCount} results</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
