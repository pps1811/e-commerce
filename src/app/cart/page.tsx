"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useHasCartHydrated } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, computeShipping } from "@/lib/shipping";

export default function CartPage() {
  const cartHydrated = useHasCartHydrated();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getTotal());

  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  // Before hydration, the store is always empty (matches the server render).
  // Render nothing rather than a misleading "empty cart" flash while the
  // real cart is still loading from localStorage.
  if (!cartHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground/40" />
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <LinkButton href="/products" size="lg" className="mt-2">
          Continue shopping
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-4 py-6">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">Size: {item.variant}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.productId, item.variant)}
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1, item.variant)
                      }
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1, item.variant)
                      }
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border p-6">
          <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="tabular-nums text-foreground">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <LinkButton href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to checkout <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/products" variant="ghost" size="sm" className="mt-2 w-full">
            Continue shopping
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
