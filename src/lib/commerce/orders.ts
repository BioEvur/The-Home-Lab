import 'server-only';
import type { User } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isShopifyAdminConfigured } from './config';
import { adminFetch } from './shopify/client';

/**
 * Identity mapping between Supabase (who the customer is) and Shopify (what
 * they ordered). See docs/ARCHITECTURE.md for the full rationale.
 *
 *  - A Supabase user is linked to exactly one Shopify customer record in
 *    `commerce_customer_links`, written only by the server (service role).
 *  - Links are created only for verified email addresses, and checkout
 *    passes the same verified email as the cart's buyer identity.
 *  - Orders are always read live from Shopify; Supabase never stores copies.
 */
export interface OrderSummary {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  total: { amount: string; currencyCode: string };
  lineCount: number;
  statusUrl: string | null;
  /** Numeric part of the Shopify id, used in /account/orders/[id]. */
  number: string;
  images: { url: string; alt: string }[];
}

export interface OrderDetail extends OrderSummary {
  subtotal: { amount: string; currencyCode: string } | null;
  shipping: { amount: string; currencyCode: string } | null;
  discounts: { amount: string; currencyCode: string } | null;
  tax: { amount: string; currencyCode: string } | null;
  lines: { title: string; variant: string | null; quantity: number; total: { amount: string; currencyCode: string }; image: { url: string; alt: string } | null }[];
  shippingAddress: string[] | null;
  tracking: { company: string | null; number: string | null; url: string | null }[];
  cancelledAt: string | null;
}

export type OrdersResult =
  | { status: 'ok'; orders: OrderSummary[] }
  | { status: 'not-configured' }
  | { status: 'unverified' }
  | { status: 'error' };

async function ensureCustomerLink(user: User): Promise<string | null> {
  const admin = getSupabaseAdminClient();
  if (!admin || !user.email || !user.email_confirmed_at) return null;

  const { data: existing } = await admin
    .from('commerce_customer_links')
    .select('shopify_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing?.shopify_customer_id) return existing.shopify_customer_id as string;

  const found = await adminFetch<{ customers: { nodes: { id: string }[] } }>(
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`,
    { q: `email:"${user.email.replace(/"/g, '')}"` },
  );
  let customerId: string | null = found.customers.nodes[0]?.id ?? null;
  if (!customerId) {
    const created = await adminFetch<{ customerCreate: { customer: { id: string } | null } }>(
      `mutation($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { message } } }`,
      { input: { email: user.email } },
    );
    customerId = created.customerCreate.customer?.id ?? null;
  }
  if (customerId) {
    await admin.from('commerce_customer_links').upsert({ user_id: user.id, shopify_customer_id: customerId, email: user.email });
  }
  return customerId;
}

export async function getOrdersForUser(user: User): Promise<OrdersResult> {
  if (!isShopifyAdminConfigured() || !getSupabaseAdminClient()) return { status: 'not-configured' };
  if (!user.email_confirmed_at) return { status: 'unverified' };
  try {
    const customerId = await ensureCustomerLink(user);
    if (!customerId) return { status: 'ok', orders: [] };
    const data = await adminFetch<{
      customer: {
        orders: {
          nodes: {
            id: string;
            name: string;
            processedAt: string;
            displayFinancialStatus: string | null;
            displayFulfillmentStatus: string | null;
            statusPageUrl: string | null;
            currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
            lineItems: { nodes: { id: string; image: { url: string; altText: string | null } | null }[] };
          }[];
        };
      } | null;
    }>(
      `query($id: ID!) { customer(id: $id) { orders(first: 25, sortKey: PROCESSED_AT, reverse: true) { nodes {
         id name processedAt displayFinancialStatus displayFulfillmentStatus statusPageUrl
         currentTotalPriceSet { shopMoney { amount currencyCode } }
         lineItems(first: 50) { nodes { id image { url(transform: { maxWidth: 160 }) altText } } } } } } }`,
      { id: customerId },
    );
    const orders = (data.customer?.orders.nodes ?? []).map((o) => ({
      id: o.id,
      name: o.name,
      processedAt: o.processedAt,
      financialStatus: o.displayFinancialStatus,
      fulfillmentStatus: o.displayFulfillmentStatus,
      total: o.currentTotalPriceSet.shopMoney,
      lineCount: o.lineItems.nodes.length,
      statusUrl: o.statusPageUrl,
      number: o.id.split('/').pop() ?? o.id,
      images: o.lineItems.nodes.flatMap((l) => (l.image ? [{ url: l.image.url, alt: l.image.altText ?? '' }] : [])).slice(0, 4),
    }));
    return { status: 'ok', orders };
  } catch {
    return { status: 'error' };
  }
}

