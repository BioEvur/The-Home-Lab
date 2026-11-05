# The Home Lab advertising plan

Paid media for 6 November 2026 to 31 January 2027, in the Republic of Ireland. Read with the [marketing plan](01-marketing-plan.md); every ad uses a finished creative from [the first 50 posts](02-social-posts.md).

**Nothing in this plan needs anyone on camera, a recorded voice or a sample in hand.** Every ad is a supplier photo of the real piece, a brand type card, a drawn plan or a silent reel built from those.

---

## 1. Principles

1. **Don't spend until the launch gate is passed** (marketing plan, section 8): live site, a test order completed, tracking working after consent, prices confirmed.
2. **Sell the date, not a discount.** The Christmas batch cut-off (17 November) is the reason to buy now. The everyday saving against the pieces is the offer. No sales, no "was" prices.
3. **Few campaigns, few ad sets, many creatives.** At this budget, splitting money thin starves every ad set. Let the platforms pick among 4 to 6 creatives inside one ad set.
4. **Judge early on leading signals.** Purchases will be few at first. Judge creatives on click-through rate, cost per add-to-basket and cost per checkout until each has enough purchases to count.
5. **The product in an ad is always the real product.** Switch off every automatic AI "enhancement" the platforms offer (generated backgrounds, image expansion, AI text variations, auto-generated assets): they can change how the product looks, and the brand uses no AI imagery.
6. **Shopify is the truth.** Ad platforms only see visitors who accept cookies. Compare platform numbers with Shopify orders by UTM and the post-checkout "How did you hear about us?" answer.

---

## 2. Budget

### Three levels

| | Lean | **Recommended** | Growth |
| --- | --- | --- | --- |
| **Phase 1** · Christmas batch, 6–17 Nov (12 days) | €1,000 | **€1,800** | €3,300 |
| **Phase 2** · Gifting season, 18 Nov–24 Dec | €650 | **€1,800** | €3,700 |
| **Phase 3** · New year and Riad Corner, 26 Dec–31 Jan | €350 | **€900** | €2,000 |
| **Total** | **€2,000** | **€4,500** | **€9,000** |

Phase 1 gets the most per day because it is the only period with a guaranteed Christmas delivery date and the highest gift intent.

### By channel

| Channel | Lean | Recommended | Growth |
| --- | --- | --- | --- |
| Meta (Facebook and Instagram) | €1,450 (73%) | €3,000 (67%) | €5,800 (64%) |
| Google (Search and Shopping) | €550 (27%) | €1,040 (23%) | €1,900 (21%) |
| Pinterest | €0 | €460 (10%) | €750 (8%) |
| TikTok (Spark Ads) | €0 | €0 | €550 (6%) |

TikTok and Pinterest are organic-only at the Lean level. TikTok's minimum daily budget per ad group makes small tests inefficient, so it is paid only at Growth, and only to boost reels that already did well organically.

### Recommended budget, campaign by campaign

| Campaign | Phase | Dates | Daily | Total |
| --- | --- | --- | --- | --- |
| **Meta M1** Prospecting, Christmas sets | 1 | 6–17 Nov | €72 | €864 |
| **Meta M2** Retargeting (plus deadline push +€32/day on 15–17 Nov) | 1 | 6–17 Nov | €20 | €336 |
| **Meta M3** Seed reach (video views on posts 1, 2, 6) | 1 | 6–9 Nov | €25 | €100 |
| **Google G1** Search, non-brand | 1 | 6–17 Nov | €18 | €216 |
| **Google G2** Search, brand | 1 | 6–17 Nov | €2 | €24 |
| **Google G3** Shopping | 1 | 6–17 Nov | €10 | €120 |
| **Pinterest P1** Christmas consideration | 1 | 12–17 Nov | €23 | €140 |
| | | | **Phase 1** | **€1,800** |
| **Meta M4** Second batch (prospecting and retargeting) | 2 | 18–30 Nov | €37 | €480 |
| **Meta M5** Gifts under €50 | 2 | 20 Nov–10 Dec | €12 | €250 |
| **Meta M6** E-gift cards | 2 | 7–24 Dec | €18 | €320 |
| **Meta M2** Retargeting, always on | 2 | 18 Nov–24 Dec | €3 | €100 |
| **Google G1–G3** Search and Shopping | 2 | 18 Nov–24 Dec | €13 | €480 |
| **Pinterest P1** Gift consideration | 2 | 18 Nov–10 Dec | €7 | €170 |
| | | | **Phase 2** | **€1,800** |
| **Meta M7** Riad Corner waiting list | 3 | 5–31 Jan | €8 | €216 |
| **Meta M8** New year: Kyoto and new homes | 3 | 2–31 Jan | €10 | €300 |
| **Meta M2** Retargeting | 3 | 26 Dec–31 Jan | €1 | €34 |
| **Google G1–G3** | 3 | 26 Dec–31 Jan | €5.40 | €200 |
| **Pinterest P2** Riad Corner waiting list | 3 | 5–31 Jan | €5.50 | €150 |
| | | | **Phase 3** | **€900** |

