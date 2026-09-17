import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            New season, new essentials
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Modern essentials,
            <br />
            thoughtfully made.
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Discover footwear, audio, bags and more — curated for quality and
            designed to last. Free shipping on orders over ₹2,000.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/products" size="lg">
              Shop the collection <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/products?filter=new" size="lg" variant="outline">
              New arrivals
            </LinkButton>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[5/4] md:aspect-[4/5]">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
            alt="Curated collection of modern essentials"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
