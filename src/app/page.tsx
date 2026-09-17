import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustBadges } from "@/components/home/trust-badges";
import { Newsletter } from "@/components/home/newsletter";
import { getAllCategories, getFeaturedProducts, getNewArrivals } from "@/lib/products";

export default async function Home() {
  const [categories, featured, newArrivals] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(8),
    getNewArrivals(4),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryGrid categories={categories} />
      {newArrivals.length > 0 && (
        <FeaturedProducts
          title="New arrivals"
          subtitle="Fresh drops, just landed."
          products={newArrivals}
          viewAllHref="/products?filter=new"
        />
      )}
      <FeaturedProducts
        title="Best sellers"
        subtitle="Loved by our customers."
        products={featured}
        viewAllHref="/products"
      />
      <Newsletter />
    </>
  );
}