If the second Christmas batch (decision 1) does not go ahead, move M4's €480 into M5 (gifts under €50) and M6 (e-gift cards). If e-gift cards (decision 2) don't go ahead, move M6 into M5 and Google Shopping.

### What to expect: a planning model

There is no history, so these are scenarios, not promises. Recommended budget, Phase 1 (€1,800), assuming an average order of about €240 (a mix of Kyoto Kissaten, The Milanese and single pieces):

| Scenario | Cost per order | Orders from ads | Revenue | ROAS |
| --- | --- | --- | --- | --- |
| Cautious | €120 | 15 | €3,600 | 2.0 |
| Expected | €80 | 22 | €5,280 | 2.9 |
| Good | €55 | 33 | €7,920 | 4.4 |

At the worked-example margins in the marketing plan, the expected case roughly breaks even on first orders in Phase 1. That is normal for a launch: the same money builds the retargeting audiences, trains the pixel and grows the email list, which is what makes Phases 2 and 3 cheaper per order. If after the first €600 the cost per order is above €150 with no sign of falling, cut M1 to €40 a day and move the difference to retargeting and Google Search.

---

## 3. Tracking setup (before day one)

The storefront is a headless Next.js site with Shopify's hosted checkout. That changes how tracking is installed:

| What | Where it is set up | Notes |
| --- | --- | --- |
| Purchase events (Meta, Google, Pinterest, TikTok) | Shopify: the Facebook and Instagram, Google and YouTube, Pinterest and TikTok apps, and Customer events | These cover the checkout and the thank-you page |
| Page views, product views, add to basket on the storefront | The site: `src/components/consent/CookieConsent.tsx` and `src/lib/analytics.ts` | GA4 is already wired and only loads after consent: set `NEXT_PUBLIC_GA_MEASUREMENT_ID`. The Meta pixel and Pinterest tag (and the TikTok pixel, if used) still need adding the same way, and the events in `analytics.ts` forwarding to them. Shopify's apps do **not** install on a headless storefront |
| Meta Conversions API | Shopify's Facebook and Instagram app (maximum data sharing) | Recovers some events lost to browsers and cookie choices |
| Google Ads conversions and GA4 | Shopify's Google and YouTube app plus GA4 on the storefront | Turn on enhanced conversions |
| Catalogue feeds | Shopify apps to Meta Commerce Manager, Google Merchant Center and Pinterest catalogues | **Check every product link points to thehomelab.ie**, not the myshopify.com address |
| Pre-order status in feeds | Merchant Center and Meta catalogue | Mark sets as `preorder` with an availability date (the ship-by date). Listing a pre-order as "in stock" breaks Merchant Center rules |
| Domain verification | Meta Business settings, Pinterest | Verify thehomelab.ie |
| UTMs on every ad | Ad-level URL parameters | `utm_source={platform}&utm_medium=paid&utm_campaign={campaign}&utm_content={ad}` |

Test it: place a real order through an ad click with consent accepted, and check the purchase appears in Shopify, Meta Events Manager, Google Ads and GA4 within a day.

---

## 4. Meta (Facebook and Instagram)

### Settings that apply to every campaign

