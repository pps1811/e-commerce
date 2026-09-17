import type { Category, Product } from "@/types/product";

/**
 * Placeholder catalog. Replace with Prisma queries once the database
 * (Phase 2 of the build plan) is wired up.
 */
export const categories: Category[] = [
  {
    name: "Footwear",
    slug: "footwear",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    productCount: 4,
  },
  {
    name: "Audio",
    slug: "audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    productCount: 3,
  },
  {
    name: "Bags",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    productCount: 3,
  },
  {
    name: "Watches",
    slug: "watches",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    productCount: 2,
  },
  {
    name: "Eyewear",
    slug: "eyewear",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    productCount: 2,
  },
  {
    name: "Home",
    slug: "home",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80",
    productCount: 2,
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "aero-runner-sneakers",
    name: "Aero Runner Sneakers",
    description:
      "Lightweight knit sneakers engineered for all-day comfort with a responsive foam midsole and breathable mesh upper.",
    price: 6499,
    comparePrice: 8999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80",
        alt: "Aero Runner Sneakers, front view",
      },
      {
        url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&q=80",
        alt: "Aero Runner Sneakers, side view",
      },
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=80",
        alt: "Aero Runner Sneakers, on foot",
      },
    ],
    category: "Footwear",
    categorySlug: "footwear",
    rating: 4.6,
    reviewCount: 328,
    stock: 24,
    isNew: true,
    variants: [
      { id: "uk-7", label: "UK 7", inStock: true },
      { id: "uk-8", label: "UK 8", inStock: true },
      { id: "uk-9", label: "UK 9", inStock: true },
      { id: "uk-10", label: "UK 10", inStock: false },
    ],
    highlights: [
      "Breathable engineered-knit upper",
      "Responsive foam midsole",
      "Durable rubber outsole with multi-surface grip",
    ],
  },
  {
    id: "2",
    slug: "trailblaze-hiking-boots",
    name: "Trailblaze Hiking Boots",
    description:
      "Waterproof leather boots built for rugged trails, with ankle support and a grippy Vibram outsole.",
    price: 8999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1000&q=80",
        alt: "Trailblaze Hiking Boots",
      },
      {
        url: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=1000&q=80",
        alt: "Trailblaze Hiking Boots, top view",
      },
    ],
    category: "Footwear",
    categorySlug: "footwear",
    rating: 4.8,
    reviewCount: 142,
    stock: 15,
    variants: [
      { id: "uk-8", label: "UK 8", inStock: true },
      { id: "uk-9", label: "UK 9", inStock: true },
      { id: "uk-10", label: "UK 10", inStock: true },
    ],
    highlights: [
      "100% waterproof full-grain leather",
      "Vibram all-terrain outsole",
      "Reinforced ankle support",
    ],
  },
  {
    id: "3",
    slug: "classic-canvas-slip-ons",
    name: "Classic Canvas Slip-Ons",
    description:
      "Effortless everyday slip-ons in durable canvas with a cushioned footbed.",
    price: 2799,
    comparePrice: 3499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&q=80",
        alt: "Classic Canvas Slip-Ons",
      },
    ],
    category: "Footwear",
    categorySlug: "footwear",
    rating: 4.3,
    reviewCount: 89,
    stock: 40,
    highlights: ["Slip-on comfort", "Machine washable canvas", "Cushioned insole"],
  },
  {
    id: "4",
    slug: "studio-leather-loafers",
    name: "Studio Leather Loafers",
    description:
      "Hand-finished leather loafers with a stacked heel — smart enough for the office, comfortable enough for all day.",
    price: 5299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1000&q=80",
        alt: "Studio Leather Loafers",
      },
    ],
    category: "Footwear",
    categorySlug: "footwear",
    rating: 4.5,
    reviewCount: 61,
    stock: 18,
    highlights: ["Genuine leather upper", "Cushioned footbed", "Stacked wood-effect heel"],
  },
  {
    id: "5",
    slug: "pulse-wireless-headphones",
    name: "Pulse Wireless Headphones",
    description:
      "Over-ear headphones with active noise cancellation, 40-hour battery life, and studio-tuned sound.",
    price: 7999,
    comparePrice: 9999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80",
        alt: "Pulse Wireless Headphones",
      },
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&q=80",
        alt: "Pulse Wireless Headphones, case",
      },
    ],
    category: "Audio",
    categorySlug: "audio",
    rating: 4.7,
    reviewCount: 512,
    stock: 32,
    isNew: true,
    highlights: [
      "Active noise cancellation",
      "40-hour battery life",
      "Bluetooth 5.3 with multipoint pairing",
    ],
  },
  {
    id: "6",
    slug: "echo-mini-speaker",
    name: "Echo Mini Bluetooth Speaker",
    description:
      "Pocket-sized speaker with room-filling sound and 12-hour battery, rated IPX7 for splash resistance.",
    price: 2499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1000&q=80",
        alt: "Echo Mini Bluetooth Speaker",
      },
    ],
    category: "Audio",
    categorySlug: "audio",
    rating: 4.4,
    reviewCount: 203,
    stock: 55,
    highlights: ["IPX7 splash resistant", "12-hour battery", "Built-in mic for calls"],
  },
  {
    id: "7",
    slug: "buds-pro-earbuds",
    name: "Buds Pro True Wireless Earbuds",
    description:
      "Compact true wireless earbuds with adaptive noise cancellation and a wireless charging case.",
    price: 4999,
    comparePrice: 6499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80",
        alt: "Buds Pro True Wireless Earbuds",
      },
    ],
    category: "Audio",
    categorySlug: "audio",
    rating: 4.5,
    reviewCount: 176,
    stock: 28,
    highlights: ["Adaptive ANC", "Wireless charging case", "24hr total battery"],
  },
  {
    id: "8",
    slug: "voyager-leather-tote",
    name: "Voyager Leather Tote",
    description:
      "Spacious full-grain leather tote with a padded laptop sleeve — built for daily commutes.",
    price: 6999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80",
        alt: "Voyager Leather Tote",
      },
      {
        url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1000&q=80",
        alt: "Voyager Leather Tote, interior",
      },
    ],
    category: "Bags",
    categorySlug: "bags",
    rating: 4.6,
    reviewCount: 94,
    stock: 21,
    highlights: [
      "Full-grain leather",
      "Padded 15-inch laptop sleeve",
      "Interior organizer pockets",
    ],
  },
  {
    id: "9",
    slug: "summit-travel-backpack",
    name: "Summit Travel Backpack",
    description:
      "35L weatherproof backpack with a dedicated tech compartment and airline-friendly profile.",
    price: 5499,
    comparePrice: 6999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1000&q=80",
        alt: "Summit Travel Backpack",
      },
    ],
    category: "Bags",
    categorySlug: "bags",
    rating: 4.7,
    reviewCount: 268,
    stock: 33,
    isNew: true,
    highlights: ["35L weatherproof shell", "Dedicated tech compartment", "Sternum + hip straps"],
  },
  {
    id: "10",
    slug: "everyday-crossbody-bag",
    name: "Everyday Crossbody Bag",
    description:
      "A compact crossbody with adjustable strap and RFID-blocking card slots for essentials on the go.",
    price: 2299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1000&q=80",
        alt: "Everyday Crossbody Bag",
      },
    ],
    category: "Bags",
    categorySlug: "bags",
    rating: 4.2,
    reviewCount: 47,
    stock: 60,
    highlights: ["RFID-blocking pocket", "Adjustable strap", "Water-resistant canvas"],
  },
  {
    id: "11",
    slug: "meridian-automatic-watch",
    name: "Meridian Automatic Watch",
    description:
      "Swiss-movement automatic watch with a sapphire crystal face and genuine leather strap.",
    price: 15999,
    comparePrice: 19999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80",
        alt: "Meridian Automatic Watch",
      },
      {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1000&q=80",
        alt: "Meridian Automatic Watch, wrist shot",
      },
    ],
    category: "Watches",
    categorySlug: "watches",
    rating: 4.9,
    reviewCount: 87,
    stock: 9,
    highlights: ["Swiss automatic movement", "Sapphire crystal", "Genuine leather strap"],
  },
  {
    id: "12",
    slug: "pulse-fitness-smartwatch",
    name: "Pulse Fitness Smartwatch",
    description:
      "Track workouts, sleep, and heart rate with a 10-day battery and always-on AMOLED display.",
    price: 8499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=1000&q=80",
        alt: "Pulse Fitness Smartwatch",
      },
    ],
    category: "Watches",
    categorySlug: "watches",
    rating: 4.4,
    reviewCount: 341,
    stock: 47,
    isNew: true,
    highlights: ["10-day battery", "Always-on AMOLED", "Heart rate + SpO2 tracking"],
  },
  {
    id: "13",
    slug: "horizon-polarized-sunglasses",
    name: "Horizon Polarized Sunglasses",
    description:
      "Classic acetate frames with 100% UV protection and polarized lenses.",
    price: 3299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80",
        alt: "Horizon Polarized Sunglasses",
      },
    ],
    category: "Eyewear",
    categorySlug: "eyewear",
    rating: 4.5,
    reviewCount: 118,
    stock: 38,
    highlights: ["Polarized UV400 lenses", "Acetate frame", "Includes hard case"],
  },
  {
    id: "14",
    slug: "aviator-classic-sunglasses",
    name: "Aviator Classic Sunglasses",
    description:
      "Timeless metal-frame aviators with gradient lenses and adjustable nose pads.",
    price: 2999,
    comparePrice: 3799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&q=80",
        alt: "Aviator Classic Sunglasses",
      },
    ],
    category: "Eyewear",
    categorySlug: "eyewear",
    rating: 4.3,
    reviewCount: 76,
    stock: 44,
    highlights: ["Metal alloy frame", "Gradient UV400 lenses", "Adjustable nose pads"],
  },
  {
    id: "15",
    slug: "ember-ceramic-pour-over-set",
    name: "Ember Ceramic Pour-Over Set",
    description:
      "Minimalist ceramic pour-over coffee dripper with a matching mug, designed for slow mornings.",
    price: 1899,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1000&q=80",
        alt: "Ember Ceramic Pour-Over Set",
      },
    ],
    category: "Home",
    categorySlug: "home",
    rating: 4.6,
    reviewCount: 55,
    stock: 26,
    highlights: ["Hand-glazed ceramic", "Reusable stainless filter", "Includes matching mug"],
  },
  {
    id: "16",
    slug: "linen-throw-blanket",
    name: "Linen Blend Throw Blanket",
    description:
      "Breathable linen-cotton throw blanket, pre-washed for a soft, lived-in feel.",
    price: 2599,
    comparePrice: 3199,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=1000&q=80",
        alt: "Linen Blend Throw Blanket",
      },
    ],
    category: "Home",
    categorySlug: "home",
    rating: 4.7,
    reviewCount: 39,
    stock: 31,
    highlights: ["55% linen / 45% cotton", "Pre-washed for softness", "130 x 170 cm"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}
