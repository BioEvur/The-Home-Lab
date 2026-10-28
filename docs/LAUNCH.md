# Launch status and checklist

## What works now, with no services connected

- Every route in the brief renders, on phones (320px and up) through wide desktops.
- Browsing: home, shop all, seven room and category pages, product pages, search (overlay with live suggestions and a results page), journal, about, help centre, FAQs and policy drafts.
- Filtering and sorting by category, colour, material, price band, width and availability, with the state kept in the URL (shareable, survives refresh, works with the back button). Facets only appear when the products in view have that data.
- Variant selection on product pages and quick add: the chosen variant decides the price, image, availability and what goes in the basket. Unavailable variants are shown struck through and cannot be added.
- Basket drawer and basket page: quantities, removal, line and subtotal maths, saved on the device, re-validated against the catalogue.
- Guest wishlist saved on the device, with move-to-basket.
- Recently viewed products.
- Cookie banner and preferences, with nothing non-essential loaded before consent.
- Form validation on every form (sign in, register, password reset, addresses, profile, newsletter, contact).
- SEO: titles and descriptions per page, canonical URLs, Open Graph image, sitemap, breadcrumbs JSON-LD, Article JSON-LD, WebSite search JSON-LD. Indexing is blocked while the stage is `development`.
- Real 404 status for unknown products, collections and pages.

## What is development data

| Item | Where | Replace with |
| --- | --- | --- |
| 35 sample products, prices, variants, stock states | `src/lib/catalog/sample-data.ts` | Shopify catalogue (automatic once connected) |
| All photography (Unsplash stand-ins, product photos labelled "Sample photo") | `src/lib/content/media.ts` | Product photography in Shopify; commissioned room and editorial photography in `media.ts` |
| Journal articles (6, no author or date) | `src/lib/content/journal.ts` | Review and keep, edit, or move to a CMS; add real authors and dates only when true |
| Help and policy text | `src/lib/content/policies.ts` | Every `[[...]]` marker needs a confirmed answer; legal pages need a solicitor's review |
| About page copy | `src/app/about/page.tsx` | Confirm it reflects the business; no team, history or press has been invented |
| Business details | `NEXT_PUBLIC_*` variables in `.env.example` | Real contact, company and VAT details |

The sample prices are not real and are labelled "Sample price" on product pages. No reviews, ratings, press mentions, delivery promises, return windows, free-delivery thresholds, stock counts or supplier claims appear anywhere on the site.

## What needs external services

| Feature | Needs | Until then |
| --- | --- | --- |
| Live catalogue and checkout | Shopify Storefront token (SHOPIFY.md) | Sample catalogue; checkout button reads "Checkout not connected" and nothing is created |
| Discount codes | Shopify | Code is noted and passed to Shopify checkout; nothing is validated on the site |
| Order history | Shopify Admin token + Supabase service role | Account orders page explains it is not connected |
| Accounts, profile, addresses, account wishlist | Supabase (SUPABASE.md) | Forms validate but show "accounts are not connected yet" |
| Newsletter | Supabase service role (or swap `src/app/api/newsletter/route.ts` for your email provider) | Form says sign-up is not connected yet and the address was not saved |
| Contact form | `CONTACT_WEBHOOK_URL` | Form says it is not connected yet and the message was not sent |
| Spam protection | Cloudflare Turnstile keys (optional) | Honeypot, timing check and rate limit only |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (or another provider in `src/lib/analytics.ts`) | Events are only pushed to `dataLayer` after consent, and nothing is sent |
| Transactional email | Custom SMTP in Supabase; Shopify notification settings | Supabase's test email service |

## Launch checklist

**Business and legal**
- [ ] Registered company name, number, VAT number and address (environment variables).
- [ ] Customer service email, phone, hours and an agreed response time.
- [ ] Every `[[...]]` marker in help and policy pages resolved; privacy, cookies, terms, returns and delivery reviewed by a solicitor.
- [ ] Delivery area, rates and lead times set in Shopify and reflected in the delivery pages.
- [ ] Returns process, costs and refund timing confirmed.
- [ ] Cookie policy updated with the chosen analytics provider, its cookies and durations.

