import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Package, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orderCount, addressCount] = await Promise.all([
    db.order.count({ where: { userId: session.user.id } }),
    db.address.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">My Account</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back, {session.user.name ?? session.user.email}.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/profile"
          className="flex flex-col gap-2 rounded-xl border p-5 transition-colors hover:border-primary/50"
        >
          <User className="size-5 text-primary" />
          <span className="font-medium">Profile</span>
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
        </Link>

        <Link
          href="/account/orders"
          className="flex flex-col gap-2 rounded-xl border p-5 transition-colors hover:border-primary/50"
        >
          <Package className="size-5 text-primary" />
          <span className="font-medium">Orders</span>
          <span className="text-sm text-muted-foreground">
            {orderCount} {orderCount === 1 ? "order" : "orders"}
          </span>
        </Link>

        <Link
          href="/account/addresses"
          className="flex flex-col gap-2 rounded-xl border p-5 transition-colors hover:border-primary/50"
        >
          <MapPin className="size-5 text-primary" />
          <span className="font-medium">Addresses</span>
          <span className="text-sm text-muted-foreground">
            {addressCount} saved {addressCount === 1 ? "address" : "addresses"}
          </span>
        </Link>
      </div>
    </div>
  );
}
