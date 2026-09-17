import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/product";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-border transition-transform group-hover:scale-[1.03]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 15vw, 33vw"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
