/**
 * Local catalogue search. When Shopify is connected, `lib/commerce` uses the
 * Storefront API `search` and `predictiveSearch` queries instead and this
 * remains the development fallback.
 */
import { COLLECTIONS } from '@/lib/content/collections';
import type { Product } from './types';

const SYNONYMS: Record<string, string[]> = {
  couch: ['sofa'],
  settee: ['sofa'],
  lamp: ['lamp', 'light', 'lighting'],
  light: ['lamp', 'light', 'lighting'],
  lights: ['lamp', 'light', 'lighting'],
  nightstand: ['bedside'],
  dresser: ['chest', 'drawers'],
  tv: ['media'],
  bookcase: ['shelving', 'shelves'],
  bookshelf: ['shelving', 'shelves'],
  mug: ['cups'],
  mugs: ['cups'],
  blanket: ['throw'],
  pillow: ['cushion'],
  plates: ['dinnerware', 'plates'],
  wood: ['oak', 'wood'],
  wooden: ['oak', 'wood'],
};

export function normalise(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(query: string) {
  return normalise(query)
    .split(' ')
    .filter((t) => t.length > 1 && !['the', 'and', 'for', 'a', 'with'].includes(t));
}

function stem(t: string) {
  return t.length > 4 ? t.replace(/(es|s)$/, '') : t;
}

function fieldScore(haystack: string, term: string, weight: number) {
  if (!haystack) return 0;
  const words = haystack.split(' ');
  if (words.includes(term)) return weight;
  if (words.some((w) => w.startsWith(term))) return weight * 0.7;
  if (term.length > 3 && haystack.includes(term)) return weight * 0.4;
  return 0;
}

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = tokens(query);
  if (!terms.length) return [];
  const scored = products.map((p) => {
    const fields = {
      title: normalise(p.title),
      type: normalise(p.productType),
      category: normalise(p.category.replace(/-/g, ' ')),
      tags: normalise(p.tags.join(' ')),
      materials: normalise([...p.materials, ...p.materialFamilies].join(' ')),
      colours: normalise(p.colours.map((c) => `${c.value} ${c.family}`).join(' ')),
      body: normalise(`${p.shortDescription} ${p.description}`),
    };
    let total = 0;
    for (const raw of terms) {
      const alternatives = [stem(raw), ...(SYNONYMS[raw] ?? [])];
      const best = Math.max(
        ...alternatives.map(
          (t) =>
            fieldScore(fields.title, t, 10) +
            fieldScore(fields.type, t, 8) +
            fieldScore(fields.tags, t, 6) +
            fieldScore(fields.category, t, 5) +
            fieldScore(fields.materials, t, 4) +
            fieldScore(fields.colours, t, 4) +
            fieldScore(fields.body, t, 1),
        ),
      );
      // Every term must match something: "oak lamp" should not return every oak product.
      if (best === 0) return { p, score: 0 };
      total += best;
    }
    return { p, score: total };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.p.featuredRank - b.p.featuredRank)
    .map((s) => s.p);
}

export function searchCollections(query: string) {
  const terms = tokens(query).map(stem);
  if (!terms.length) return [];
  return COLLECTIONS.filter((c) => {
    const hay = normalise(`${c.title} ${c.navLabel} ${c.intro}`);
    return terms.some((t) => fieldScore(normalise(c.title), t, 1) > 0 || (t.length > 3 && hay.split(' ').includes(t)));
  });
}

export const POPULAR_SEARCHES = ['Sofa', 'Oak', 'Table lamp', 'Coffee', 'Linen', 'Storage'];
