# Design system

All tokens live in `src/styles/tokens.css`. Components use tokens, never raw hex values.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | #171918 | Text, primary buttons, footer, dark editorial bands |
| `--chalk` | #F5F3EE | Page background, text on dark |
| `--olive` | #59634D | Brand mark, add-to-basket, focus rings, accents |
| `--clay` | #B96E50 | Sparing accent: journal categories, sale prices, development notes |
| `--stone` | #D8D5CD | Rules, borders, quiet surfaces |

The five brand colours are used exactly as on the board. A few derived tones exist only where contrast requires them:

| Token | Hex | Why | Contrast on chalk |
| --- | --- | --- | --- |
| `--ink-soft` | #3A3D3A | Secondary text | 9.9:1 |
| `--ink-muted` | #5D605B | Tertiary text, counts, meta | 5.8:1 |
| `--clay-text` | #93513A | Clay at small sizes, clay badges | 5.4:1 |
| `--olive-deep` | #48503D | Olive hover state | |
| `--error` | #9B3B2A | Form errors | 6.2:1 |

Plain `--clay` on chalk is 3.5:1, so it is only used for large display type (24px and up), dots and borders, never body-size text. Chalk on olive (primary actions) is 5.7:1.

## Type

- **Newsreader** (roman, optical sizes) for headlines, room names, product titles and journal body text. Set light (350) with tight tracking so large sizes read like a printed interiors title.
- **Hanken Grotesk** for interface text, navigation, prices and buttons.
- Sentence case everywhere. Spaced capitals are kept for the wordmark only (`--track-logo`), so the logo stays the one place they appear.
- No italic accent words, no small labels stacked over every heading, no decorative numbering.
- Sizes are fluid `clamp()` tokens from `--fs-display` (up to 140px) down to `--fs-xs`.

Font files are self-hosted by Next.js at build time. No request goes to Google from the visitor's browser.

## Logo

`src/components/brand/Logo.tsx` holds the mark, redrawn as SVG from the brand board, with exports `LogoMark`, `Wordmark` and `Logo` (`horizontal` or `stacked`). The mark keeps its 132.5 × 94 aspect ratio at every size and is never stretched. The favicon (`src/app/icon.svg`) is the mark in olive on chalk.

**Before launch:** replace the redrawn paths with the master vector from the brand files if they differ.

## Layout

- Max content width 1520px, fluid gutters (16px on phones up to 48px).
- Square corners (2px radius). No pill buttons, no rounded cards.
- Photography leads. Every page that is not a utility page opens with a full-bleed photograph and the headline set on it (home, collections, about, journal). The header turns transparent over the homepage photograph.
- Sections vary in rhythm on purpose: a horizontal room strip, an editorial photo split with a short product list, full-bleed bands, a lead-plus-four new-in grid, image-led lists, alternating journal rows. Product grids are used only where products are being compared.
- The product page stacks large photographs beside a sticky purchase panel on desktop and becomes a swipe strip on phones. A room photograph from the product's collection closes the sequence.
- Room sets lead the site. The homepage opens on a triptych of the three places, and each set page reads like a short chapter: place and moment over a full-bleed photograph, the story, the pieces with what each one does, a drawn plan of how they sit, and a short guide. Each set has its own accent colour (`--set-accent` in `sets.css`), used only for small labels and the plan, never for buttons.
- Main breakpoints: 640, 768, 900 and 1024px, with a few component-level ones up to 1400px.

## Components

| Area | Components |
| --- | --- |
| Buttons | `.button--primary` (ink), `--accent` (olive), `--secondary` (outline), `--small`, `--block`; `.arrow-link`, `.text-button` |
| Forms | `TextField`, `TextArea`, `SelectField`, `Checkbox`, `FormStatus` in `src/components/forms/Field.tsx`. Labels are always visible; errors are linked with `aria-describedby` |
| Feedback | Badges (`.badge`, `--clay`, `--light`), the announcer and toasts (`useAnnounce`), skeletons |
| Overlays | `Drawer` (native `<dialog>`: basket, filters, mobile menu, search, cookie preferences) |
| Commerce | `ProductCard`, `ProductList`, `Price`, `QuickAdd`, `WishlistButton`, `ProductView`, `CartLines`, `ProductRail` |

## Motion

Restrained and purposeful: 160 to 560ms with ease-out curves.

- Page entrance: a short fade and rise (`template.tsx`).
- Scroll reveals: one shared IntersectionObserver. Content is visible by default and only animates once JavaScript has loaded.
- Drawers slide; the basket count bumps when an item is added; the wishlist heart pops when saved.
- With `prefers-reduced-motion: reduce`, durations collapse to 1ms and reveals are disabled.

## Imagery

The development build uses stand-in photography from Unsplash (free for commercial use under the [Unsplash licence](https://unsplash.com/license)). Every photo is listed in one file, `src/lib/content/media.ts`: `SCENES` for rooms and editorial moments, `PRODUCT_PHOTOS` for one photo per sample product. Change an id there and it changes everywhere.

The photos were chosen by description to match each product and room. They are not the items being sold, and product pages label them "Sample photo, not the exact item". Once Shopify is connected, product images come from Shopify automatically; room and editorial photography stays in `media.ts` until replaced with commissioned images.

Images load from Unsplash's CDN at the requested width (`unsplashLoader`), so no extra image hosting is needed in development.

Photography direction that will suit this system: natural daylight, warm neutrals, real rooms rather than studio sets, one clear subject per frame, and space around products.
