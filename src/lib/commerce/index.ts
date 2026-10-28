import 'server-only';
/**
 * The storefront's single data-access layer for catalogue data.
 *
 * Pages and components call these functions and never talk to Shopify or the
 * sample catalogue directly. When the Shopify environment variables are set,
 * the same functions return live Shopify data with no component changes.
 */
import { cache } from 'react';
import { getLocalProducts } from '@/lib/catalog/local';
import { searchCollections, searchProducts } from '@/lib/catalog/search';
import type { Product } from '@/lib/catalog/types';
import { commerceMode, isShopifyConfigured } from './config';
import { fetchShopifyProduct, fetchShopifyProducts } from './shopify/catalog';

export { commerceMode };

export const getProducts = cache(async (): Promise<Product[]> => {
  if (isShopifyConfigured()) return fetchShopifyProducts();
  return getLocalProducts();
});

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  if (isShopifyConfigured()) return fetchShopifyProduct(handle);
  return getLocalProducts().find((p) => p.handle === handle) ?? null;
});

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const products = await getProducts();
  return handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.collections.includes(handle));
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/** Explicit related products first, then the same category, never the product itself. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const explicit = product.relatedHandles
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is Product => Boolean(p));
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.handle !== product.handle && !explicit.includes(p),
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

export async function search(query: string) {
  const products = await getProducts();
  // With Shopify connected, swap to the Storefront `search` query here for
  // typo tolerance and merchandising; the result shape stays the same.
  return { products: searchProducts(products, query), collections: searchCollections(query) };
}
