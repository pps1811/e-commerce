"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useHasCartHydrated } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { computeShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { loadRazorpayScript } from "@/components/checkout/razorpay-loader";
import { AddressForm } from "@/components/account/address-form";
import { cn } from "@/lib/utils";

interface AddressOption {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface CheckoutFormProps {
  addresses: AddressOption[];
  userEmail: string;
  razorpayConfigured: boolean;
}

export function CheckoutForm({ addresses, userEmail, razorpayConfigured }: CheckoutFormProps) {
  const router = useRouter();
  const cartHydrated = useHasCartHydrated();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getTotal());
  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cartHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">Add items before checking out.</p>
      </div>
    );
  }

  async function placeOrder() {
    if (!selectedAddressId) {
      setError("Select a delivery address");
      return;
    }

    setPlacing(true);
    setError(null);

    try {
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
          })),
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error ?? "Could not start checkout");
      }

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: "Aurelle",
        description: "Order payment",
        order_id: createData.razorpayOrderId,
        prefill: { email: userEmail },
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: createData.orderId, ...response }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            setError(verifyData.error ?? "Payment verification failed");
            setPlacing(false);
            return;
          }

          clearCart();
          router.push(`/checkout/success?order=${verifyData.orderNumber}`);
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPlacing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold">Delivery address</h2>

          {addresses.length > 0 && (
            <div className="flex flex-col gap-3">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    selectedAddressId === address.id
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <div>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                      {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!showAddForm ? (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddForm(true)}>
              <MapPin className="size-3.5" /> Add a new address
            </Button>
          ) : (
            <div className="mt-3">
              <AddressForm onSuccess={() => setShowAddForm(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="h-fit rounded-2xl border p-6">
        <h2 className="font-heading text-lg font-semibold">Order Summary</h2>

        <ul className="mt-4 flex flex-col gap-3 text-sm">
          {items.map((item) => (
            <li key={`${item.productId}-${item.variant ?? ""}`} className="flex justify-between">
              <span className="text-muted-foreground">
                {item.name} {item.variant ? `(${item.variant})` : ""} × {item.quantity}
              </span>
              <span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="tabular-nums text-foreground">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>

        {!razorpayConfigured && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Payments aren&apos;t configured yet — this is a preview of the checkout flow.</span>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={placing || !razorpayConfigured || !selectedAddressId}
          onClick={placeOrder}
        >
          {placing ? "Processing…" : `Pay ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}
