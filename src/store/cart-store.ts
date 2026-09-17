"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id && item.variant === variant
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url ?? "",
                variant,
                quantity,
              },
            ],
          };
        });
        set({ isOpen: true });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity < 1) {
          get().removeItem(productId, variant);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "aurelle-cart",
      partialize: (state) => ({ items: state.items }),
      // The store starts empty on both server and client, then rehydrates
      // from localStorage after mount (see useHasCartHydrated below). This
      // keeps the first client render identical to the server's, avoiding
      // a hydration mismatch on every page that reads cart state.
      skipHydration: true,
    }
  )
);

/**
 * True once the persisted cart has been read from localStorage. Any
 * component that renders differently based on cart contents (item count,
 * empty-cart state, etc.) should gate on this to avoid a hydration
 * mismatch — the server always sees an empty cart.
 */
export function useHasCartHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve(useCartStore.persist.rehydrate()).then(() => setHasHydrated(true));
  }, []);

  return hasHydrated;
}
