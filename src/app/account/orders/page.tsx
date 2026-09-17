import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LinkButton } from "@/components/ui/link-button";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-muted-foreground">Track and review your past orders.</p>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Package className="size-10 text-muted-foreground/40" />
          <p className="font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            Once you place an order, it will show up here.
          </p>
          <LinkButton href="/products" className="mt-2">
            Start shopping
          </LinkButton>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:border-primary/50"
              >
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="font-semibold tabular-nums">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
