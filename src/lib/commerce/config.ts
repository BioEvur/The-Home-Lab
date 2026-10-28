import 'server-only';

/**
 * Integration switches. Each integration activates only when its required
 * environment variables are present; otherwise the storefront runs on the
 * development catalogue and shows explicit "not connected" states.
 */
export const shopifyConfig = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN ?? '',
  apiVersion: process.env.SHOPIFY_API_VERSION ?? '2026-07',
  /** Server-side Storefront API token (preferred). Never exposed to the browser. */
  storefrontPrivateToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? '',
  /** Admin API token, used only on the server for order history and customer linking. */
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? '',
  webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET ?? '',
};

export function isShopifyConfigured() {
  return Boolean(shopifyConfig.storeDomain && shopifyConfig.storefrontPrivateToken);
}

export function isShopifyAdminConfigured() {
  return Boolean(shopifyConfig.storeDomain && shopifyConfig.adminAccessToken);
}

export type CommerceMode = 'development' | 'shopify';

export function commerceMode(): CommerceMode {
  return isShopifyConfigured() ? 'shopify' : 'development';
}
