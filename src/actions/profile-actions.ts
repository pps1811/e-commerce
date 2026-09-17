"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(100);

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(name: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid name" };
  }

  await db.user.update({ where: { id: session.user.id }, data: { name: parsed.data } });
  revalidatePath("/account/profile");
  return { success: true };
}
