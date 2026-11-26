import type { Product } from './types';
import type { RoomSetContent } from '@/lib/content/sets';
import type { GiftBox } from '@/lib/content/boxes';

/**
 * What a set costs against its pieces bought one by one, from the catalogue
 * prices (so it stays right once Shopify holds the prices).
 */
export function setOffer(set: RoomSetContent, products: Product[]) {
  const priceOf = (handle: string) => products.find((p) => p.handle === handle)?.variants[0]?.price.amount;
  const setPrice = priceOf(set.handle);
  if (setPrice === undefined) return null;
  const separately = set.pieces.reduce((n, p) => n + (priceOf(p.handle) ?? p.price), 0);
  return { setPrice, separately, saving: Math.max(0, separately - setPrice) };
}

export type SetOffer = NonNullable<ReturnType<typeof setOffer>>;


/** What a gift box costs against its pieces bought one by one. */
export function boxOffer(box: GiftBox, products: Product[]) {
  const priceOf = (handle: string) => products.find((p) => p.handle === handle)?.variants[0]?.price.amount;
  const boxPrice = priceOf(box.handle);
  if (boxPrice === undefined) return null;
  const separately = box.pieces.reduce((n, h) => n + (priceOf(h) ?? 0), 0);
  return { boxPrice, separately, saving: Math.max(0, separately - boxPrice) };
}
