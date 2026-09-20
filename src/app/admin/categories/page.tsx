import { db } from "@/lib/db";
import { CategoryList } from "@/components/admin/category-list";
import { CategoryForm } from "@/components/admin/category-form";
import { isBlobConfigured } from "@/lib/blob";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Categories</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <CategoryList
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            productCount: c._count.products,
          }))}
        />
        <CategoryForm uploadEnabled={isBlobConfigured()} />
      </div>
    </div>
  );
}
