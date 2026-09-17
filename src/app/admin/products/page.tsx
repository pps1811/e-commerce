import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Products</h1>
        <LinkButton href="/admin/products/new">
          <Plus className="size-4" /> New product
        </LinkButton>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">No products yet</p>
          <LinkButton href="/admin/products/new" className="mt-3" variant="outline">
            Add your first product
          </LinkButton>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-muted/30">
                  <td className="p-3">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium hover:underline">{product.name}</span>
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{product.category.name}</td>
                  <td className="p-3 tabular-nums">{formatPrice(Number(product.price))}</td>
                  <td className="p-3 tabular-nums">
                    {product.stock === 0 ? (
                      <span className="text-destructive">Out of stock</span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={product.isActive ? "secondary" : "outline"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
