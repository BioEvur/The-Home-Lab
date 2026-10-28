import 'server-only';
import { getLocalProducts } from '@/lib/catalog/local';
import type { Money } from '@/lib/catalog/types';
import { preorderCopy } from '@/lib/content/batches';
import { isShopifyConfigured } from './config';
import { storefrontFetch } from './shopify/client';
import { toMoney } from './shopify/mappers';
import { CART_CREATE_MUTATION, VARIANTS_QUERY } from './shopify/queries';

export interface CheckoutLineInput {
  variantId: string;
  quantity: number;
}

export interface VariantStatus {
  variantId: string;
  available: boolean;
  price: Money | null;
  compareAtPrice: Money | null;
  exists: boolean;
}

export const MAX_LINE_QUANTITY = 20;

/** Re-checks basket lines against the authoritative catalogue (prices and availability). */
export async function getVariantStatuses(ids: string[]): Promise<VariantStatus[]> {
  if (!isShopifyConfigured()) {
    const variants = new Map(getLocalProducts().flatMap((p) => p.variants.map((v) => [v.id, v] as const)));
    return ids.map((id) => {
      const v = variants.get(id);
      return {
        variantId: id,
        exists: Boolean(v),
        available: Boolean(v?.availableForSale),
        price: v?.price ?? null,
        compareAtPrice: v?.compareAtPrice ?? null,
      };
    });
  }
  type Node = { id: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; compareAtPrice: { amount: string; currencyCode: string } | null } | null;
  const data = await storefrontFetch<{ nodes: Node[] }>(VARIANTS_QUERY, {
    variables: { ids, country: process.env.SHOPIFY_COUNTRY_CODE ?? 'IE' },
    cache: 'no-store',
  });
  return ids.map((id, i) => {
    const node = data.nodes[i];
    return {
      variantId: id,
      exists: Boolean(node),
      available: Boolean(node?.availableForSale),
      price: node ? toMoney(node.price) : null,
      compareAtPrice: node?.compareAtPrice ? toMoney(node.compareAtPrice) : null,
    };
  });
}

export type CheckoutResult =
  | { ok: true; checkoutUrl: string; discountApplied: boolean | null }
  | { ok: false; code: 'COMMERCE_NOT_CONFIGURED' | 'INVALID_LINES' | 'SHOPIFY_ERROR'; message: string };

/**
 * Creates a Shopify cart from the basket and returns Shopify's hosted
 * checkout URL. Shopify recalculates every price, discount, tax and delivery
 * charge; nothing the browser sends is trusted for payment.
 */
export async function createCheckout(
  lines: CheckoutLineInput[],
  options: { discountCode?: string; email?: string; buyerIp?: string } = {},
): Promise<CheckoutResult> {
  if (!isShopifyConfigured()) {
    return {
      ok: false,
      code: 'COMMERCE_NOT_CONFIGURED',
      message: 'Checkout is not connected in this development build. No order has been created and no payment has been taken.',
    };
  }
  const cleaned = lines
    .filter((l) => typeof l.variantId === 'string' && l.variantId.startsWith('gid://shopify/ProductVariant/'))
    .map((l) => ({
      merchandiseId: l.variantId,
      quantity: Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(l.quantity))),
      // Every set is a pre-order; the note shows on the order in Shopify admin.
      attributes: [{ key: 'Pre-order', value: preorderCopy().basket }],
    }));
  if (!cleaned.length) return { ok: false, code: 'INVALID_LINES', message: 'Your basket has no items that can be checked out.' };

  type Result = {
    cartCreate: {
      cart: { checkoutUrl: string; discountCodes: { code: string; applicable: boolean }[] } | null;
      userErrors: { message: string }[];
    };
  };
  try {
    const data = await storefrontFetch<Result>(CART_CREATE_MUTATION, {
      cache: 'no-store',
      buyerIp: options.buyerIp,
      variables: {
        country: process.env.SHOPIFY_COUNTRY_CODE ?? 'IE',
        input: {
          lines: cleaned,
          discountCodes: options.discountCode ? [options.discountCode] : [],
          buyerIdentity: options.email ? { email: options.email, countryCode: process.env.SHOPIFY_COUNTRY_CODE ?? 'IE' } : undefined,
        },
      },
    });
    const { cart, userErrors } = data.cartCreate;
    if (!cart || userErrors.length) {
      return { ok: false, code: 'SHOPIFY_ERROR', message: userErrors[0]?.message ?? 'Checkout could not be started.' };
    }
    const discount = options.discountCode ? cart.discountCodes.find((d) => d.code.toLowerCase() === options.discountCode!.toLowerCase()) : null;
    return { ok: true, checkoutUrl: cart.checkoutUrl, discountApplied: discount ? discount.applicable : null };
  } catch {
    return { ok: false, code: 'SHOPIFY_ERROR', message: 'Checkout is temporarily unavailable. Please try again.' };
  }
}
