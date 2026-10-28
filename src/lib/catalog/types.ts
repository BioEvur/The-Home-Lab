/**
 * Central, customer-facing product model.
 *
 * Every storefront component reads products in this shape, whether they come
 * from the local development catalogue or from Shopify (see
 * `lib/commerce/shopify/mappers.ts`). Confidential supplier data lives
 * separately in `lib/catalog/internal` and never reaches the browser.
 */

/** Money is always held in minor units (cents) to avoid floating point drift. */
export interface Money {
  amount: number;
  currencyCode: 'EUR' | 'GBP';
}

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** True for development stand-in photography that does not show the exact item. */
  sample?: boolean;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string | null;
  title: string;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  /** Image shown when this variant is selected. Falls back to the product's first image. */
  imageId?: string;
}

export interface ProductColour {
  /** The option value as the customer sees it, e.g. "Moss". */
  value: string;
  /** Filter family, e.g. "Green". */
  family: string;
  swatch: string;
}

export interface Dimensions {
  /** All measurements in centimetres. */
  width?: number;
  depth?: number;
  height?: number;
  diameter?: number;
  seatHeight?: number;
  /** Free-text notes, e.g. "Mattress sold separately". */
  notes?: string;
}

export type CategoryHandle =
  | 'living-room'
  | 'bedroom'
  | 'dining'
  | 'lighting'
  | 'storage'
  | 'home-accessories'
  | 'coffee-kitchen';

export interface Product {
  id: string;
  handle: string;
  title: string;
  productType: string;
  category: CategoryHandle;
  collections: string[];
  shortDescription: string;
  description: string;
  features: string[];
  materials: string[];
  /** Normalised material families used for filtering (e.g. "Wood", "Ceramic"). */
  materialFamilies: string[];
  dimensions: Dimensions | null;
  weightKg: number | null;
  care: string | null;
  assembly: string | null;
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  /**
   * Colour/finish values offered, normalised into filterable colour families.
   * From Shopify this comes from option swatches or a metafield mapping.
   */
  colours: ProductColour[];
  tags: string[];
  relatedHandles: string[];
  isNew: boolean;
  /** ISO date the product was added. Drives "newest" sort. */
  createdAt: string;
  /** Lower number = earlier in the curated "featured" order. */
  featuredRank: number;
  /** Where the record came from. Shopify data is treated as verified. */
  source: 'development' | 'shopify';
}

export interface CollectionSummary {
  handle: string;
  title: string;
  description: string;
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'title';