- **Location:** Republic of Ireland, people living there.
- **Age:** 25 to 65+. (25+ also keeps the Milanese ads clear of alcohol-adjacent targeting rules.)
- **Placements:** Advantage+ placements, with a 4:5 and a 9:16 version of every creative. Reels are 9:16; statics have Story versions in `creatives/`; carousels are 4:5.
- **Optimisation:** Purchase. If a campaign has spent €150 with almost no purchases, temporarily optimise for Add to basket for 4 to 5 days to give the algorithm more signals, then switch back.
- **Advantage+ creative:** switch off generated backgrounds, image expansion, text improvements, image animation and added music. Keep only cropping and brightness adjustments if you want them.
- **Exclusions:** purchasers in the last 30 days, except from the e-gift card and Riad campaigns.
- **Naming:** `THL_{phase}_{objective}_{audience}` for campaigns, `{post}_{set}_{format}` for ads (for example `P02_kyoto_reel`), so reports read clearly.

### M1 · Prospecting, Christmas sets (Phase 1)

- **Objective:** Sales. One Advantage+ sales campaign or one manual sales campaign with one ad set.
- **Audience:** broad Ireland 25+, with audience suggestions: coffee, specialty coffee, Japanese culture, interior design, home decor, home improvement, cocktails, entertaining, gifts, recently moved.
- **Ads (6):** M-01 Kyoto reel, M-02 Kyoto static, M-04 Milanese static, M-05 Milanese reel, M-06 coffee gifts carousel, M-07 trust carousel.
- **Landing pages:** the set page for set ads; the gift guide (`/gifts`) for the gifts carousel; the home page for the trust carousel.

### M2 · Retargeting (always on)

- **Audiences:** website visitors in the last 30 days; set-page viewers and add-to-basket in the last 14 days; Instagram and Facebook engagers in the last 30 days; 50% video viewers in the last 30 days; newsletter subscribers who consented to marketing (customer list).
- **Ads:** M-03 Kyoto price carousel, M-07 trust carousel, M-08 deadline cards, plus whichever M1 ad has the lowest cost per add-to-basket.
- **Deadline push (15 to 17 November):** add €32 a day and switch the lead ad to the deadline cards (posts 8, 13, 14). Turn the deadline ads off at midnight on 17 November.
- **Watch:** frequency. Above 4 a week, add a new creative.

### M3 · Seed reach (6 to 9 November)

- **Objective:** Engagement (video views, ThruPlay) on posts 1, 2 and 6.
- **Why:** it is the cheapest way to fill the video-viewer and engager audiences that M2 needs in its first week.

### M4 · Second Christmas batch (18 to 30 November, if decision 1 is yes)

- Same set-up as M1 plus retargeting audiences in one ad set. Ads: M-11 second batch, M-10 "No Black Friday" (27 to 30 Nov), best two from M1.

### M5 · Gifts under €50 (20 November to 10 December)

- **Format:** catalogue (Advantage+ catalogue ads) using a product set of the pieces under €50, or the post 18 carousel as a manual carousel ad.
- **Audience:** broad Ireland 25+ with gift and Kris Kindle interests.

### M6 · E-gift cards (7 to 24 December, if decision 2 is yes)

- Ads: M-12 (posts 34, 37 and 40). Audiences: retargeting audiences plus broad. Within the same total, spend more from 18 to 23 December, when nothing else can arrive in time.

### M7 · Riad Corner waiting list (January)

- **Objective:** Leads, measured as sign-ups on the Riad Corner page (send the newsletter sign-up as a `Lead` event). Avoid Meta instant forms unless the leads are connected to the email list automatically.
- **Audiences:** engagers with posts 43 to 49; interests in Morocco, Marrakech, Moroccan decor, reading, boho interiors.
- **Ads:** M-13 (post 43 reel, post 49 card, post 44 carousel).

### M8 · New year (January)

- Ads: M-14 Kyoto new year (post 42), M-15 new home (post 46), the best December performers, and customer photos once permission for ads is given.

### Ad copy

Primary text: the first 125 characters show before "more", so the hook comes first. Headlines up to 40 characters. Sentence case, as on the site.

**M-01 · Kyoto reel** · creative: post 2 `reel.mp4`
- Primary: A Japanese coffee house, on your kitchen counter. Glass dripper and jug, gooseneck kettle, Hario hand grinder, four cups and an acacia board, all in one box. Order by 17 November for Christmas.
- Headline: Kyoto Kissaten · €229
- Description: €50 less than the pieces separately
- Button: Shop now · `/sets/kyoto-kissaten`

