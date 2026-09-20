"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/admin-product-actions";

interface DeleteProductButtonProps {
  productId: string;
  productName?: string;
  compact?: boolean;
}

export function DeleteProductButton({ productId, productName, compact }: DeleteProductButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size={compact ? "icon-sm" : "sm"}
        aria-label={`Delete ${productName ?? "product"}`}
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="size-4" />
        {!compact && "Delete"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!compact && <span className="text-sm text-muted-foreground">Delete this product?</span>}
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await deleteProduct(productId);
            router.push("/admin/products");
            router.refresh();
          })
        }
      >
        {compact ? "Sure?" : "Confirm"}
      </Button>
      <Button variant="ghost" size="sm" disabled={isPending} onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  );
}
