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
            lineItems: { nodes: { id: string }[] };
          }[];
        };
      } | null;
    }>(
      `query($id: ID!) { customer(id: $id) { orders(first: 25, sortKey: PROCESSED_AT, reverse: true) { nodes {
         id name processedAt displayFinancialStatus displayFulfillmentStatus statusPageUrl
         currentTotalPriceSet { shopMoney { amount currencyCode } }
         lineItems(first: 50) { nodes { id } } } } } }`,
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
    }));
    return { status: 'ok', orders };
  } catch {
    return { status: 'error' };
  }
}