**M-02 · Kyoto static** · post 19
- Primary: Three minutes. One cup. No machine. Everything for pour-over coffee at home apart from the beans, posted from Ireland with nothing to pay on delivery.
- Headline: The pour-over set, in one box
- Description: Ships by 12 December
- Button: Shop now · `/sets/kyoto-kissaten`

**M-03 · Kyoto price carousel** (retargeting) · post 5
- Primary: Five pieces: €279 bought one by one, €229 as a set. The only thing you need to add is coffee.
- Headline: Kyoto Kissaten · €229
- Button: Shop now · `/sets/kyoto-kissaten`

**M-04 · Milanese static** · post 3
- Primary: Turn the main light off. Pour a drink. A Milan-style drinks corner for your console: crystal decanter and glasses, Boston shaker, travertine lamp, wavy mirror, glass vase and candle holders. You add the drinks.
- Headline: The Milanese · €409
- Description: €75 less than the pieces separately
- Button: Shop now · `/sets/the-milanese`

**M-05 · Milanese reel** (Meta only) · post 6
- Primary: From a bare console to an evening corner in six pieces. Lamp at one end, vase at the other, crystal in between, candles in front, mirror above. All in one box.
- Headline: The Milanese · €409
- Button: Shop now · `/sets/the-milanese`

**M-06 · Coffee gifts by budget** · post 7
- Primary: Gifts for coffee lovers, from a €32 acacia board to the whole pour-over set at €229. Every piece is sold on its own and posted from Ireland.
- Card headlines: Acacia board · €32 / Glass dripper and jug · €38 / Gooseneck kettle · €55 / Four handleless cups · €65 / Hario hand grinder · €89 / The whole set · €229
- Button: Shop now · each card to its product

**M-07 · Trust carousel** · post 12
- Primary: Buying gifts online this Christmas? Ours are posted from Ireland, so there's nothing to pay on the doorstep. Order by 17 November and every set ships by 12 December.
- Headline: Real dates. No customs charges.
- Button: Learn more · `/`

**M-08 · Deadline** · posts 8, 13, 14
- Primary: Christmas orders close on Tuesday 17 November at midnight. Every set in the batch ships by 12 December.
- Headline: Order by 17 November
- Button: Shop now · `/`

**M-09 · Kris Kindle** · post 18
- Primary: Kris Kindle sorted. Candle holders €24, Boston shaker €29, acacia board €32, glass dripper €38, blown glass vase €44.
- Headline: Five gifts under €50
- Button: Shop now · `/gifts`

**M-10 · No Black Friday** · post 25
- Primary: No Black Friday sale here. No countdown timers, no "was" prices. Just sets that always cost less than their pieces bought one by one.
- Headline: Kyoto €229 · Milanese €409
- Button: Shop now · `/`

**M-11 · Second batch** · post 16 slide 5, post 28
- Primary: Missed the first Christmas batch? A second one is open until 30 November, and every set in it ships by 18 December.
- Headline: Order by 30 November
- Button: Shop now · `/`

**M-12 · E-gift cards** · posts 34, 37, 40
- Primary: Too late to post? Gift a place. Home Lab e-gift cards arrive by email, ready for Christmas morning, and can be spent on any set or piece.
- Headline: E-gift cards, by email
- Button: Shop now · the e-gift card page

**M-13 · Riad Corner waiting list** · posts 43, 44, 49
- Primary: Next stop: Marrakech. Riad Corner brings a riad's low seating, lantern light and mint tea home: a rag rug, wool pouf, brass tray, teapot, six tea glasses and a pierced lantern. Opening soon.
- Headline: Join the Riad Corner list
- Button: Sign up · `/sets/riad-corner`

**M-14 · New year Kyoto** · post 42
- Primary: No resolutions here, just a slower first cup. Kettle, hand grinder, glass dripper and cups you hold in both hands. Got a Home Lab gift card? This is a good place to spend it.
- Headline: Kyoto Kissaten · €229
- Button: Shop now · `/sets/kyoto-kissaten`

**M-15 · New home** · post 46
- Primary: New home this year? Start with one corner. The kitchen counter, the console, the reading nook: each one is a set, in one box.
- Headline: One box per corner
- Button: Shop now · `/`

---

## 5. Google

### G1 · Search, non-brand

