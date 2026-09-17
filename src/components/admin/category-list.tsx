"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin-product-actions";

interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export function CategoryList({ categories }: { categories: CategoryListItem[] }) {
  const [isPending, startTransition] = useTransition();

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        No categories yet.
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-xl border">
      {categories.map((category) => (
        <li key={category.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-muted-foreground">
              /{category.slug} · {category.productCount} product
              {category.productCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Delete category"
            disabled={isPending || category.productCount > 0}
            title={category.productCount > 0 ? "Move products out first" : "Delete category"}
            className="text-muted-foreground hover:text-destructive disabled:opacity-30"
            onClick={() =>
              startTransition(async () => {
                await deleteCategory(category.id);
              })
            }
          >
            <Trash2 className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
