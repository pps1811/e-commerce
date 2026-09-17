import { db } from "@/lib/db";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Customers</h1>

      {customers.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          No customers yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Orders</th>
                <th className="p-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="p-3 font-medium">{customer.name ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{customer.email}</td>
                  <td className="p-3 tabular-nums">{customer._count.orders}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString("en-IN", {
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
