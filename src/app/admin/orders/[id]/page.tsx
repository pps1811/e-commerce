import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, address: true, payment: true, user: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.user.name ?? order.user.email} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={order.paymentStatus === "PAID" ? "secondary" : "outline"}>
            {order.paymentStatus}
          </Badge>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <ul className="divide-y rounded-xl border">
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

          {order.address && (
            <div className="mt-6 rounded-xl border p-4 text-sm">
              <p className="font-medium">Delivery address</p>
              <p className="mt-1 text-muted-foreground">
                {order.address.fullName}, {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
                {order.address.state} {order.address.postalCode}
              </p>
              <p className="text-muted-foreground">{order.address.phone}</p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-xl border p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums text-foreground">
              {formatPrice(Number(order.subtotal))}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="tabular-nums text-foreground">
              {formatPrice(Number(order.shipping))}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(Number(order.total))}</span>
          </div>

          {order.payment && (
            <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
              <p>Razorpay order: {order.payment.razorpayOrderId}</p>
              {order.payment.razorpayPaymentId && (
                <p className="mt-1">Payment ID: {order.payment.razorpayPaymentId}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
