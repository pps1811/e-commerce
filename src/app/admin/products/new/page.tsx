import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { isBlobConfigured } from "@/lib/blob";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">New product</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm categories={categories} uploadEnabled={isBlobConfigured()} />
      </div>
    </div>
  );
}
