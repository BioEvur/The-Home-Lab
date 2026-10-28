import type { Money, Product, ProductVariant } from './catalog/types';

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: string, digits: 0 | 2) {
  const key = `${currency}-${digits}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
    formatters.set(key, fmt);
  }
  return fmt;
}

/** Formats minor units (cents). Whole amounts drop the decimals: €1,290 rather than €1,290.00. */
export function formatMoney(money: Money | number, currencyCode: Money['currencyCode'] = 'EUR') {
  const amount = typeof money === 'number' ? money : money.amount;
  const currency = typeof money === 'number' ? currencyCode : money.currencyCode;
  return formatter(currency, amount % 100 === 0 ? 0 : 2).format(amount / 100);
}

export function priceRange(product: Product) {
  const amounts = product.variants.map((v) => v.price.amount);
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
}

export function isOnSale(variant: Pick<ProductVariant, 'price' | 'compareAtPrice'>) {
  return Boolean(variant.compareAtPrice && variant.compareAtPrice.amount > variant.price.amount);
}

export function isAvailable(product: Product) {
  return product.variants.some((v) => v.availableForSale);
}

export function formatDimensions(d: NonNullable<Product['dimensions']>) {
  const parts: string[] = [];
  if (d.width) parts.push(`W ${d.width}`);
  if (d.depth) parts.push(`D ${d.depth}`);
  if (d.height) parts.push(`H ${d.height}`);
  if (d.diameter) parts.unshift(`Ø ${d.diameter}`);
  return parts.length ? `${parts.join(' × ')} cm` : null;
}

export function readingTime(words: number) {
  return Math.max(1, Math.round(words / 220));
}
