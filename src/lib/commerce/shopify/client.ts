import 'server-only';
import { shopifyConfig } from '../config';

export class ShopifyError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}

interface FetchOptions {
  variables?: Record<string, unknown>;
  /** Cache tags so webhooks can revalidate (see app/api/webhooks/shopify). */
  tags?: string[];
  revalidate?: number | false;
  /** Mutations and customer data must never be cached. */
  cache?: 'no-store';
  buyerIp?: string;
}

/** Storefront API (catalogue, cart, checkout). Server-side only. */
export async function storefrontFetch<T>(query: string, options: FetchOptions = {}): Promise<T> {
  const url = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': shopifyConfig.storefrontPrivateToken,
      ...(options.buyerIp ? { 'Shopify-Storefront-Buyer-IP': options.buyerIp } : {}),
    },
    body: JSON.stringify({ query, variables: options.variables }),
    ...(options.cache
      ? { cache: options.cache }
      : { next: { tags: options.tags ?? ['shopify'], revalidate: options.revalidate ?? 300 } }),
  });
  if (!res.ok) throw new ShopifyError(`Storefront API responded ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new ShopifyError('Storefront API returned errors', json.errors);
  return json.data as T;
}

/** Admin API (order history, customer records). Server-side only, never cached. */
export async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const url = `https://${shopifyConfig.storeDomain}/admin/api/${shopifyConfig.apiVersion}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': shopifyConfig.adminAccessToken },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) throw new ShopifyError(`Admin API responded ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new ShopifyError('Admin API returned errors', json.errors);
  return json.data as T;
}
