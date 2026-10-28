'use client';
/**
 * Analytics integration point. Events are forwarded to the configured
 * provider only after the visitor has consented to analytics; otherwise they
 * are dropped. No provider is configured by default.
 */
import { readConsent } from './consent';

export type AnalyticsEvent =
  | { name: 'view_item'; handle: string; price: number }
  | { name: 'view_item_list'; list: string; count: number }
  | { name: 'search'; term: string; results: number }
  | { name: 'add_to_cart'; variantId: string; quantity: number; price: number }
  | { name: 'remove_from_cart'; variantId: string; quantity: number }
  | { name: 'add_to_wishlist'; handle: string }
  | { name: 'begin_checkout'; value: number; items: number }
  | { name: 'newsletter_signup' };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  if (!readConsent()?.analytics) {
    if (process.env.NODE_ENV === 'development') console.debug('[analytics:not-consented]', event);
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  const { name, ...params } = event;
  window.dataLayer.push({ event: name, ...params });
}
// Purchase events are recorded by Shopify's checkout (Web Pixels), not here,
// because the order is completed on Shopify's hosted checkout.
