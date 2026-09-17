import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8">
        <CheckoutForm
          addresses={addresses.map((a) => ({
            id: a.id,
            fullName: a.fullName,
            phone: a.phone,
            line1: a.line1,
            line2: a.line2,
            city: a.city,
            state: a.state,
            postalCode: a.postalCode,
            isDefault: a.isDefault,
          }))}
          userEmail={session.user.email ?? ""}
          razorpayConfigured={isRazorpayConfigured()}
        />
      </div>
    </div>
  );
}