**Commerce**
- [ ] Shopify connected and products published to the Headless channel with `thl` metafields (SHOPIFY.md).
- [ ] Collections created with the seven handles.
- [ ] Room set products created in the `room-sets` collection with the handles in `src/lib/content/sets.ts`, bundled with their pieces; set and piece prices confirmed so the set costs less than its pieces.
- [ ] Payments, taxes, shipping and checkout branding configured; test orders completed and refunded.
- [ ] Webhooks added and `SHOPIFY_WEBHOOK_SECRET` set.

**Accounts**
- [ ] Supabase project in an EU region, migration applied, URL and redirect settings, custom SMTP, branded emails.
- [ ] End-to-end test: register, verify, sign in, reset password, add address, save wishlist as a guest then sign in (merge), place an order with the same email and see it in Account › Orders.

**Content**
- [ ] Each room set photographed as a whole (the set pages currently use stock photos of similar scenes, chosen without being viewed, so check each one in `src/lib/content/media.ts`).
- [ ] Product and room photography replaces the Unsplash stand-ins; alt text written for each image. Until then, visitors' browsers load those photos from images.unsplash.com.
- [ ] Logo paths checked against the master vector.
- [ ] Journal reviewed; `NEXT_PUBLIC_ANNOUNCEMENT` set only to something true.

**Technical**
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain and `NEXT_PUBLIC_SITE_STAGE=production`.
- [ ] Replace the in-memory rate limiter (`src/lib/rate-limit.ts`) with a shared store if hosting on serverless or multiple instances.
- [ ] Add a Content Security Policy in `next.config.ts` once third-party hosts are final.
- [ ] Run Lighthouse or WebPageTest on the production deployment with real photography, and an accessibility audit (axe plus a manual screen-reader pass). These have **not** been run yet, so no performance or accessibility scores are claimed.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Error monitoring (for example Sentry) and uptime checks.

## QA performed on this build

Run against a production build (`next build && next start`) in Chromium.

- **Routes (re-run after the redesign):** 46 URLs, including every route in the brief, loaded at 1440, 1024, 768, 390 and 320px wide. All return 200 (or 404 where expected), each has exactly one `h1`, there are no JavaScript errors, and no page scrolls horizontally.
- **Interactions** (26 checks, all passing): cookie banner reject stores a consent cookie without analytics; no third-party requests are made before consent; choosing an unavailable variant disables Add to basket; the variant is kept in the URL; adding opens the basket drawer and updates the header count; subtotal maths for multiple quantities and products; Escape closes the drawer; removing a line updates the subtotal; checkout is disabled and labelled when Shopify is not connected; the basket survives a reload; the wishlist persists; a filter updates results and the URL and responds immediately; the back button undoes a filter; sort by price ascending; load more; the search overlay shows results and Enter goes to the results page; contact validation errors; mobile menu opens and closes on navigation; mobile filter drawer; reduced motion disables page animation.
- **Keyboard:** the first Tab reaches "Skip to content", then the logo and navigation, each with a visible 2px focus outline.
- **Automated tests:** `npm test` runs 11 tests on the catalogue, filters, facets, pagination, search, variant lookup and money formatting.

Fixed during QA:
- The search form overflowed at 320px.
- Product and collection URLs that do not exist now return a real 404 status instead of a 200 with a "not found" page.
- Bullet and number markers were appearing on navigation lists.
- Quick-add option panels were showing when closed.
- Filter checkboxes did not respond until results arrived.
- The product page buy row overflowed at 1024px.
- The homepage newsletter form duplicated the footer's.
- Clay badges were below AA contrast.

Not yet tested: real Shopify and Supabase connections (no credentials in this environment), Safari and Firefox, real devices, screen readers.
