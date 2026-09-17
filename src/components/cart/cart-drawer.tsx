"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { LinkButton } from "@/components/ui/link-button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.getTotal());

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 font-heading">
            <ShoppingBag className="size-5" />
            Your cart ({items.reduce((n, i) => n + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <LinkButton href="/products" className="mt-2" onClick={closeCart}>
              Start shopping
            </LinkButton>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-4 py-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">Size: {item.variant}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.variant)
                            }
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.variant)
                            }
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      className="self-start text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId, item.variant)}
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t">
              <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-foreground tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Separator className="my-1" />
              <div className="flex w-full flex-col gap-2">
                <LinkButton href="/checkout" size="lg" onClick={closeCart}>
                  Checkout
                </LinkButton>
                <LinkButton href="/cart" variant="outline" size="lg" onClick={closeCart}>
                  View cart
                </LinkButton>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
