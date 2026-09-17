import Link from "next/link";
import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [revenueResult, orderCount, productCount, customerCount, recentOrders] =
    await Promise.all([
      db.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      db.order.count(),
      db.product.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, items: true },
      }),
    ]);

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(Number(revenueResult._sum.total ?? 0)),
      icon: IndianRupee,
    },
    { label: "Orders", value: orderCount.toString(), icon: ShoppingCart },
    { label: "Products", value: productCount.toString(), icon: Package },
    { label: "Customers", value: customerCount.toString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className="size-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <ul className="divide-y rounded-xl border">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-muted-foreground">
                      {order.user.name ?? order.user.email} · {order.items.length} item
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{order.status}</Badge>
                    <span className="font-medium tabular-nums">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
