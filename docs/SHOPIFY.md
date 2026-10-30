# Connecting Shopify

The storefront reads the catalogue from the Storefront API and sends customers to Shopify's own checkout. Until the variables below are set it uses the development catalogue and checkout is disabled.

## 1. Store and sales channel

1. Create the store (or use the existing one) with the Republic of Ireland as the primary market and EUR as the currency.
2. Install the **Headless** sales channel and create a storefront. It gives you a **private access token** for server-side use.
3. Publish every product you want on the site to that Headless channel. Products not published there will not appear.

## 2. Admin API app (orders and account linking)

Create a custom app (Settings › Apps and sales channels › Develop apps) with these **Admin API** scopes:

| Scope | Why |
| --- | --- |
| `read_customers`, `write_customers` | Find a customer by verified email and create one if none exists |
| `read_orders` | Show order history in the account |
| `write_discounts` | Create the single-use €15 referral codes for members and their friends |

No other Admin scopes are needed. Install the app and copy the Admin API access token.

## 3. Environment variables (all server-only)

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_API_VERSION=2026-07
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=...   # Headless channel private token
SHOPIFY_ADMIN_ACCESS_TOKEN=...         # custom app Admin API token
SHOPIFY_WEBHOOK_SECRET=...             # see step 6
SHOPIFY_COUNTRY_CODE=IE                # @inContext country for prices and availability
```

None of these may be prefixed `NEXT_PUBLIC_`. They are only read in `src/lib/commerce/config.ts`, which imports `server-only`.

Once `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` are set, the whole catalogue switches to Shopify. The sample catalogue is no longer used. Baskets saved in browsers during development contain sample variant ids, and they will show as "no longer available" and be excluded from checkout.

## 4. Collections

The site's room and category pages use these collection handles. Create collections in Shopify with **exactly these handles** (titles can differ) and add products to them:

`living-room`, `bedroom`, `dining`, `lighting`, `storage`, `home-accessories`, `coffee-kitchen`

Editorial content for each (intro, guide, banner image, related rooms) lives in `src/lib/content/collections.ts`. A product may belong to several collections. Its primary category comes from the `thl.category` metafield, or else the first matching collection.

Tag a product `new` to show the "New" badge and include it in "New in".

### Room sets

Each room set is one Shopify product with a single variant, in a collection with the handle `room-sets`, product type `Room set`. Use the same handle as the set in `src/lib/content/sets.ts` (`kyoto-kissaten`, `the-milanese`, `riad-corner`). The set's story, photographs, layout plan and guide come from that file; the price, availability and basket line come from Shopify. A set page shows "Coming soon" with an email sign-up while its product is not available for sale.

### Pieces

Every piece in a set is also its own product, sold on its own at `/products/<handle>` and listed on `/shop`. Use the handles in `src/lib/content/sets.ts`, product type `Piece`, in a collection with the handle `pieces`, and give each piece the same price as `price` in `sets.ts` (the set pages and the "Buy as a set" boxes compare against it). Keep each set's price below the total of its pieces: `npm test` checks this for the sample catalogue. Use Shopify's Bundles app (or a bundle app of your choice) to link the set product to its pieces' inventory. `/products/<set-handle>` redirects to `/sets/<set-handle>`.

### Add-ons

Add-ons are larger pieces that go with a set but are delivered separately, such as the Tempo tub chair. They live in `src/lib/content/addons.ts`. In Shopify, create each one as a product with the same handle, product type `Add-on`, in a collection with the handle `add-ons`, at its full price (`price`: €229 for the chair, €549 for the Manhattan console).

The lower price with a set (`withSetPrice`: €189 for the chair, €479 for the console) is a discount, so checkout must apply it too. In Shopify admin, go to **Discounts → Create discount → Buy X get Y** and set it up as an automatic discount:

- Customer buys: any 1 item from the `room-sets` collection.
- Customer gets: 1 item from the `add-ons` collection, at a fixed amount off of €40 per item (the difference between `price` and `withSetPrice`).
- Set "Maximum number of uses per order" to unlimited, so two sets with two chairs get two discounts. The basket on the site gives one discount per room set in the same way.

Until that discount exists, the site's basket shows the lower total but Shopify's checkout would charge the full add-on price.

## 5. Product metafields

Create these product metafield definitions with namespace `thl` (Settings › Custom data › Products). Enable **Storefront API access** on each one, otherwise the Storefront API returns null.

| Key | Type | Used for | Example |
| --- | --- | --- | --- |
| `short_description` | Single line text | Card and page summary | `A low, deep three-seater with a tight back.` |
| `features` | JSON | Bullet list on the product page | `["Removable covers", "Felt floor protectors fitted"]` |
| `materials` | JSON | Materials panel | `["Solid oak frame", "Linen-cotton blend cover"]` |
| `material_families` | JSON | Material filter | `["Oak", "Linen"]` |
| `dimensions` | JSON | Dimensions panel, size filter | `{"width": 210, "depth": 92, "height": 78, "seatHeight": 44, "notes": "Legs are removable"}` (all cm) |
| `weight_kg` | Decimal | Specifications | `48` |
| `care` | Multi-line text | Care panel | |
| `assembly` | Multi-line text | Assembly panel | |
| `colour_families` | JSON | Colour filter grouping and swatches | `{"Oat": {"family": "Neutral", "swatch": "#D8CFBF"}}` |
| `category` | Single line text | Primary category | `living-room` |
| `related_products` | List of product references | "Pairs well with" | |

Anything missing is simply hidden: a product without `dimensions` has no dimensions panel and is not included in size filtering. Filters only appear when the products in view have data for them.

Colour options: the product option must be named **Colour**, **Color** or **Finish**. If `colour_families` is not set, Shopify's option swatch colour is used where one exists.

## 6. Webhooks (cache refresh)

Product pages are cached. To refresh them when products change, add webhooks (Settings › Notifications › Webhooks, JSON format) pointing at:

```
https://YOUR-DOMAIN/api/webhooks/shopify
```

for these topics: `products/create`, `products/update`, `products/delete`, `collections/update`, `inventory_levels/update`.

Also add `orders/fulfilled` to the same URL. When a referred member's first order ships, it marks the referral as rewarded and gives the member who invited them their €15 code.

Copy the signing secret into `SHOPIFY_WEBHOOK_SECRET`. Requests without a valid `X-Shopify-Hmac-Sha256` signature are rejected with 401.

## 7. Checkout settings in Shopify

These are configured in Shopify, not in this codebase, and must be set before launch:

- Payment providers (Settings › Payments).
- Shipping zones and rates (Settings › Shipping and delivery). The site says "delivery options and costs are shown at checkout" and makes no delivery promise of its own.
- Tax settings and whether prices include VAT.
- Checkout branding (logo, colours from `src/styles/tokens.css`) and the policy pages Shopify links from checkout.
- Customer accounts at checkout: set to **optional** or **classic** so guests can check out. Do not enable "new customer accounts" as the required login, since this site uses its own accounts (see ARCHITECTURE.md).
- Order confirmation and shipping emails.

## 8. Discount codes

The basket's discount field passes the code to `cartCreate` (`discountCodes`). Shopify decides whether it applies. The site does not show a discount amount until Shopify has applied it at checkout.

## Testing the connection

1. Set the variables and restart the server.
2. `/shop` should list your Shopify products. Product pages should show Shopify photography (no "Illustration" tag).
3. Add a product and press Checkout. You should land on `your-store.myshopify.com/cart/c/...` (or your checkout domain). Use Shopify's test payment mode or Bogus Gateway to complete a test order.
4. Sign up on the site with the same email, verify it, and open Account › Orders. The test order should appear.
