"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema, type AddressInput } from "@/lib/validations/address";
import { createAddress } from "@/actions/address-actions";

interface AddressFormProps {
  onSuccess?: () => void;
}

export function AddressForm({ onSuccess }: AddressFormProps = {}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false },
  });
  const isDefault = useWatch({ control, name: "isDefault" });

  async function onSubmit(data: AddressInput) {
    setServerError(null);
    const result = await createAddress(data);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }
    reset();
    router.refresh();
    onSuccess?.();
  }

  return (
    <form
      className="flex h-fit flex-col gap-3 rounded-xl border p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="font-heading text-sm font-semibold">Add a new address</h2>

      <div className="flex flex-col gap-1">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="line1">Address line 1</Label>
        <Input id="line1" {...register("line1")} />
        {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="line2">Address line 2 (optional)</Label>
        <Input id="line2" {...register("line2")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="postalCode">Postal code</Label>
        <Input id="postalCode" {...register("postalCode")} />
        {errors.postalCode && (
          <p className="text-xs text-destructive">{errors.postalCode.message}</p>
        )}
      </div>

      <label className="mt-1 flex items-center gap-2 text-sm">
        <Checkbox
          checked={isDefault}
          onCheckedChange={(checked) => setValue("isDefault", checked === true)}
        />
        Set as default address
      </label>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Saving…" : "Save address"}
      </Button>
    </form>
  );
}
