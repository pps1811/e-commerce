import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Payment</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {order.user.name ?? order.user.email}
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">{order.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={order.paymentStatus === "PAID" ? "secondary" : "outline"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3 tabular-nums">{formatPrice(Number(order.total))}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
