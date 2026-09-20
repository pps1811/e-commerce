import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { isBlobConfigured } from "@/lib/blob";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Edit product</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <div className="mt-6 max-w-2xl">
        <ProductForm
          productId={product.id}
          categories={categories}
          uploadEnabled={isBlobConfigured()}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
            sku: product.sku,
            stock: product.stock,
            categoryId: product.categoryId,
            isActive: product.isActive,
            isNew: product.isNew,
            images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
            highlights: product.highlights,
          }}
        />
      </div>
    </div>
  );
}
