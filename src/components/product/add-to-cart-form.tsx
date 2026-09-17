"use client";

import { useState } from "react";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.find((v) => v.inStock)?.id
  );
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = product.stock <= 0;
  const variantLabel = product.variants?.find((v) => v.id === selectedVariant)?.label;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(product, quantity, variantLabel);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      {product.variants && product.variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Size</span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.inStock}
                onClick={() => setSelectedVariant(variant.id)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                  selectedVariant === variant.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50",
                  !variant.inStock &&
                    "cursor-not-allowed border-border/50 text-muted-foreground/40 line-through hover:border-border/50"
                )}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Quantity</span>
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {justAdded ? (
            <>
              <Check className="size-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" /> Add to cart
            </>
          )}
        </Button>
        {outOfStock ? (
          <Button size="lg" className="flex-1" disabled>
            <Zap className="size-4" /> Buy now
          </Button>
        ) : (
          <LinkButton href="/checkout" size="lg" className="flex-1" onClick={handleAddToCart}>
            <Zap className="size-4" /> Buy now
          </LinkButton>
        )}
      </div>

      {outOfStock ? (
        <p className="text-sm font-medium text-destructive">Out of stock</p>
      ) : product.stock <= 10 ? (
        <p className="text-sm font-medium text-sale">Only {product.stock} left in stock</p>
      ) : (
        <p className="text-sm text-success">In stock and ready to ship</p>
      )}
    </div>
  );
}
