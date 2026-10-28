import 'server-only';
import { slug } from '@/lib/catalog/filtering';
import type { CategoryHandle, Dimensions, Money, Product, ProductColour } from '@/lib/catalog/types';
import { COLLECTIONS } from '@/lib/content/collections';

type Mf = { value: string } | null;
interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description: string;
  publishedAt: string;
  tags: string[];
  options: { name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  collections: { nodes: { handle: string }[] };
  images: { nodes: { id: string; url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: {
      id: string;
      sku: string | null;
      title: string;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
      price: ShopifyMoney;
      compareAtPrice: ShopifyMoney | null;
      image: { id: string } | null;
    }[];
  };
  shortDescription: Mf;
  features: Mf;
  materials: Mf;
  materialFamilies: Mf;
  dimensions: Mf;
  weight: Mf;
  care: Mf;
  assembly: Mf;
  colourFamilies: Mf;
  category: Mf;
  related: { references: { nodes: { handle?: string }[] } | null } | null;
}

export const toMoney = (m: ShopifyMoney): Money => ({
  amount: Math.round(parseFloat(m.amount) * 100),
  currencyCode: m.currencyCode === 'GBP' ? 'GBP' : 'EUR',
});

function json<T>(mf: Mf, fallback: T): T {
  if (!mf?.value) return fallback;
  try {
    return JSON.parse(mf.value) as T;
  } catch {
    return fallback;
  }
}

const CATEGORY_HANDLES = new Set(COLLECTIONS.map((c) => c.handle));

/** Maps a Storefront API product into the storefront's central product model. */
export function mapProduct(p: ShopifyProduct): Product {
  const collections = p.collections.nodes.map((c) => c.handle);
  const declared = p.category?.value;
  const category = (
    declared && CATEGORY_HANDLES.has(declared as CategoryHandle)
      ? declared
      : collections.find((h) => CATEGORY_HANDLES.has(h as CategoryHandle)) ?? 'home-accessories'
  ) as CategoryHandle;

  // Colour families: an explicit metafield mapping wins; otherwise option swatches.
  const familyMap = json<Record<string, { family: string; swatch: string }>>(p.colourFamilies, {});
  const colourOption = p.options.find((o) => /colou?r|finish/i.test(o.name));
  const colours: ProductColour[] = (colourOption?.optionValues ?? [])
    .map((v) => {
      const mapped = familyMap[v.name];
      if (mapped) return { value: v.name, family: mapped.family, swatch: mapped.swatch };
      if (v.swatch?.color) return { value: v.name, family: v.name, swatch: v.swatch.color };
      return null;
    })
    .filter((c): c is ProductColour => c !== null);

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    productType: p.productType,
    category,
    collections,
    shortDescription: p.shortDescription?.value ?? p.description.split('. ')[0],
    description: p.description,
    features: json<string[]>(p.features, []),
    materials: json<string[]>(p.materials, []),
    materialFamilies: json<string[]>(p.materialFamilies, []),
    dimensions: json<Dimensions | null>(p.dimensions, null),
    weightKg: p.weight?.value ? Number(p.weight.value) : null,
    care: p.care?.value ?? null,
    assembly: p.assembly?.value ?? null,
    options: p.options
      .filter((o) => !(o.name === 'Title' && o.optionValues.length === 1))
      .map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      sku: v.sku,
      title: v.title === 'Default Title' ? 'Default' : v.title,
      selectedOptions: v.selectedOptions.filter((o) => o.name !== 'Title'),
      price: toMoney(v.price),
      compareAtPrice: v.compareAtPrice ? toMoney(v.compareAtPrice) : null,
      availableForSale: v.availableForSale,
      imageId: v.image?.id,
    })),
    images: p.images.nodes.map((img) => ({
      id: img.id,
      src: img.url,
      alt: img.altText ?? p.title,
      width: img.width,
      height: img.height,
    })),
    colours,
    tags: p.tags,
    relatedHandles: (p.related?.references?.nodes ?? []).map((n) => n.handle).filter((h): h is string => Boolean(h)),
    isNew: p.tags.map(slug).includes('new'),
    createdAt: p.publishedAt.slice(0, 10),
    featuredRank: 0,
    source: 'shopify',
  };
}
