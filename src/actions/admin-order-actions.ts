"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-guards";
import { sendOrderStatusEmail } from "@/lib/order-emails";
import type { OrderStatus } from "@prisma/client";

export interface ActionResult {
  success: boolean;
  error?: string;
}

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  await requireAdminAction();

  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    return { success: false, error: "Invalid status" };
  }

  const existing = await db.order.findUnique({ where: { id: orderId }, select: { status: true } });
  const nextStatus = status as OrderStatus;

  await db.order.update({ where: { id: orderId }, data: { status: nextStatus } });

  if (existing && existing.status !== nextStatus) {
    await sendOrderStatusEmail(orderId, nextStatus);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
  return { success: true };
}
