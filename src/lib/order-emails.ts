import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { OrderStatusEmail } from "@/emails/order-status";
import type { OrderStatus } from "@prisma/client";

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });
  if (!order) return;

  await sendEmail({
    to: order.user.email,
    subject: `Order confirmed — #${order.orderNumber}`,
    react: OrderConfirmationEmail({
      customerName: order.user.name ?? "there",
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        variant: item.variant,
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      orderUrl: `${getSiteUrl()}/account/orders/${order.id}`,
    }),
  });
}

const NOTIFIABLE_STATUSES: OrderStatus[] = ["SHIPPED", "DELIVERED", "CANCELLED"];

export async function sendOrderStatusEmail(orderId: string, status: OrderStatus): Promise<void> {
  if (!NOTIFIABLE_STATUSES.includes(status)) return;

  const order = await db.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (!order) return;

  const statusLabel = status.charAt(0) + status.slice(1).toLowerCase();

  await sendEmail({
    to: order.user.email,
    subject: `Order #${order.orderNumber} ${statusLabel.toLowerCase()}`,
    react: OrderStatusEmail({
      customerName: order.user.name ?? "there",
      orderNumber: order.orderNumber,
      status: status as "SHIPPED" | "DELIVERED" | "CANCELLED",
      orderUrl: `${getSiteUrl()}/account/orders/${order.id}`,
    }),
  });
}
