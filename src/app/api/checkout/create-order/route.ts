import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRazorpayClient, isRazorpayConfigured, rupeesToPaise } from "@/lib/razorpay";
import { calculateOrder, generateOrderNumber, OrderCalculationError } from "@/lib/orders";
import { createOrderSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Add Razorpay keys to continue." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const address = await db.address.findUnique({ where: { id: parsed.data.addressId } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Address not found" }, { status: 400 });
  }

  let calculation;
  try {
    calculation = await calculateOrder(parsed.data.items);
  } catch (error) {
    if (error instanceof OrderCalculationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const orderNumber = generateOrderNumber();

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      addressId: address.id,
      subtotal: calculation.subtotal,
      shipping: calculation.shipping,
      total: calculation.total,
      items: {
        create: calculation.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
      },
    },
  });

  try {
    const razorpayOrder = await getRazorpayClient().orders.create({
      amount: rupeesToPaise(calculation.total),
      currency: "INR",
      receipt: order.orderNumber,
      notes: { orderId: order.id },
    });

    await db.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: calculation.total,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: rupeesToPaise(calculation.total),
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // Razorpay order creation failed — no payment could have happened yet,
    // but leave the Order row as PENDING (not deleted) so the customer can
    // retry from the same cart instead of losing the attempt entirely.
    console.error("Razorpay order creation failed", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
