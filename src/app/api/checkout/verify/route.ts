import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPaymentSchema } from "@/lib/validations/checkout";
import { sendOrderConfirmationEmail } from "@/lib/order-emails";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = verifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order || order.userId !== session.user.id || !order.payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.payment.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }

  // Never trust the browser's word that payment succeeded — recompute the
  // signature server-side with the secret key and compare.
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await db.payment.update({
      where: { id: order.payment.id },
      data: { status: "FAILED" },
    });
    await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const didTransitionToPaid = await db.$transaction(async (tx) => {
    // Conditional update: only rows still PENDING flip to PAID. If the
    // webhook already marked this payment PAID, `count` is 0 here and we
    // skip decrementing stock (and re-emailing) a second time for the same order.
    const { count } = await tx.payment.updateMany({
      where: { id: order.payment!.id, status: { not: "PAID" } },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "PAID",
      },
    });
    if (count === 0) return false;

    await tx.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });
    for (const item of await tx.orderItem.findMany({ where: { orderId: order.id } })) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return true;
  });

  if (didTransitionToPaid) {
    // Awaited (not fire-and-forget) so the send isn't cut off if the
    // serverless function freezes right after the response goes out.
    // sendOrderConfirmationEmail itself never throws — a failed send is
    // logged, not surfaced, so it can't fail this API response.
    await sendOrderConfirmationEmail(order.id);
  }

  return NextResponse.json({ success: true, orderNumber: order.orderNumber });
}
