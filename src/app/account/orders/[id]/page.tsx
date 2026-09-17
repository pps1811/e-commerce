import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, address: true, payment: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" /> Back to orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Order #{order.orderNumber}
        </h1>
        <Badge variant="secondary">{order.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <ul className="mt-6 divide-y rounded-xl border">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium">{item.productName}</p>
              {item.variant && <p className="text-muted-foreground">Size: {item.variant}</p>}
              <p className="text-muted-foreground">Qty {item.quantity}</p>
            </div>
            <span className="font-medium tabular-nums">
              {formatPrice(Number(item.price) * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border p-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums text-foreground">{formatPrice(Number(order.subtotal))}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="tabular-nums text-foreground">{formatPrice(Number(order.shipping))}</span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      {order.address && (
        <div className="mt-6 rounded-xl border p-4 text-sm">
          <p className="font-medium">Delivery address</p>
          <p className="mt-1 text-muted-foreground">
            {order.address.fullName}, {order.address.line1}, {order.address.city},{" "}
            {order.address.state} {order.address.postalCode}
          </p>
        </div>
      )}
    </div>
  );
}
