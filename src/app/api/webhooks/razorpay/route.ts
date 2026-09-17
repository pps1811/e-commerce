import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/order-emails";

/**
 * Server-to-server webhook from Razorpay, independent of whether the
 * customer's browser ever made it back to our /checkout/verify call
 * (closed tab, network drop, etc). Configure this URL + a webhook secret
 * in the Razorpay dashboard under Settings > Webhooks.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const razorpayOrderId = event.payload?.payment?.entity?.order_id;
    const razorpayPaymentId = event.payload?.payment?.entity?.id;
    if (!razorpayOrderId) return NextResponse.json({ received: true });

    const payment = await db.payment.findUnique({
      where: { razorpayOrderId },
      include: { order: { include: { items: true } } },
    });

    if (payment) {
      const didTransitionToPaid = await db.$transaction(async (tx) => {
        // Same conditional-update guard as /api/checkout/verify — whichever
        // of the client callback or this webhook arrives first wins, and
        // the other becomes a no-op instead of double-decrementing stock
        // (and double-emailing the customer).
        const { count } = await tx.payment.updateMany({
          where: { id: payment.id, status: { not: "PAID" } },
          data: { status: "PAID", razorpayPaymentId },
        });
        if (count === 0) return false;

        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        });
        for (const item of payment.order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        return true;
      });

      if (didTransitionToPaid) {
        await sendOrderConfirmationEmail(payment.orderId);
      }
    }
  }

  if (event.event === "payment.failed") {
    const razorpayOrderId = event.payload?.payment?.entity?.order_id;
    if (razorpayOrderId) {
      const payment = await db.payment.findUnique({ where: { razorpayOrderId } });
      if (payment && payment.status === "PENDING") {
        await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        await db.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "FAILED" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
