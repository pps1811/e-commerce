import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LinkButton } from "@/components/ui/link-button";
import { formatPrice } from "@/lib/format";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { order: orderNumber } = await searchParams;
  if (!orderNumber) {
    notFound();
  }

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <CheckCircle2 className="size-14 text-success" />
      <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">Order Confirmed</h1>
      <p className="mt-1 text-muted-foreground">Thank you for your order!</p>

      <p className="mt-6 font-medium">Order #{order.orderNumber}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
        {formatPrice(Number(order.total))}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href={`/account/orders/${order.id}`} size="lg">
          View order
        </LinkButton>
        <LinkButton href="/products" variant="outline" size="lg">
          Continue shopping
        </LinkButton>
      </div>

      <Link href="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground">
        Back to home
      </Link>
    </div>
  );
}
