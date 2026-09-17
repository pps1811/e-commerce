"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        {current && (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${productName}`}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted ring-2 transition-all",
                active === index ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