People already searching for what the shop sells. Phrase and exact match, Ireland (people in or regularly in), English.

| Ad group | Keywords (phrase or exact) | Landing page |
| --- | --- | --- |
| Pour-over set | pour over coffee set, pour over coffee kit, pour over set ireland, japanese coffee set | `/sets/kyoto-kissaten` |
| Coffee gifts | gifts for coffee lovers, coffee lover gifts ireland, coffee gift ideas, coffee gifts for him, coffee gifts for her | `/journal/gifts-for-coffee-lovers-ireland` |
| Coffee gear | hario grinder, hario skerton, hand coffee grinder ireland, gooseneck kettle, electric gooseneck kettle ireland | the product page |
| Home bar | crystal decanter set, whisky decanter set, decanter and glasses gift, boston shaker, home bar accessories | `/sets/the-milanese` or the product page |
| Lamps and mirrors | travertine lamp, travertine table lamp, mushroom lamp, wavy mirror, wavy wall mirror | the product page |
| Housewarming | housewarming gifts ireland, housewarming gift ideas, new home gifts | `/journal/housewarming-gifts-ireland` |

**Bidding:** Maximise clicks with a €1.20 maximum cost per click for the first two weeks, then Maximise conversions once there are 15 or more conversions, then a target cost per order.

**Negative keywords** (campaign level), including the tech and medical meanings of "home lab":
`server, servers, rack, proxmox, homelab, home lab setup, home lab server, networking, nas, raspberry pi, kubernetes, unraid, truenas, ubiquiti, cisco, lab test, test kit, blood test, laboratory, covid, jobs, careers, repair, parts, spare, manual, second hand, used, free, cheap, diy, ikea, argos, amazon, reddit`

**Responsive search ad, pour-over set** (headlines up to 30 characters, descriptions up to 90):

- Headlines: Pour-over coffee set · Everything in one box · Kyoto Kissaten · €229 · With a Hario hand grinder · Gooseneck kettle included · Posted from Ireland · No customs charges · Order by 17 Nov for Xmas · €50 less than separately · Irish-owned shop · Gift for coffee lovers · Brewing guide included
- Descriptions: Glass dripper and jug, gooseneck kettle, Hario grinder, four cups and an acacia board. · Order by 17 Nov, ships by 12 Dec. Posted from Ireland: no customs charges. · Everything for pour-over at home apart from the beans. 14 days to return it. · A complete Japanese coffee counter, chosen to work together. €229 for all five.

**Responsive search ad, home bar:**

- Headlines: Milan-style home bar set · Crystal decanter and glasses · Travertine lamp included · The Milanese · €409 · A whole drinks corner · Posted from Ireland · €75 less than separately · Order by 17 Nov for Xmas · Set-up guide included
- Descriptions: Decanter and glasses, shaker, travertine lamp, wavy mirror, vase and candle holders. · Order by 17 Nov, ships by 12 Dec. Posted from Ireland: no customs charges. · Turn a bare console into an evening drinks corner. Drinks not included.

**Responsive search ad, coffee gifts:**

- Headlines: Gifts for coffee lovers · From €32 to €229 · Hario hand grinder · €89 · Gooseneck kettle · €55 · The full pour-over set · Posted from Ireland · Order by 17 Nov for Xmas · No customs charges
- Descriptions: Coffee gifts by budget, each piece sold on its own, or all five as Kyoto Kissaten. · Send it straight to them: add their address at checkout. Posted from Ireland.

After 17 November, swap the date lines for the second-batch dates or "Packed to order, posted in three weeks". From 7 December, add "E-gift cards by email".

### G2 · Search, brand

Exact match: `the home lab ireland`, `thehomelab`, `thehomelab.ie`, `the home lab room sets`, `the home lab kyoto`, `the home lab milanese`. €2 a day. It is cheap insurance that the shop, not a tech forum, appears for its own name.

### G3 · Shopping

