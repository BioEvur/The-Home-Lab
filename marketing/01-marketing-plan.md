# The Home Lab marketing plan

**Period:** 5 November 2026 to 31 January 2027, with the always-on system that continues after it.
**Market:** Republic of Ireland.
**Rule for every piece of marketing:** nobody appears on camera, nobody records a voice, and nothing depends on having a sample in hand. Everything is made from the supplier photos of the actual pieces, the brand fonts and colours, drawn plans, words, and (optionally) licensed stock footage of places.

Companion files: [02-social-posts.md](02-social-posts.md) (the first 50 posts, with finished creatives), [03-advertising-plan.md](03-advertising-plan.md) (paid media), [social-calendar.csv](social-calendar.csv) (scheduler import).

---

## 1. Summary

The Home Lab sells **room sets**: a corner of a real place, with every piece it needs, in one box, posted from Ireland. Two sets are on sale (Kyoto Kissaten €229, The Milanese €409), one opens in the new year (Riad Corner), and every piece is also sold on its own.

It is 5 November. **The Christmas batch closes on Tuesday 17 November**, 12 days away, and ships by 12 December. That date drives everything in the next fortnight.

What has to be true by 31 January:

1. **The Christmas batch sells through.** Every euro of attention in the first 12 days points at the 17 November cut-off.
2. **There is a way to keep selling after 17 November.** A second Christmas batch (recommended) and e-gift cards stop the shop going quiet during the biggest shopping weeks of the year (Black Friday is 27 November, after the cut-off).
3. **Riad Corner opens to a waiting list, not to silence.** January content builds an email list for it.
4. **The brand has its own proof.** Real customer photos (#MyHomeLabCorner), genuine reviews and a measured view of which posts and ads sell.

The approach in one line: **product truth plus place story.** Show the real pieces plainly, with honest prices and what each one does, and tell the story of the place they come from with words, colour, pattern and plans. That is cheaper and more believable than staged lifestyle shoots, and it suits a brand whose site already says "every piece has a job".

---

## 2. Where things stand

### What is for sale

| | Price | Pieces bought separately | Saving | Status |
| --- | --- | --- | --- | --- |
| Kyoto Kissaten (Japanese pour-over coffee counter) | €229 | €279 | €50 | On sale |
| The Milanese (Milan drinks console) | €409 | €484 | €75 | On sale |
| Riad Corner (Moroccan tea and reading corner) | Not announced | | | Opens in the new year |
| Single pieces | €24 to €149 | | | On sale |
| Tempo tub chair (add-on, Kyoto) | €229, or €189 with a set | | | Courier, separately |
| Manhattan console (add-on, Milanese) | €549, or €479 with a set | | | Courier, separately |

Gifts under €50: candle holders €24, Boston shaker €29, acacia board €32, glass dripper €38, blown glass vase €44.

Prices are taken from the shop's catalogue files on 5 November. The catalogue still calls them sample prices until supplier prices are confirmed: **confirm them before any ad runs**, then update `tools/posts.mjs` and re-render if anything changes.

### How ordering works (and why it is a selling point)

- Sets are pre-ordered in **batches**. Christmas: order by 17 November, ships by 12 December. After a batch closes, the shop says "packed to order and posted within three weeks".
- Delivery anywhere in the Republic of Ireland at a standard rate shown at checkout. **Posted from Ireland, so no customs, VAT or handling charges on the doorstep**, which matters to Irish shoppers burned by post-Brexit UK orders.
- Change or cancel free until the batch closes; 14 days to cancel after delivery; return whole sets or single pieces.
- Gifts can go straight to the recipient's address.
- Members get order tracking, saved addresses, a synced wishlist, launch alerts and a referral programme (€15 off for a friend, €15 credit for the member).

### What we already have to market with

- **Photos of the actual pieces**: every Kyoto and Milanese piece, both add-ons, a full Kyoto contents shot and two shots of the whole Milanese set (`public/images`). These are the backbone of every creative.
- **Words**: ten Journal guides (pour-over for beginners, what a kissaten is, console styling, Boston shaker cocktails, housewarming gifts, Christmas delivery in Ireland and more), a Christmas gift guide page and full set pages with stories, plans and guides.
- **A distinctive look**: ink, chalk, olive, clay and stone; Newsreader and Hanken Grotesk; square corners; drawn top-down plans of each set.
- **Emails**: branded templates already built for welcome, newsletter, launch alerts and referrals (Resend).

### What is missing

- **No social proof yet**: no reviews, customer photos, press or follower base. The plan does not pretend otherwise; it earns these from December.
- **No Riad Corner product photos**: its content uses type, the brand pattern, palette and plans until supplier photos arrive.
- **Launch blockers** (from `docs/LAUNCH.md`): the site is still in development stage (search engines are blocked), and Shopify, analytics, business details and social links have to be connected. See the launch gate in section 8.

### A naming risk to manage

"Home lab" (and **#homelab**) is a big tech hobby term for people running servers at home. So:

- Never use #homelab or #homelabs as a hashtag.
- Use a handle that includes `.ie` or `ireland`, for example **@thehomelab.ie**, the same on Instagram, TikTok and Pinterest (check availability today).
- Google ads need negative keywords for the tech meaning (server, rack, proxmox, NAS and so on; the full list is in the advertising plan).
- Always pair the name with what it is in bios and ads: "The Home Lab · room sets and home gifts, posted from Ireland".

---

## 3. Goals and targets

There is no sales history yet, so the targets are planning numbers to be replaced with real ones after the first week of data.

| Goal | Measure | Target by 31 Jan | Notes |
| --- | --- | --- | --- |
| Sell the Christmas batch | Sets ordered by 17 Nov | Set your number from the batch size you can buy and pack (planning range at the recommended budget: 15 to 33 orders from paid, plus organic, email and word of mouth) | See the planning model in the advertising plan |
| Keep selling after the cut-off | Orders 18 Nov to 24 Dec (second batch, pieces, e-gift cards) | At least the same again | Depends on decisions 1 and 2 below |
| Profitable acquisition | Blended cost per order (ad spend ÷ orders) | Kyoto under €70, Milanese under €120, blended under €80 | Recalculate once real landed costs are in (section 9) |
| Riad Corner demand | Waiting-list sign-ups | 500 | From posts 43 to 49, ads and email |
| Owned audience | Newsletter and member sign-ups | 1,000 | Every post and ad drives to the site, not just to a like |
| Social base | Instagram followers | 1,500 to 3,000 | A side effect, not the goal |
| Proof | Customer photos shared with permission | 15 | From #MyHomeLabCorner (post 39) and post-delivery emails |
| Proof | Genuine reviews | 25 | Requested 10 days after delivery |

---

## 4. Positioning

**For** people in Ireland who want one corner of their home to feel like somewhere they love, or want to give that as a gift,
**The Home Lab** sends a complete corner of a real place in one box, with every piece chosen to work together and a plan and guide to set it up,
**unlike** buying pieces one by one from different shops, which rarely comes together and often costs more.

**Brand line:** We bring places home.

**What we can prove** (use these, and only these):

- Every piece is listed with what it is, what it is for, its size and its care.
- Every set costs less than its pieces bought one by one (€50 less for Kyoto, €75 less for The Milanese).
- Posted from Ireland: no customs, VAT or handling charges on delivery.
- Fixed batch dates, shown before you pay.
- Free changes until the batch closes; 14 days to cancel after delivery; return a whole set or single pieces.
- Real makers and materials: Hario (founded in Tokyo in 1921), travertine stone, mouth-blown glass, cut crystal, acacia; Riad pieces made by hand in Morocco.
- Irish-owned.

**What we never say:** best-selling, limited stock, sold out, as seen in, customer favourite, or any review, rating, star or quote, until it is true. No "was" prices. No countdown timers except the real batch dates.

### Voice

The site's voice, carried into social: plain, warm and specific. Short sentences. Sentence case. Euro prices written in full. Irish English (colour, favourite). A little dry humour is fine; hype is not.

| Write | Don't write |
| --- | --- |
| "A thin spout for a slow, steady pour." | "The ultimate barista-grade kettle!!" |
| "€50 less than the pieces bought one by one." | "Huge savings! Was €279 now €229!" |
| "Order by 17 November. Ships by 12 December." | "Hurry, almost gone!" |
| "We sell one, so here's both sides." | "Everyone's obsessed with this grinder." |

### Messages by set

| | Kyoto Kissaten | The Milanese | Riad Corner |
| --- | --- | --- | --- |
| The moment | 7am, the first cup, made slowly | 7pm, the drink before dinner | Any time: low seating, lantern light, mint tea |
| Lead message | A Japanese coffee house, on your kitchen counter | Turn the main light off. Pour a drink. | Next stop: Marrakech |
| Who buys | Gift buyers for coffee lovers; café regulars who want to brew at home | Hosts, couples, new homeowners, family group gifts | People who love Morocco; reading-nook and bedroom-corner makers |
| Proof | Five named pieces, Hario grinder, brewing guide, €50 saving | Real travertine, cut crystal, mouth-blown glass, set-up guide, €75 saving | Handmade rug, pouf and lantern; every one different |
| Objections and answers | "Do I need anything else?" Only beans. "Is it hard?" Six steps; guide included. "Hand grinding?" About a minute per cup; we say so. | "No console?" The Manhattan console add-on, cheaper with the set. "Alcohol?" Not included; add your own. | "When?" Opening soon; join the list. "Why the wait?" Made by hand in Morocco. |

---

## 5. Who we are talking to

No customer photos or faces are needed to reach these people; the targeting and the words do the work.

1. **The coffee-lover's gift buyer.** 30 to 60, buying for a partner, parent or sibling who "knows their café order by heart". Shops on Facebook and Instagram, searches Google for "gifts for coffee lovers Ireland". Wants it to arrive on time with nothing to pay on delivery. *Lead set: Kyoto Kissaten; pieces €32 to €89.*
2. **The café regular going home-brew.** 25 to 45, city-based, follows coffee accounts, has a cafetière. Watches Reels and TikTok. Wants to know it is worth it, honestly. *Lead: Kyoto Kissaten, Hario grinder, gooseneck kettle.*
3. **The host and the new homeowner.** 28 to 45, often a couple, recently bought or rented (Irish first-time buyer mortgages are at their highest since 2007, per BPFI). Saves interiors posts on Instagram and Pinterest. Has a bare console or sideboard. *Lead: The Milanese, travertine lamp, wavy mirror.*
4. **The family group gift.** 45 to 65, parents or siblings clubbing together for a housewarming or a big Christmas present. Facebook first. *Lead: The Milanese, Kyoto Kissaten.*
5. **The travel nostalgic.** Any age; has been to Japan, Italy or Morocco and wants to bring it home. Interests in travel to those countries, Japanese culture, Italian design, Moroccan decor. *Lead: whichever set matches the place; Riad Corner waiting list.*
6. **The Kris Kindle shopper.** Anyone with a €20 to €50 office or family gift to buy in late November and December. *Lead: pieces under €50.*

---

## 6. How we make content without shoots

### The creative system

Four kinds of image, all already possible:

1. **The real pieces.** Supplier photos of the exact items, used as they are or set into brand layouts (`creatives/`). This is the only way a product appears.
2. **Words as the picture.** Large Newsreader type on chalk, ink, olive, clay or stone for ideas, facts, steps and deadlines.
3. **Drawn plans and palettes.** The top-down plans from the set pages, the colour palettes, and the Moroccan star pattern for Riad Corner.
4. **Places, optionally.** Licensed stock footage or photos of Kyoto, Milan and Marrakech (Pexels and Unsplash are free for commercial use; Storyblocks or Artgrid if you want more), always used as the place, never passed off as the product.

**Rules:**

- A product in a creative is always the real product. No edited, generated or "similar" product imagery in posts or ads.
- No AI-generated images or video. The posts here use none.
- Reels are silent by default; music is added in the app from the commercial library. If you ever want narration, use on-screen text instead of a voice.
- Confirm in writing that each supplier allows its photos to be used in social posts and ads (the add-on supplier has confirmed for the chair; ask the others the same question).

### Content pillars and mix

| Pillar | Share | What it does | Examples (post numbers) |
| --- | --- | --- | --- |
| Product truth | 20% | Shows exactly what is in the box and what it costs | 2, 5, 24, 49 |
| Place and culture | 20% | Gives the sets meaning; the reason to care | 4, 17, 30, 43, 44 |
| Ritual and how-to | 20% | Useful, saveable; earns reach and trust | 10, 20, 22, 33, 38, 45 |
| Gifting and deadlines | 25% (Nov and Dec) | Converts; real dates only | 7, 8, 13, 14, 18, 23, 29 |
| Styling | 10% | Interiors audience on Instagram and Pinterest | 6, 11, 32, 46, 48 |
| Brand, trust and community | 5 to 10% | Why us; customer photos | 1, 12, 16, 25, 39 |

From February, rebalance to roughly a third each of product, place and ritual, with gifting only around Valentine's Day (The Milanese) and Mother's Day (7 March 2027).

### Formats and where they go

| Format | Size | Instagram | Facebook | TikTok | Pinterest |
| --- | --- | --- | --- | --- | --- |
| Carousel | 1080 × 1350 | Feed | Feed | Photo mode (optional) | Multi-image pin |
| Reel | 1080 × 1920 | Reels | Reels | Video | Video pin |
| Static | 1080 × 1350, plus Story 1080 × 1920 | Feed and Stories | Feed | | Pin |
| Pin | 1000 × 1500 | | | | Standard pin |

### Getting real-home photos without a shoot

From 12 December, customers have sets at home. That is the photo library:

1. Post 39 asks for photos with **#MyHomeLabCorner**.
2. The shipping email and a follow-up email 10 days after delivery ask for a photo and a review.
3. Ask permission in writing (a DM reply "yes" is enough) before resharing; ask separately before using any photo in an ad.
4. From January, use the best ones in posts and as ad creative ("Your corners").

### Optional in January: creators, without anyone handling samples

Ship sets straight from the January batch to 5 to 10 Irish interiors or coffee creators, with a short brief (the set guide, three must-say facts, no claims beyond the site). Ask for paid usage rights for 90 days and run their posts as Partnership ads. Budget roughly €150 to €400 per creator plus the set. All posts labelled #ad or "Paid partnership".

---

## 7. Channels

| Channel | Role | Cadence | Main measure |
| --- | --- | --- | --- |
| **Instagram** | Main shop window: brand, products, Reels | 5 to 7 feed posts a week in Nov, 4 a week in Dec, 3 a week in Jan; Stories most days | Link clicks, saves, shares, sales by UTM |
| **Facebook** | Older gift buyers; mostly paid | Cross-post every feed post | Sales by UTM |
| **TikTok** | Reach with younger self-buyers | Cross-post every Reel | Views, profile visits, link clicks |
| **Pinterest** | Search and saves for interiors and gifts; slow-burn traffic that keeps going | Every static and carousel as pins, plus the 5 dedicated pins; 5 to 10 pins a week | Outbound clicks |
| **Google** | People already searching (gifts, pour-over, decanters, travertine lamps) | Always on | Sales, cost per sale |
| **Email** | Converts the people we have already reached | Weekly to 24 Dec, then fortnightly; automated flows | Revenue per email |
| **PR and partners** | Third-party proof | Pitch now for online gift guides; roasters in Nov | Mentions, referral traffic |

### Email

Built on the templates already in the repo (`emails/`).

- **Welcome** (exists): add the Christmas dates and a link to the gift guide while the batch is open.
- **Batch reminders** (preference already in member settings): 3 days before and on the morning of each cut-off.
- **Launch alerts** (exists): Riad Corner opening.
- **After purchase:** order confirmation (Shopify), "on its way" with the set-up guide link, and at 10 days after delivery a review and photo request.
- **Newsletter:** one a week until Christmas, then fortnightly. Each issue: one story (from the Journal), one product, one date.
- **Sign-up offer:** no discount (it would undercut the "no sales" stance). Offer what is real: batch reminders, first look at Riad Corner, and the Journal.

### PR and partnerships

- **Online gift guides** (print Christmas guides mostly closed in October; online ones run through December): Irish Times, Irish Independent, Image, The Gloss, RSVP, Her.ie, Lovin, District, House and Home. Send a short email with the three-line story ("Irish-owned shop that sends a corner of Kyoto or Milan in one box"), prices, the Christmas dates and a link to a press folder of the supplier photos. No samples needed for a gift-guide listing.
- **Irish speciality roasters:** the Kyoto set needs beans. Pitch a simple swap to two or three roasters (for example 3FE, Cloud Picker, Full Circle, Badger & Dodo, Imbibe): we recommend their beans in the set guide, Journal and set-delivery email; they mention the set to their customers. Later: a bundled bag of beans.
- **Interiors and coffee accounts:** reshare and comment genuinely; it is the cheapest reach there is.

### Community management

Answer every comment and DM within a working day. Saved replies (from the shop's own help pages):

- *Delivery to Ireland?* "We deliver anywhere in the Republic of Ireland. Delivery is shown at checkout before you pay, and as we post from Ireland there's nothing to pay on the doorstep."
- *Will it arrive for Christmas?* "Order by 17 November and every set ships by 12 December." (Update with the second batch dates if you add one.)
- *Can you send it to someone else?* "Yes, just put their name and address as the delivery address at checkout."
- *Northern Ireland or UK?* "Not at the moment. We deliver to the Republic of Ireland only."
- *Is alcohol included in The Milanese?* "No, the set is the drinks corner itself. You add your own drinks."
- *I don't have a console.* "The Manhattan console is on the set page as an add-on, cheaper with the set. It comes separately by courier, by the same date."
- *When does Riad Corner open?* "In the new year. Leave your email on the set page and we'll tell you first."
- *Returns?* "14 days after delivery to cancel without giving a reason, and you can return the whole set or single pieces."

---

## 8. The 90-day plan

### Launch gate: before any money is spent on ads

All of these must be true, or ad money is wasted:

- [ ] The site is in production stage (`NEXT_PUBLIC_SITE_STAGE=production`), indexable, on thehomelab.ie.
- [ ] Shopify is connected and a real test order has gone through checkout and been refunded.
- [ ] Prices confirmed and matching the creatives.
- [ ] Tracking works after cookie consent: GA4, Meta pixel, Pinterest tag (and TikTok if used) on the storefront, plus purchase tracking from Shopify checkout. The storefront is headless, so Shopify's sales-channel apps only cover checkout. GA4 is already wired behind the cookie banner (set `NEXT_PUBLIC_GA_MEASUREMENT_ID`); the Meta pixel and Pinterest tag still need adding the same way.
- [ ] Business details, contact email and social links filled in (`.env.example`).

### Phase 0: today and tomorrow (5 to 6 November)

- [ ] Claim the same handle on Instagram, Facebook, TikTok and Pinterest (suggested: **@thehomelab.ie**). Switch Instagram and TikTok to business accounts.
- [ ] Bio: "Room sets and home gifts. A corner of Kyoto, Milan or Marrakech, in one box. Posted from Ireland. Christmas orders close 17 Nov." Add up to five links in the Instagram bio: Christmas sets, gift guide, Journal.
- [ ] Profile image: the logo mark in olive on chalk (`src/app/icon.svg`).
- [ ] Meta Business account: page, Instagram, ad account, pixel, domain verification for thehomelab.ie, payment method.
- [ ] Shopify sales channels: Facebook and Instagram (catalogue, checkout events), Google and YouTube (Merchant Center feed), Pinterest. Check every product link in the feeds points to thehomelab.ie, not the myshopify.com address.
- [ ] Load `social-calendar.csv` into a scheduler (Meta Business Suite is free for Instagram and Facebook; Later, Metricool or Buffer cover TikTok and Pinterest too).
- [ ] Make the five decisions below.
- [ ] Send the gift-guide pitch email to the press list and the roaster pitch.

### Decisions needed

| # | Decision | Recommended | Decide by | Affects |
| --- | --- | --- | --- | --- |
| 1 | A second Christmas batch | Yes: orders close Monday 30 November (Cyber Monday), ships by Friday 18 December, if suppliers can deliver. It is one line in `src/lib/content/batches.ts`. | 12 Nov | Posts 16, 28; ads in Phase 2 |
| 2 | E-gift cards | Yes, from 1 December, in €25 steps (Shopify gift card product, shown on the site) | 30 Nov | Posts 34, 37, 40; ads in Dec |
| 3 | Christmas returns window | Extend to 15 January for orders placed in November and December, so gifts can be returned after they are opened | 10 Nov | Trust messaging (post 12) |
| 4 | Ad budget level | The recommended level (€4,500 over three months; see the advertising plan) | Today | Advertising plan |
| 5 | Riad Corner opening date | Pick a date once supplier lead times are confirmed; announce it in posts 43 to 49 | 20 Dec | January content |

Every post that depends on decisions 1 or 2 has a finished alternate creative and caption, so nothing is blocked.

### Phase 1: the Christmas batch (6 to 17 November)

**Goal:** fill the Christmas batch.
**Social:** posts 1 to 15. Daily posting; Stories every day with the countdown from 12 November.
**Paid:** prospecting from day one with the Kyoto reel, the Milanese static and the coffee gift carousel; retargeting from day three; a deadline push on 15 to 17 November. Google Search and Shopping always on. Pinterest from 12 November.
**Email:** welcome flow live; "five days left" on 12 November; "last day" on the morning of 17 November.
**PR:** gift-guide pitches out by 6 November; follow up on 11 November.

### Phase 2: gifting season (18 November to 24 December)

**Goal:** keep selling after the cut-off through the second batch, small gifts and e-gift cards; get customer photos started.
**Social:** posts 16 to 41. Black Friday is answered with "No Black Friday sale here" (post 25), which turns the brand's honesty into the message.
**Paid:** second-batch push 18 to 30 November; under-€50 catalogue ads for Kris Kindle; e-gift cards from 7 to 24 December; brand reels kept on low.
**Email:** weekly; second-batch deadline; e-gift cards; "on its way" emails with set-up guides; review and photo requests from 22 December.
**Customer care:** post 36 answers "where is my order" before it is asked.

### Phase 3: new year and Riad Corner (26 December to 31 January)

**Goal:** January sales from gift-card redemptions and new-home buyers; a 500-person waiting list for Riad Corner.
**Social:** posts 42 to 50, then continue with the same pillars (three posts a week).
**Paid:** Riad waiting-list campaign; Kyoto "slower first cup"; new-home audiences; customer photos and reviews as ad creative once permitted.
**Email:** Riad teaser sequence; gift-card reminder ("Got a Home Lab gift card?").
**Optional:** creator seeding from the January batch.

### Key dates

| Date | What |
| --- | --- |
| Fri 6 Nov | Launch post |
| Thu 12 Nov | Countdown starts (5 days) |
| **Tue 17 Nov** | **Christmas batch closes at midnight** |
| Fri 27 Nov | Black Friday (post 25) |
| Mon 30 Nov | Cyber Monday; second batch closes (if decision 1 is yes) |
| Mon 7 Dec | E-gift card push starts (if decision 2 is yes) |
| Sat 12 Dec | Christmas batch shipped |
| Fri 18 Dec | Second batch shipped; #MyHomeLabCorner post |
| Thu 24 Dec | Last e-gift card day; Nollaig shona |
| Sat 2 Jan | New-year Kyoto post |
| Tue 5 Jan | Riad Corner teaser starts |
| Sun 14 Feb | Valentine's Day (The Milanese: an evening for two) |
| Sun 7 Mar | Mother's Day in Ireland |

---

## 9. Money

### Unit economics: fill in the real numbers

Ads are only worth running if each order makes money after the ad cost. Once the real landed cost of each set is known, work out:

- **Price before VAT** = price ÷ 1.23
- **Contribution per order** = price before VAT − landed cost of the pieces − packaging − payment fees (delivery is charged separately)
- **Break-even cost per order** = contribution per order
- **Break-even ROAS** = price (with VAT) ÷ contribution per order

Worked example, *assuming* the pieces, packaging and fees come to 55% of the price before VAT (replace with your own figure):

| | Kyoto Kissaten | The Milanese |
| --- | --- | --- |
| Price | €229 | €409 |
| Before VAT | €186.18 | €332.52 |
| Assumed costs (55%) | €102.40 | €182.89 |
| Contribution per order | €83.78 | €149.63 |
| Break-even cost per order | €84 | €150 |
| Break-even ROAS | 2.7 | 2.7 |
| **Target cost per order** | **€70** | **€120** |

Known add-on costs for reference: Tempo chair €90 ex VAT trade plus €17 courier; Manhattan console €238.80 ex VAT trade, courier to confirm.

### Budget

Three levels for 6 November to 31 January; the split by channel and campaign is in the [advertising plan](03-advertising-plan.md).

| | Lean | **Recommended** | Growth |
| --- | --- | --- | --- |
| Paid media | €2,000 | **€4,500** | €9,000 |
| Tools (scheduler, stock footage, reviews and survey apps: free tiers are enough to start) | €0 to €150 | €150 | €300 |
| Creators (January, optional) | €0 | €0 to €1,000 | €2,000 |

---

## 10. Measurement

### Tracking

- **UTM tags** on every link (already in `social-calendar.csv`): `utm_source` = network, `utm_medium` = social or paid, `utm_campaign` = phase (`xmas-batch`, `gifting`, `new-year`), `utm_content` = post number or ad name.
- **Shopify** is the source of truth for orders and revenue. Ad platforms will under-count, because they only see visitors who accept cookies.
- **A one-question survey after checkout:** "How did you first hear about us?" (Instagram, Facebook, TikTok, Pinterest, Google, a friend, press, other). It catches what tracking misses, especially word of mouth.

### The weekly numbers (every Monday, 30 minutes)

| Area | Numbers |
| --- | --- |
| Sales | Orders and revenue by set and piece; average order value; orders by source (UTM and survey) |
| Paid | Spend, cost per order, ROAS, CTR, CPM, frequency, by campaign and by creative |
| Site | Sessions, add-to-basket rate, checkout rate, conversion rate |
| Social | Reach, saves, shares, link clicks, follower growth; the top three and bottom three posts |
| Owned | Email sign-ups, email revenue, Riad waiting list, referral sign-ups |
| Proof | Reviews, customer photos received and cleared |

Then decide three things: which creative gets more money, which post idea to repeat, and what to stop.

### What good looks like (starting benchmarks; replace with your own after two weeks)

| Measure | Healthy | Act if |
| --- | --- | --- |
| Instagram save rate on carousels | Over 2% of reach | Under 0.5%: the idea isn't useful enough |
| Reel 3-second hold | Over 60% | Under 40%: change the first frame |
| Ad click-through (link) | Over 1% | Under 0.6% after €30: replace the creative |
| Site conversion rate (paid traffic) | 1% to 2% | Under 0.5%: check the landing page, price and delivery cost |
| Cost per order | Under target (section 9) | Over 1.5× target after €100: pause |

---

## 11. Staying on the right side of the rules

- **Price claims:** compare the set with its pieces bought separately, which the shop really sells at those prices. Never show "was" prices; under the EU price-indication rules a "was" price must be the lowest price of the previous 30 days.
- **Urgency:** use only real batch and Christmas dates. No invented scarcity or fake timers (unfair commercial practices).
- **Alcohol:** The Home Lab sells barware, not drink. In ads, avoid showing anyone drinking, avoid branded bottles, and target 25+. Do not put alcohol recipes in paid ads (post 20 stays organic, with a drinkaware.ie line). TikTok does not allow alcohol in ads: use the cuts without drinks.
- **Paid partnerships:** label creator content #ad or "Paid partnership", following the ASAI code and CCPC guidance on influencer marketing.
- **Privacy:** tags and pixels only after cookie consent (the site already works this way); email marketing only with consent (the site uses double opt-in).
- **Images:** supplier photos only with the supplier's permission; stock footage only under its licence and never presented as the product.
- **Trademarks:** "Hario" is used to describe the grinder honestly. Don't use Hario's logo or imply a partnership.
- **Riad Corner:** no payment taken before it opens; waiting list only.

---

## 12. The weekly routine (about 6 to 8 hours a week)

| When | What | Time |
| --- | --- | --- |
| Monday | Weekly numbers; adjust ad budgets; schedule the week's posts from the CSV | 1.5 h |
| Every day | Comments and DMs; one or two Stories (reshare the day's post, a countdown, a customer photo) | 20 min |
| Wednesday | Newsletter | 1 h |
| Thursday | Pinterest: pin the week's statics and carousels | 30 min |
| Friday | Ads check: pause losers, raise winners by 20% | 30 min |
| Monthly | Next month's posts (copy `tools/posts.mjs` entries, change words and photos, re-render) | 3 h |

---

## 13. Risks

| Risk | What we do |
| --- | --- |
| Launch slips past the first week | Hold ads until the launch gate is passed; post the organic content anyway, compressing posts 1 to 7 into fewer days |
| Supplier delay on the Christmas batch | Email customers early and honestly; offer to cancel with a full refund; do not promise a date you cannot keep |
| Ads don't convert at first | Usual for a new brand with no proof; move money to retargeting and Google Search, test the trust carousel (post 12) and price carousel (post 5) |
| "Home lab" tech confusion | Distinct handle, no #homelab, negative keywords, always say what we sell |
| No second batch possible | Use the alternate creatives; lean on pieces under €50 and e-gift cards in December |
| Platform rejects a Milanese ad for alcohol | Use the creatives without the decanter (posts 11, 23 and 26) |
| Customer photo used without permission | Written permission first, every time; a separate yes for ads |
