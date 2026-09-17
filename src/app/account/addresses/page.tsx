import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddressList } from "@/components/account/address-list";
import { AddressForm } from "@/components/account/address-form";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/addresses");
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Addresses</h1>
      <p className="mt-1 text-muted-foreground">Manage your saved delivery addresses.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <AddressList
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
        />
        <AddressForm />
      </div>
    </div>
  );
}
