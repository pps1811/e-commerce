import { db } from "@/lib/db";
import { computeShipping } from "@/lib/shipping";
import type { CreateOrderInput } from "@/lib/validations/checkout";

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface OrderCalculation {
  items: OrderItemSnapshot[];
  subtotal: number;
  shipping: number;
  total: number;
}

export class OrderCalculationError extends Error {}

/**
 * The only place order totals are computed. Always re-reads price and stock
 * from the database — the client-sent cart supplies productId/quantity/variant
 * only, never price. This is what stands between the storefront and a
 * customer paying whatever their browser devtools decide.
 */
export async function calculateOrder(
  items: CreateOrderInput["items"]
): Promise<OrderCalculation> {
  const productIds = items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const snapshots: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productById.get(item.productId);
    if (!product) {
      throw new OrderCalculationError(`Product ${item.productId} is no longer available`);
    }
    if (product.stock < item.quantity) {
      throw new OrderCalculationError(`Not enough stock for "${product.name}"`);
    }

    const price = Number(product.price);
    subtotal += price * item.quantity;
    snapshots.push({
      productId: product.id,
      productName: product.name,
      price,
      quantity: item.quantity,
      variant: item.variant,
    });
  }

  const shipping = computeShipping(subtotal);

  return { items: snapshots, subtotal, shipping, total: subtotal + shipping };
}
