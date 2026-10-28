/**
 * Pure catalogue filtering and sorting. Runs on the server against whichever
 * catalogue is active, and only exposes facets the current products can
 * actually satisfy.
 */
import { COLLECTIONS } from '@/lib/content/collections';
import type { Product, SortKey } from './types';

export type FacetKey = 'category' | 'colour' | 'material' | 'price' | 'size' | 'availability';

export interface FilterState {
  category: string[];
  colour: string[];
  material: string[];
  price: string[];
  size: string[];
  inStock: boolean;
  sort: SortKey;
  page: number;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  swatch?: string;
}

export interface Facet {
  key: FacetKey;
  label: string;
  options: FacetOption[];
}

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'title', label: 'Name, A to Z' },
];

const PRICE_BANDS = [
  { value: 'under-50', label: 'Under €50', min: 0, max: 5000 },
  { value: '50-150', label: '€50 to €150', min: 5000, max: 15000 },
  { value: '150-500', label: '€150 to €500', min: 15000, max: 50000 },
  { value: '500-1000', label: '€500 to €1,000', min: 50000, max: 100000 },
  { value: 'over-1000', label: 'Over €1,000', min: 100000, max: Infinity },
];

/** Footprint bands use the widest measurement (width or diameter). */
const SIZE_BANDS = [
  { value: 'compact', label: 'Up to 60 cm wide', min: 0, max: 60 },
  { value: 'medium', label: '60 to 130 cm wide', min: 60, max: 130 },
  { value: 'large', label: 'Over 130 cm wide', min: 130, max: Infinity },
];

type Params = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined) {
  if (!value) return [];
  return (Array.isArray(value) ? value : value.split(',')).map((v) => v.trim()).filter(Boolean);
}

export function parseFilters(params: Params): FilterState {
  const sortParam = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortKey) : 'featured';
  const pageParam = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  return {
    category: list(params.category),
    colour: list(params.colour),
    material: list(params.material),
    price: list(params.price),
    size: list(params.size),
    inStock: params.availability === 'in-stock',
    sort,
    page: Number.isFinite(pageParam) && pageParam > 1 ? Math.floor(pageParam) : 1,
  };
}

export function hasActiveFilters(f: FilterState) {
  return Boolean(f.category.length || f.colour.length || f.material.length || f.price.length || f.size.length || f.inStock);
}

const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price.amount));
const footprint = (p: Product) => p.dimensions?.width ?? p.dimensions?.diameter ?? null;

function matches(product: Product, f: FilterState, skip?: FacetKey) {
  if (skip !== 'category' && f.category.length && !f.category.some((c) => product.collections.includes(c))) return false;
  if (skip !== 'colour' && f.colour.length && !product.colours.some((c) => f.colour.includes(slug(c.family)))) return false;
  if (skip !== 'material' && f.material.length && !product.materialFamilies.some((m) => f.material.includes(slug(m)))) return false;
  if (skip !== 'price' && f.price.length) {
    const price = minPrice(product);
    if (!PRICE_BANDS.some((b) => f.price.includes(b.value) && price >= b.min && price < b.max)) return false;
  }
  if (skip !== 'size' && f.size.length) {
    const w = footprint(product);
    if (w === null || !SIZE_BANDS.some((b) => f.size.includes(b.value) && w >= b.min && w < b.max)) return false;
  }
  if (skip !== 'availability' && f.inStock && !product.variants.some((v) => v.availableForSale)) return false;
  return true;
}

export function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function applyFilters(products: Product[], f: FilterState) {
  return sortProducts(
    products.filter((p) => matches(p, f)),
    f.sort,
  );
}

export function sortProducts(products: Product[], sort: SortKey) {
  const sorted = [...products];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return sorted.sort((a, b) => minPrice(a) - minPrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => minPrice(b) - minPrice(a));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

function countBy(products: Product[], f: FilterState, key: FacetKey, keysOf: (p: Product) => string[]) {
  const counts = new Map<string, number>();
  for (const p of products) {
    if (!matches(p, f, key)) continue;
    for (const k of new Set(keysOf(p))) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/**
 * Builds facets from the base product set. A facet is only returned when it
 * can meaningfully narrow the results (at least two options exist).
 */
export function buildFacets(base: Product[], f: FilterState, opts: { includeCategory: boolean }): Facet[] {
  const facets: Facet[] = [];

  if (opts.includeCategory) {
    const counts = countBy(base, f, 'category', (p) => [p.category]);
    const options = COLLECTIONS.filter((c) => counts.has(c.handle) || f.category.includes(c.handle)).map((c) => ({
      value: c.handle,
      label: c.title,
      count: counts.get(c.handle) ?? 0,
    }));
    if (options.length > 1) facets.push({ key: 'category', label: 'Category', options });
  }

  {
    const swatches = new Map<string, { label: string; swatch: string }>();
    base.forEach((p) => p.colours.forEach((c) => swatches.set(slug(c.family), { label: c.family, swatch: c.swatch })));
    const counts = countBy(base, f, 'colour', (p) => p.colours.map((c) => slug(c.family)));
    const options = [...swatches.entries()]
      .map(([value, { label, swatch }]) => ({ value, label, swatch, count: counts.get(value) ?? 0 }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (options.length > 1) facets.push({ key: 'colour', label: 'Colour', options });
  }

  {
    const labels = new Map<string, string>();
    base.forEach((p) => p.materialFamilies.forEach((m) => labels.set(slug(m), m)));
    const counts = countBy(base, f, 'material', (p) => p.materialFamilies.map(slug));
    const options = [...labels.entries()]
      .map(([value, label]) => ({ value, label, count: counts.get(value) ?? 0 }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (options.length > 1) facets.push({ key: 'material', label: 'Material', options });
  }

  {
    const counts = countBy(base, f, 'price', (p) => {
      const price = minPrice(p);
      return PRICE_BANDS.filter((b) => price >= b.min && price < b.max).map((b) => b.value);
    });
    const present = PRICE_BANDS.filter((b) => base.some((p) => minPrice(p) >= b.min && minPrice(p) < b.max));
    const options = present.map((b) => ({ value: b.value, label: b.label, count: counts.get(b.value) ?? 0 }));
    if (options.length > 1) facets.push({ key: 'price', label: 'Price', options });
  }

  {
    const withSize = base.filter((p) => footprint(p) !== null);
    const present = SIZE_BANDS.filter((b) => withSize.some((p) => footprint(p)! >= b.min && footprint(p)! < b.max));
    const counts = countBy(withSize, f, 'size', (p) =>
      SIZE_BANDS.filter((b) => footprint(p)! >= b.min && footprint(p)! < b.max).map((b) => b.value),
    );
    const options = present.map((b) => ({ value: b.value, label: b.label, count: counts.get(b.value) ?? 0 }));
    if (options.length > 1) facets.push({ key: 'size', label: 'Width', options });
  }

  {
    const anyUnavailable = base.some((p) => !p.variants.some((v) => v.availableForSale));
    if (anyUnavailable) {
      const count = base.filter((p) => matches(p, f, 'availability') && p.variants.some((v) => v.availableForSale)).length;
      facets.push({ key: 'availability', label: 'Availability', options: [{ value: 'in-stock', label: 'Available to order', count }] });
    }
  }

  return facets;
}

export function paginate<T>(items: T[], page: number) {
  const visible = items.slice(0, page * PAGE_SIZE);
  return { visible, hasMore: items.length > visible.length, total: items.length };
}
