export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  variants?: ProductVariant[];
  highlights?: string[];
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  productCount: number;
}
