# Architecture

## Overview

```
Browser ──► Next.js (App Router, server components + small client islands)
              │
              ├── src/lib/commerce  (server only) ──► Shopify Storefront API  (catalogue, cart → checkoutUrl)
              │                                   └─► Shopify Admin API       (orders, customer lookup)
              │
              └── src/lib/supabase  ──► Supabase Auth + Postgres (profiles, addresses, wishlist, newsletter, links)
```

- **Shopify is the system of record for commerce.** Products, prices, availability, discounts, checkout, payment, orders, tax and shipping rates all live in Shopify. The site never computes a final price, never takes payment and never creates orders itself.
- **Supabase is the system of record for identity.** There is one account system: Supabase Auth. Shopify is never asked to authenticate a customer.
- **The browser holds the basket.** It is stored in `localStorage` (`thl.basket.v1`) and is re-validated against the commerce layer (`POST /api/cart/validate`) when the basket opens. At checkout, `POST /api/checkout` builds a Shopify cart server-side and redirects to Shopify's `checkoutUrl`.

## Commerce modes

`src/lib/commerce/index.ts` is the only entry point pages use. It has two modes, chosen by `commerceMode()`:

| Mode | When | Catalogue | Checkout |
| --- | --- | --- | --- |
| `development` | `SHOPIFY_STORE_DOMAIN` or `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` missing | `src/lib/catalog/sample-data.ts` (35 sample products, illustrated) | Disabled. The button reads "Checkout not connected" and the API returns 503 with an explicit message |
| `shopify` | Both set | Storefront API, cached with the `products` tag and revalidated by webhook | `cartCreate` → redirect to the real Shopify checkout |

Both modes map into the same `Product` model (`src/lib/catalog/types.ts`), so pages, filters and search do not know which one is active. Money is always held in minor units (cents).

Product JSON-LD includes `offers` (price and availability) only when `product.source === 'shopify'`, so search engines never see sample prices.

## Identity and the Shopify customer link

Supabase handles sign-up, sign-in, email verification, password reset and sessions (cookie-based via `@supabase/ssr`, refreshed in `src/proxy.ts`). Passwords are only ever in `auth.users`, managed by Supabase.

Orders live in Shopify, so a signed-in customer needs a mapping to a Shopify customer:

1. When a customer with a **verified** email opens their orders, the server (`src/lib/commerce/orders.ts`) looks up a Shopify customer by that email through the Admin API, creating one if none exists.
2. The pair is stored in `commerce_customer_links` using the service-role key. Customers can read their own row but cannot write it, so nobody can attach themselves to someone else's Shopify customer.
3. Orders are read live from the Admin API for that customer. They are never copied into Supabase.
4. At checkout, a signed-in customer's verified email is passed as the cart's `buyerIdentity.email`, so the order attaches to the same Shopify customer.

### Trade-off: why not Shopify's Customer Account API?

Shopify's newer Customer Account API requires Shopify-hosted login (OAuth with Shopify as the identity provider). That would mean two logins or replacing Supabase Auth entirely. The brief asks for custom account pages and one account system, so this build uses Supabase as the only identity provider and links to Shopify by verified email.

The consequences to be aware of:

- **Email is the join key.** If a customer changes their email in Supabase, the link keeps the original Shopify customer. Changing the email on the Shopify customer is a manual or future automated step.
- **Guest orders placed with the same email** appear in the account once the email is verified. This is usually what customers expect, and it is the reason verification is required before linking.
- **Shopify's own order-status emails and pages** still work. The "Track" link on the account orders page opens Shopify's order status page (`statusPageUrl`).
- If you later prefer Shopify-hosted accounts, replace `src/lib/supabase` auth calls with the Customer Account API, keep Supabase only for the wishlist and preferences, and drop `commerce_customer_links`.

## Wishlist

Guests' wishlists live in `localStorage` (`thl.wishlist.v1`). On sign-in, `WishlistProvider` merges the guest list into `wishlist_items` (upsert, ignoring duplicates) and from then on reads and writes Supabase. It stores product handles only and looks up current product data at display time.

## Consent and analytics

`src/lib/consent.ts` stores choices in the `thl_consent` cookie (version 1, 6 months). Nothing non-essential loads until consent is given:

- Google Analytics loads only when the visitor has accepted analytics **and** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
- `track()` in `src/lib/analytics.ts` pushes events (`view_item`, `add_to_cart`, `search`, `view_item_list`, `begin_checkout` and others) to `dataLayer` only with analytics consent. Swap the transport there for another provider.

## Caching

- Catalogue fetches are tagged `products` and cached. `POST /api/webhooks/shopify` verifies Shopify's HMAC and calls `revalidateTag('products', 'max')` on product, collection and inventory topics.
- Basket validation and checkout always use `no-store` queries, so availability and prices at checkout time are fresh.
- Account pages, search and filtered listings render per request.

## Security notes

- Shopify tokens and the Supabase service-role key are read only in modules that import `server-only`. A build fails if one is imported into client code.
- All Supabase tables have row-level security (see `supabase/migrations/0001_init.sql`).
- Form endpoints validate on the server, have a per-IP rate limit (in memory, see LAUNCH.md), and the contact form has a honeypot, a minimum fill time and optional Cloudflare Turnstile.
- Security headers are set in `next.config.ts`. A Content Security Policy is not set yet; add one once analytics and Turnstile hosts are final.
