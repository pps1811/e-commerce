"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductStatus } from "@/actions/admin-product-actions";

interface ProductStatusToggleProps {
  productId: string;
  isActive: boolean;
}

export function ProductStatusToggle({ productId, isActive }: ProductStatusToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Product status"
      value={isActive ? "published" : "draft"}
      disabled={isPending}
      onChange={(e) =>
        startTransition(async () => {
          await setProductStatus(productId, e.target.value === "published");
          router.refresh();
        })
      }
      className="h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
    >
      <option value="published">Published</option>
      <option value="draft">Draft</option>
    </select>
  );
}
