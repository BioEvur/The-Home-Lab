# The Home Lab storefront

Storefront for The Home Lab, an Irish home and lifestyle shop. It is built with Next.js (App Router, TypeScript) and uses Shopify for the catalogue, basket checkout and orders, and Supabase for customer accounts.

It runs **without any external services**. With no environment variables set, it uses a 35-product development catalogue and stand-in photography (listed in `src/lib/content/media.ts`). Checkout, accounts, newsletter and contact show clear "not connected" states instead of pretending to work.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
npm test             # catalogue, filter, search, variant and money tests
```

Requires Node 22 or later. Copy `.env.example` to `.env.local` to connect services. Every variable is optional and explained in that file.

## Documentation

| File | What it covers |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the pieces fit, the Shopify and Supabase boundary, the identity mapping and its trade-offs |
| [docs/SHOPIFY.md](docs/SHOPIFY.md) | Store setup, API scopes, product metafields, collections and webhooks |
| [docs/SUPABASE.md](docs/SUPABASE.md) | Project setup, the migrations, auth settings, member tables and row-level security |
| [docs/EMAIL.md](docs/EMAIL.md) | Resend setup, the email templates, Supabase SMTP and sending a newsletter |
| [docs/LAUNCH.md](docs/LAUNCH.md) | What works now, what uses development data, what needs external services, the launch checklist and QA results |
| [docs/DESIGN.md](docs/DESIGN.md) | Brand tokens, type, layout and component conventions |

## Project layout

```
src/app/              Routes (App Router). API routes in src/app/api.
src/components/       UI, grouped by area: brand, layout, commerce, account, forms, editorial, consent, ui
src/lib/catalog/      Product model, development catalogue, filtering, search, variants
src/lib/commerce/     Server-only commerce layer: Shopify client, checkout, orders
src/lib/supabase/     Browser, server and service-role clients, session proxy
src/lib/content/      Collections, journal, navigation, help and policy drafts
src/lib/config/site.ts Business details, all null until confirmed
src/styles/           tokens.css (brand palette), base, components, commerce, pages
supabase/migrations/  Database schema with row-level security
scripts/              Illustration generator
tests/                node:test suites
```

## Development stage

`NEXT_PUBLIC_SITE_STAGE=development` (the default) does three things: it shows the development notice, it shows unconfirmed business and legal details as "To confirm" markers, and it blocks indexing through `robots.txt` and a `noindex` meta tag. Set it to `production` only when everything in [docs/LAUNCH.md](docs/LAUNCH.md) is done.

## Hosting on Cloudflare Workers

The site runs on Cloudflare Workers through the OpenNext adapter (`open-next.config.ts`, `wrangler.jsonc`). `npm run preview` builds and serves it locally in the Workers runtime; `npm run deploy` builds and deploys it. Deploying needs `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit, Workers Routes: Edit, Zone: Read on thehomelab.ie) and `CLOUDFLARE_ACCOUNT_ID`. Set the variables from `.env.example` as Worker secrets with `npx wrangler secret put NAME`.
