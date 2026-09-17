import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { Rating } from "@/components/product/rating";
import { Price } from "@/components/product/price";
import { ProductGrid } from "@/components/product/product-grid";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { db } from "@/lib/db";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const images = product.images.map((img) => ({ url: img.url, alt: img.alt }));

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: `/products/${product.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: images.map((img) => img.url),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${product.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images.map((img) => img.url),
          sku: product.sku,
          brand: { "@type": "Brand", name: SITE_NAME },
          aggregateRating:
            product.reviewCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount,
                }
              : undefined,
          offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "INR",
            price: product.price,
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: product.category,
              item: `${siteUrl}/products?category=${product.categorySlug}`,
            },
            { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
          ],
        }}
      />

      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/products?category=${product.categorySlug}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
            </div>
          </div>

          <Price price={product.price} comparePrice={product.comparePrice} size="lg" />

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <AddToCartForm product={product} />

          <div className="flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="size-4 shrink-0 text-primary" />
              <span>Free shipping on orders over ₹2,000</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="size-4 shrink-0 text-primary" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <span>Secure payment via Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <Tabs defaultValue="details">
          <TabsList variant="line" className="w-full justify-start border-b">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping &amp; Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-6">
            {product.highlights && product.highlights.length > 0 && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="shipping" className="max-w-2xl pt-6 text-sm text-muted-foreground">
            <p>
              Orders ship within 1–2 business days. Standard delivery takes 3–5 business days;
              express options are available at checkout. We offer a 30-day return window on
              unused items in original packaging.
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <div className="flex items-center gap-4">
              <span className="font-heading text-4xl font-bold">{product.rating.toFixed(1)}</span>
              <div>
                <Rating value={product.rating} size="md" />
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
