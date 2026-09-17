"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validations/address";

export interface ActionResult {
  success: boolean;
  error?: string;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session.user.id;
}

export async function createAddress(input: unknown): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { isDefault, ...data } = parsed.data;

  if (isDefault) {
    await db.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  await db.address.create({
    data: { ...data, userId, isDefault: isDefault ?? false },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const address = await db.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    return { success: false, error: "Address not found" };
  }

  await db.address.delete({ where: { id: addressId } });
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function setDefaultAddress(addressId: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const address = await db.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    return { success: false, error: "Address not found" };
  }

  await db.$transaction([
    db.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    db.address.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);

  revalidatePath("/account/addresses");
  return { success: true };
}
