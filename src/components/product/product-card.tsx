"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/product/price";
import { Rating } from "@/components/product/rating";
import { useCartStore } from "@/store/cart-store";
import { discountPercent } from "@/lib/format";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = discountPercent(product.price, product.comparePrice);
  const image = product.images[0];
  const hoverImage = product.images[1];

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
      >
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-300",
              hoverImage && "group-hover:opacity-0"
            )}
          />
        )}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge>New</Badge>}
          {discount && <Badge className="bg-sale text-sale-foreground">-{discount}%</Badge>}
        </div>

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:text-sale"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="size-4" />
        </button>

        <Button
          size="sm"
          className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
        >
          <ShoppingBag className="size-4" />
          Quick add
        </Button>
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link href={`/products/${product.slug}`} className="text-sm font-medium hover:underline">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price price={product.price} comparePrice={product.comparePrice} className="mt-1" />
      </div>
    </div>
  );
}
