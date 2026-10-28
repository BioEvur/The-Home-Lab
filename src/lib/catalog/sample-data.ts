/**
 * Types for the development catalogue in `sample-sets.ts`, used to build and
 * test the storefront before Shopify is connected.
 */
import type { CategoryHandle, Dimensions } from './types';

/** Tones are shared with the illustration generator and the colour filter. */
export type Tone =
  | 'oak'
  | 'smoked-oak'
  | 'walnut'
  | 'black'
  | 'chalk'
  | 'olive'
  | 'clay'
  | 'stone'
  | 'oat'
  | 'moss'
  | 'charcoal'
  | 'rust'
  | 'brass'
  | 'travertine'
  | 'graphite'
  | 'linen'
  | 'smoke-glass'
  | 'clear-glass'
  | 'opal';

export type ArtKind =
  | 'sofa'
  | 'armchair'
  | 'coffee-table'
  | 'side-table'
  | 'media-unit'
  | 'rug'
  | 'bed'
  | 'bedside'
  | 'bedding'
  | 'throw'
  | 'chest'
  | 'round-table'
  | 'chair'
  | 'bench'
  | 'dinnerware'
  | 'pendant'
  | 'floor-lamp'
  | 'table-lamp'
  | 'sconce'
  | 'portable-lamp'
  | 'shelving'
  | 'wall-shelf'
  | 'baskets'
  | 'peg-rail'
  | 'vase'
  | 'mirror'
  | 'cushion'
  | 'candles'
  | 'planter'
  | 'kettle'
  | 'grinder'
  | 'pour-over'
  | 'cups'
  | 'scale'
  | 'board';

export interface SampleOptionValue {
  label: string;
  /** Drives illustration colour and the colour filter. */
  tone?: Tone;
  /** Added to the base price, in cents. */
  priceDelta?: number;
}

export interface SampleProductSpec {
  handle: string;
  title: string;
  productType: string;
  category: CategoryHandle;
  extraCollections?: string[];
  short: string;
  description: string;
  features: string[];
  materials: string[];
  materialFamilies: string[];
  dimensions: Dimensions | null;
  weightKg: number | null;
  care: string | null;
  assembly: string | null;
  tags: string[];
  related: string[];
  isNew?: boolean;
  createdAt: string;
  rank: number;
  /** Legacy illustration kind; no longer used. */
  art?: ArtKind;
  /** Tone used when the product has no colour/finish option. */
  defaultTone: Tone;
  /** Name of the option whose values change the image (Colour or Finish). */
  toneOption?: string;
  options: { name: string; values: SampleOptionValue[] }[];
  basePrice: number;
  compareAtPrice?: number;
  /** Variant titles (e.g. "King / Walnut") that are unavailable in the sample data. */
  unavailable?: string[];
}
