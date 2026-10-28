import type { SampleProductSpec } from './sample-data';
import { ADD_ON_PRODUCTS, PIECE_PRODUCTS, SET_PRODUCTS } from './sample-sets';
import { TONES } from './tones';
import { PRODUCT_PHOTOS, photoUrl } from '@/lib/content/media';
import type { Product, ProductImage, ProductVariant } from './types';

const ART_WIDTH = 800;
const ART_HEIGHT = 1000;


function cartesian<T>(lists: T[][]): T[][] {
  return lists.reduce<T[][]>((acc, list) => acc.flatMap((prefix) => list.map((item) => [...prefix, item])), [[]]);
}

function buildProduct(spec: SampleProductSpec): Product {
  const toneOption = spec.options.find((option) => option.name === spec.toneOption);
  const toneValues = toneOption
    ? toneOption.values.map((value) => ({ label: value.label, tone: value.tone ?? spec.defaultTone }))
    : [{ label: null as string | null, tone: spec.defaultTone }];

  const photos = PRODUCT_PHOTOS[spec.handle] ?? [];
  const images: ProductImage[] = photos.map((photo, i) => ({
    id: `${spec.handle}-${i + 1}`,
    src: photoUrl(photo.id, 1600),
    alt: photo.alt,
    width: ART_WIDTH,
    height: ART_HEIGHT,
    // Unsplash stand-ins are samples; files in /public are the supplier's own photos.
    sample: !photo.id.startsWith('/'),
  }));

  const combos = spec.options.length ? cartesian(spec.options.map((o) => o.values.map((v) => ({ option: o.name, ...v })))) : [[]];

  const variants: ProductVariant[] = combos.map((combo, index) => {
    const title = combo.length ? combo.map((c) => c.label).join(' / ') : 'Default';
    const delta = combo.reduce((sum, c) => sum + (c.priceDelta ?? 0), 0);
    const skuSuffix = combo.map((c) => c.label.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()).join('-');
    return {
      id: `dev-${spec.handle}-${index + 1}`,
      sku: `DEV-${spec.handle.split('-').map((p) => p[0]).join('').toUpperCase()}${skuSuffix ? `-${skuSuffix}` : ''}`,
      title,
      selectedOptions: combo.map((c) => ({ name: c.option, value: c.label })),
      price: { amount: spec.basePrice + delta, currencyCode: 'EUR' },
      compareAtPrice: spec.compareAtPrice ? { amount: spec.compareAtPrice + delta, currencyCode: 'EUR' } : null,
      availableForSale: !(spec.unavailable ?? []).includes(title),
      imageId: images[0]?.id,
    };
  });

  const colours = toneValues.map(({ label, tone }) => ({
    value: label ?? spec.title,
    family: TONES[tone].family,
    swatch: TONES[tone].swatch,
  }));

  return {
    id: `dev-${spec.handle}`,
    handle: spec.handle,
    title: spec.title,
    productType: spec.productType,
    category: spec.category,
    collections: [spec.category, ...(spec.extraCollections ?? [])],
    shortDescription: spec.short,
    description: spec.description,
    features: spec.features,
    materials: spec.materials,
    materialFamilies: spec.materialFamilies,
    dimensions: spec.dimensions,
    weightKg: spec.weightKg,
    care: spec.care,
    assembly: spec.assembly,
    options: spec.options.map((o) => ({ name: o.name, values: o.values.map((v) => v.label) })),
    variants,
    images,
    colours,
    tags: spec.tags,
    relatedHandles: spec.related,
    isNew: Boolean(spec.isNew),
    createdAt: spec.createdAt,
    featuredRank: spec.rank,
    source: 'development',
  };
}

let cache: Product[] | null = null;

export function getLocalProducts(): Product[] {
  if (!cache) cache = [...SET_PRODUCTS, ...PIECE_PRODUCTS, ...ADD_ON_PRODUCTS].map(buildProduct);
  return cache;
}
