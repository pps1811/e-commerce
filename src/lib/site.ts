export const SITE_NAME = "Aurelle";
export const SITE_DESCRIPTION =
  "Shop curated essentials at Aurelle — quality products, fast delivery, and a checkout you can trust.";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
