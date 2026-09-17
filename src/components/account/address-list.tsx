"use client";

import { useTransition } from "react";
import { MapPin, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteAddress, setDefaultAddress } from "@/actions/address-actions";

interface AddressListItem {
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

interface AddressListProps {
  addresses: AddressListItem[];
}

export function AddressList({ addresses }: AddressListProps) {
  const [isPending, startTransition] = useTransition();

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <MapPin className="size-8 text-muted-foreground/40" />
        <p className="font-medium">No addresses yet</p>
        <p className="text-sm text-muted-foreground">Add one using the form.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {addresses.map((address) => (
        <li key={address.id} className="rounded-xl border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{address.fullName}</p>
                {address.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">{address.phone}</p>
            </div>
            <button
              type="button"
              aria-label="Delete address"
              disabled={isPending}
              className="text-muted-foreground hover:text-destructive disabled:opacity-50"
              onClick={() =>
                startTransition(async () => {
                  await deleteAddress(address.id);
                })
              }
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          {!address.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await setDefaultAddress(address.id);
                })
              }
            >
              <Star className="size-3.5" /> Set as default
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
