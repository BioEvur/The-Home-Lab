import 'server-only';
import type { Product } from '@/lib/catalog/types';
import { storefrontFetch } from './client';
import { mapProduct, type ShopifyProduct } from './mappers';
import { PRODUCT_QUERY, PRODUCTS_QUERY } from './queries';

const COUNTRY = process.env.SHOPIFY_COUNTRY_CODE ?? 'IE';

export async function fetchShopifyProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let cursor: string | null = null;
  // A curated catalogue is small; page through everything once and cache it.
  for (let page = 0; page < 20; page++) {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: ShopifyProduct[] } } =
      await storefrontFetch(PRODUCTS_QUERY, { variables: { cursor, country: COUNTRY }, tags: ['products'] });
    all.push(...data.products.nodes.map(mapProduct));
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return all.map((p, i) => ({ ...p, featuredRank: i + 1 }));
}

export async function fetchShopifyProduct(handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: ShopifyProduct | null }>(PRODUCT_QUERY, {
    variables: { handle, country: COUNTRY },
    tags: ['products', `product:${handle}`],
  });
  return data.product ? mapProduct(data.product) : null;
}