type Money = { amount: string; currencyCode: string };
const money = (set: { shopMoney: Money } | null | undefined) => set?.shopMoney ?? null;

export type OrderResult = { status: 'ok'; order: OrderDetail } | { status: 'not-found' } | Exclude<OrdersResult, { status: 'ok' }>;

/** One order, only if it belongs to the signed-in customer. */
export async function getOrderForUser(user: User, number: string): Promise<OrderResult> {
  if (!isShopifyAdminConfigured() || !getSupabaseAdminClient()) return { status: 'not-configured' };
  if (!user.email_confirmed_at) return { status: 'unverified' };
  if (!/^\d{1,20}$/.test(number)) return { status: 'not-found' };
  try {
    const customerId = await ensureCustomerLink(user);
    if (!customerId) return { status: 'not-found' };
    const data = await adminFetch<{
      order: {
        id: string;
        name: string;
        processedAt: string;
        cancelledAt: string | null;
        customer: { id: string } | null;
        displayFinancialStatus: string | null;
        displayFulfillmentStatus: string | null;
        statusPageUrl: string | null;
        currentTotalPriceSet: { shopMoney: Money };
        currentSubtotalPriceSet: { shopMoney: Money } | null;
        totalShippingPriceSet: { shopMoney: Money } | null;
        currentTotalDiscountsSet: { shopMoney: Money } | null;
        currentTotalTaxSet: { shopMoney: Money } | null;
        shippingAddress: { formatted: string[] } | null;
        fulfillments: { trackingInfo: { company: string | null; number: string | null; url: string | null }[] }[];
        lineItems: { nodes: { id: string; title: string; variantTitle: string | null; quantity: number; originalTotalSet: { shopMoney: Money }; image: { url: string; altText: string | null } | null }[] };
      } | null;
    }>(
      `query($id: ID!) { order(id: $id) {
         id name processedAt cancelledAt customer { id } displayFinancialStatus displayFulfillmentStatus statusPageUrl
         currentTotalPriceSet { shopMoney { amount currencyCode } }
         currentSubtotalPriceSet { shopMoney { amount currencyCode } }
         totalShippingPriceSet { shopMoney { amount currencyCode } }
         currentTotalDiscountsSet { shopMoney { amount currencyCode } }
         currentTotalTaxSet { shopMoney { amount currencyCode } }
         shippingAddress { formatted(withName: true) }
         fulfillments { trackingInfo { company number url } }
         lineItems(first: 50) { nodes { id title variantTitle quantity originalTotalSet { shopMoney { amount currencyCode } } image { url(transform: { maxWidth: 240 }) altText } } } } }`,
      { id: `gid://shopify/Order/${number}` },
    );
    const o = data.order;
    // Never show another customer's order, even if someone guesses its number.
    if (!o || o.customer?.id !== customerId) return { status: 'not-found' };
    const images = o.lineItems.nodes.flatMap((l) => (l.image ? [{ url: l.image.url, alt: l.image.altText ?? '' }] : []));
    return {
      status: 'ok',
      order: {
        id: o.id,
        number,
        name: o.name,
        processedAt: o.processedAt,
        cancelledAt: o.cancelledAt,
        financialStatus: o.displayFinancialStatus,
        fulfillmentStatus: o.displayFulfillmentStatus,
        statusUrl: o.statusPageUrl,
        total: o.currentTotalPriceSet.shopMoney,
        subtotal: money(o.currentSubtotalPriceSet),
        shipping: money(o.totalShippingPriceSet),
        discounts: money(o.currentTotalDiscountsSet),
        tax: money(o.currentTotalTaxSet),
        lineCount: o.lineItems.nodes.length,
        images: images.slice(0, 4),
        lines: o.lineItems.nodes.map((l) => ({
          title: l.title,
          variant: l.variantTitle,
          quantity: l.quantity,
          total: l.originalTotalSet.shopMoney,
          image: l.image ? { url: l.image.url, alt: l.image.altText ?? l.title } : null,
        })),
        shippingAddress: o.shippingAddress?.formatted ?? null,
        tracking: o.fulfillments.flatMap((f) => f.trackingInfo),
      },
    };
  } catch {
    return { status: 'error' };
  }
}