- **Type:** Standard Shopping (more control at this budget than Performance Max). If you prefer Performance Max, switch off automatically created assets and video so only real product photos appear.
- **Feed:** from Shopify's Google and YouTube app. All sets and pieces; add-ons too.
- **Feed titles** that match how people search, for example: "Electric gooseneck kettle, 1 litre, matt black", "Hario Skerton ceramic hand coffee grinder", "Travertine mushroom table lamp", "Wavy wall mirror, pine frame", "Crystal whisky decanter set with four glasses", "Japanese pour-over coffee gift set".
- **Bidding:** Maximise clicks with a €0.80 cap at first; target ROAS once there are 15 or more conversions.
- **Merchant Center:** shipping rates for Ireland, returns policy, business details, and sets marked as pre-order with the ship-by date.

---

## 6. Pinterest

- **P1 Christmas and gift consideration (12 November to 10 December):** pins 9, 15, 21 and 31, plus post 7, 10, 18 and 23 slides as standard pins. Objective: consideration (outbound clicks). Keywords: pour over coffee set, coffee gifts, gifts for coffee lovers, home bar ideas, console table styling, travertine lamp, wavy mirror, housewarming gifts. Ireland, 25 to 54.
- **P2 Riad Corner waiting list (January):** pins 44, 47 and 48. Keywords: moroccan decor, reading nook ideas, moroccan living room, boho corner, mint tea.
- Catalogue from Shopify for shopping pins; turn on the Pinterest tag behind cookie consent on the storefront.

---

## 7. TikTok (Growth level only)

- Post every reel organically first. After seven days, boost only reels that reached at least twice the account's median views, as **Spark Ads** (they keep the organic likes and comments).
- Best candidates: posts 11 (console formula), 22 (gooseneck kettle), 24 (honest grinder review), 30 (7am in Kyoto).
- **Never** run Milanese creatives that show the decanter with drink (posts 3, 6, 17) on TikTok ads: TikTok does not allow alcohol in ads. Post 11 is the safe Milanese cut.
- Ireland, 25 to 44. Objective: website conversions once the TikTok pixel has 50 or more events, traffic before that.

---

## 8. Testing and optimisation

### Week 1 creative test (6 to 12 November)

Six creatives in M1, one ad set, equal footing. On day 3 and day 6:

- After 1,500 impressions, pause any ad with a link click-through rate under 0.6%.
- After €60 spend, rank the rest by cost per add-to-basket; keep the best three or four.
- Put the winner of each set into retargeting (M2) as well.

### The rules for every week after

| Signal | Rule |
| --- | --- |
| Link click-through under 0.6% after 1,500 impressions | Pause and replace |
| Cost per order over 1.5× target after €100 on that ad | Pause |
| Cost per order under target for 3 days | Raise the budget 20%, no more than every 2 days |
| Frequency over 4 a week (retargeting) or 2.5 (prospecting) | Add a new creative |
| A winning ad | Never edit it (that resets learning). Duplicate it to change anything |
| Budget changes | 20% at a time, so the campaign keeps learning |

### What to test next (one at a time)

1. **First frame of the reels:** product first (frame 2) against question first (frame 1).
2. **Price in the headline** against no price.
3. **Deadline message** against "posted from Ireland, no customs" message.
4. **Set page** against product page as the landing page for single-piece ads.
5. **Customer photos** (from January, with permission) against supplier photos.

### KPIs by campaign

| Campaign | Main KPI | Target | Also watch |
| --- | --- | --- | --- |
| M1, M4 Prospecting | Cost per order | €80 blended (Kyoto €70, Milanese €120) | CTR > 1%, cost per add-to-basket |
| M2 Retargeting | ROAS | 5+ | Frequency |
| M3 Seed reach | Cost per ThruPlay | Under €0.05 | Audience size built |
| M5 Gifts under €50 | ROAS | 3+ | Average order value |
| M6 E-gift cards | ROAS | 4+ | Gift-card redemptions in January |
| M7, P2 Riad waiting list | Cost per sign-up | Under €2.50 | List size (target 500) |
| G1 Search | Cost per order | €70 | Search terms report weekly |
| G3 Shopping | ROAS | 4+ | Which pieces sell alone |
| P1 Pinterest | Cost per outbound click | Under €0.60 | Saves |

### The weekly ads review (Friday, 30 minutes)

1. Shopify orders by UTM and survey answers against platform-reported purchases.
2. Spend, cost per order and ROAS by campaign; the top and bottom three ads.
3. Google search terms report: add negatives, add winning terms as exact match.
4. Apply the rules table; move money from losers to winners.
5. Note one thing to test next week.
