export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 99;

export function computeShipping(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
