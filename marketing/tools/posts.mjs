/**
 * The first 50 social posts for The Home Lab: one source for the rendered
 * creatives (render.mjs), the post guide (02-social-posts.md) and the
 * scheduler import (social-calendar.csv). Edit here, then run:
 *
 *   node marketing/tools/render.mjs && node marketing/tools/build-docs.mjs
 *
 * Prices are the shop prices in src/lib/content/sets.ts, addons.ts and
 * sample-sets.ts on 5 November 2026. If a price changes, change it here and
 * re-render.
 */

export const SIZES = { feed: [1080, 1350], story: [1080, 1920], pin: [1000, 1500] };

const P = (f) => `/public/images/pieces/${f}.jpg`;
const KYOTO = '/public/images/sets/kyoto/contents.jpg';
const MILAN = '/public/images/sets/milanese/set.jpg';
const MIRROR = '/public/images/sets/milanese/mirror.jpg';

const WEB = 'thehomelab.ie';

/* Shared plan drawings (same 100 × 70 grid as the set pages). */
const PLAN_KYOTO = [
  { shape: 'rect', x: 4, y: 8, w: 92, h: 54, dash: true, stroke: 'var(--muted)', label: 'Counter, 60 × 30 cm', ly: 4, fs: 22, tc: 'var(--muted)' },
  { shape: 'rect', x: 8, y: 42, w: 50, h: 13, label: 'Acacia board', ly: 17, fs: 22 },
  { shape: 'circle', x: 40, y: 40, w: 11, h: 11, fill: 'var(--accent)', stroke: 'var(--accent)' },
  { shape: 'rect', x: 34, y: 30, w: 22, h: 0.01, stroke: 'transparent', label: 'Dripper and jug', fs: 22 },
  { shape: 'circle', x: 16, y: 45, w: 7, h: 7 },
  { shape: 'rect', x: 10, y: 36, w: 20, h: 0.01, stroke: 'transparent', label: 'Four cups', fs: 22 },
  { shape: 'circle', x: 68, y: 30, w: 11, h: 11 },
  { shape: 'rect', x: 62, y: 46, w: 24, h: 0.01, stroke: 'transparent', label: 'Kettle', fs: 22 },
  { shape: 'circle', x: 80, y: 20, w: 9, h: 9 },
  { shape: 'rect', x: 74, y: 15, w: 22, h: 0.01, stroke: 'transparent', label: 'Grinder', fs: 22 },
];
const PLAN_MILAN = [
  { shape: 'rect', x: 4, y: 20, w: 92, h: 36, dash: true, stroke: 'var(--muted)', label: 'Console, about 120 × 40 cm', ly: 42, fs: 22, tc: 'var(--muted)' },
  { shape: 'rect', x: 36, y: 10, w: 28, h: 4, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Mirror on the wall above', ly: -3, fs: 22 },
  { shape: 'circle', x: 14, y: 34, w: 13, h: 13, label: 'Lamp', ly: 18, fs: 22 },
  { shape: 'rect', x: 28, y: 30, w: 14, h: 12, label: 'Decanter', ly: 17, fs: 22 },
  { shape: 'circle', x: 50, y: 38, w: 6, h: 6, label: 'Shaker', ly: 11, fs: 22 },
  { shape: 'circle', x: 66, y: 32, w: 8, h: 8, label: 'Vase', ly: 13, fs: 22 },
  { shape: 'circle', x: 76, y: 46, w: 6, h: 6, label: 'Candles', ly: -4, fs: 22 },
];
const PLAN_RIAD = [
  { shape: 'rect', x: 4, y: 4, w: 92, h: 62, dash: true, stroke: 'var(--muted)', label: 'Floor, about 150 × 200 cm', ly: 70, fs: 22, tc: 'var(--muted)' },
  { shape: 'rect', x: 16, y: 12, w: 62, h: 46, fill: 'rgba(194,86,61,.22)', label: 'Rag rug', ly: 6, fs: 24 },
  { shape: 'circle', x: 45, y: 28, w: 16, h: 16, label: 'Pouf, tray and tea', ly: 22, fs: 22 },
  { shape: 'circle', x: 48, y: 31, w: 10, h: 10, fill: '#B89660', stroke: '#B89660' },
  { shape: 'circle', x: 84, y: 10, w: 7, h: 7, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Lantern', ly: 12, fs: 22 },
];

const TAGS = {
  irish: ['#irishinteriors', '#shopirish', '#irishhomes'],
  coffee: ['#pourover', '#coffeeathome', '#kissaten'],
  milan: ['#homebar', '#consolestyling', '#travertine'],
  gifts: ['#christmasgiftsireland', '#giftideas'],
  riad: ['#moroccandecor', '#readingnook', '#riad'],
};

export const POSTS = [
  /* ───────────── Phase 1: the Christmas batch (6–17 November) ───────────── */
  {
    n: 1,
    date: '2026-11-06',
    time: '08:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Brand',
    set: 'All',
    headline: 'We bring places home.',
    link: '/about',
    hashtags: [...TAGS.irish, '#interiorstyling', '#giftideas'],
    boost: 'Yes. Awareness ad to Irish home and gifting interests, 6–17 Nov.',
    brief: 'Launch carousel. Opens on the real photo of The Milanese, then one slide per set, then the Christmas dates. All product photos are the supplier photos of the exact pieces; Riad Corner has no product photos yet, so its slide uses the brand pattern.',
    alt: 'The Milanese set on a marble console under a wavy pine mirror, with the words: We bring places home.',
    caption: `The Home Lab makes room sets. Each one recreates a corner of a real place and puts every piece it needs into one box.

Kyoto Kissaten is a Japanese coffee house on your kitchen counter: glass dripper and jug, gooseneck kettle, Hario hand grinder, four handleless cups and an acacia board. €229.

The Milanese is an evening drinks corner from a Milan apartment: crystal decanter and glasses, Boston shaker, travertine lamp, wavy mirror, glass vase and candle holders. €409.

Riad Corner, a Moroccan tea corner, opens in the new year.

Irish-owned, packed and posted from Ireland. Christmas orders close 17 November.`,
    slides: [
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Home Lab', headline: 'We bring places home.', size: 'xl' },
      { t: 'type', theme: 'chalk', headline: 'A room set is one corner of a real place, with every piece it needs, in one box.', size: 'm' },
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'Kyoto Kissaten · €229', headline: 'A Japanese coffee house, on your kitchen counter.', body: 'Dripper and jug, gooseneck kettle, Hario hand grinder, four cups and an acacia board.' },
      { t: 'photo', img: MIRROR, focus: '50% 40%', kicker: 'The Milanese · €409', headline: 'An evening drink in a Milan apartment.', size: 'm' },
      { t: 'pattern', native: 'رياض', kicker: 'Riad Corner · opening in the new year', headline: 'A tea corner in a Marrakech riad.', size: 'm' },
      { t: 'type', theme: 'ink', kicker: 'Irish-owned', headline: 'Packed and posted from Ireland.', body: 'Christmas orders close **17 November**. Every set ships by **12 December**.', size: 'l' },
    ],
  },
  {
    n: 2,
    date: '2026-11-07',
    time: '09:00',
    format: 'Reel',
    size: 'story',
    secs: 2.6,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Product truth',
    set: 'Kyoto Kissaten',
    headline: 'Everything for pour-over coffee, in one box.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#coffeeireland', '#shopirish'],
    audio: 'Soft, warm instrumental (piano or lo-fi) from the Instagram/TikTok commercial music library. No voiceover.',
    boost: 'Yes. Lead creative for the Kyoto Kissaten sales campaign.',
    brief: 'Seven still frames, one per piece, built into a silent MP4 with a slow push-in and crossfades (reel.mp4). Add music in the app before posting. Upgrade option: cut in 2–3 seconds of licensed stock footage of a pour-over being made (search "pour over coffee slow motion") between frames 1 and 2, labelled as a scene, not the product.',
    alt: 'Each piece of the Kyoto Kissaten set in turn: amber glass dripper, black gooseneck kettle, Hario hand grinder, four glazed cups, acacia board, then all five together.',
    caption: `A kissaten is a Japanese coffee house where coffee is poured by hand, one cup at a time. This is the whole counter in one box:

The dripper and jug: amber glass, 400 ml, with a pack of filters.
The kettle: electric, with a gooseneck spout for a slow, steady pour.
The grinder: Hario, ceramic burrs.
The cups: four, handleless, each in a different glaze.
The board: long acacia, to keep it all together.

€229 for the set, €50 less than the pieces bought one by one. Just add beans.
Christmas orders close 17 November.`,
    slides: [
      { t: 'type', theme: 'ink', native: '喫茶店', kicker: 'Kyoto Kissaten', headline: 'Everything for pour-over coffee, in one box.', size: 'l', valign: 'flex-start' },
      { t: 'split', img: P('glass-pour-over-dripper'), ratio: 0.62, kicker: 'The dripper and jug', headline: 'Amber glass, 400 ml, filters included.', size: 'm' },
      { t: 'split', img: P('gooseneck-kettle'), ratio: 0.62, kicker: 'The kettle', headline: 'A thin spout for a slow, steady pour.', size: 'm' },
      { t: 'split', img: P('hario-hand-grinder'), ratio: 0.62, kicker: 'The grinder', headline: 'Hario ceramic burrs, turned by hand.', size: 'm' },
      { t: 'split', img: P('handleless-cups'), ratio: 0.62, kicker: 'The cups', headline: 'Four glazes, in a gift box.', size: 'm' },
      { t: 'split', img: P('acacia-serving-board'), ratio: 0.62, kicker: 'The board', headline: 'Long acacia, to keep it together.', size: 'm' },
      { t: 'split', img: KYOTO, ratio: 0.42, kicker: 'Kyoto Kissaten', headline: 'Five pieces. One box. €229.', body: 'Order by 17 November for Christmas.', size: 'l' },
    ],
  },
  {
    n: 3,
    date: '2026-11-08',
    time: '20:00',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Place and mood',
    set: 'The Milanese',
    headline: 'Turn the main light off. Pour a drink.',
    link: '/sets/the-milanese',
    hashtags: [...TAGS.milan, '#aperitivo', '#irishinteriors'],
    boost: 'Yes. Lead image for The Milanese sales campaign (Facebook and Instagram, 25+).',
    brief: 'The real set photo, cropped to 4:5, with the line from the set’s own guide. Post at 8pm, when the scene is happening in people’s own homes. Story version included.',
    alt: 'The Milanese set on a marble console in lamplight: travertine lamp, crystal decanter and glasses, steel shaker tins, glass vase, candle holders and a wavy pine mirror.',
    caption: `In Milan, the evening starts at a console: a decanter, a few good glasses, a stone lamp and candles, with the ceiling light off.

The Milanese is that corner, in one box. A cut-crystal decanter with four glasses, a two-tin Boston shaker, a travertine lamp, a wavy pine mirror, a blown glass vase and two candle holders. You add the drinks.

€409, which is €75 less than the six pieces bought separately. Order by 17 November for Christmas.`,
    slides: [{ t: 'photo', img: MILAN, focus: '50% 72%', kicker: 'The Milanese', headline: 'Turn the main light off. Pour a drink.', size: 'l' }],
  },
  {
    n: 4,
    date: '2026-11-09',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Place and culture',
    set: 'Kyoto Kissaten',
    headline: 'What is a kissaten?',
    link: '/journal/what-is-a-kissaten',
    hashtags: [...TAGS.coffee, '#kyoto', '#japaneseculture'],
    boost: 'Optional. Good as a low-cost engagement ad to coffee interests; builds a warm audience for retargeting.',
    brief: 'An explainer carousel from the Journal article. Mostly type, so it is quick to read and saves well. The kanji is set in Noto Serif JP.',
    alt: 'The word kissaten in Japanese characters, with the question: What is a kissaten?',
    caption: `Kissaten (喫茶店) translates roughly as "tea-drinking shop", but in everyday Japanese it means a traditional, independent coffee house.

They are usually small, often family-run, with dark wood, low lamps and coffee made by hand, to order, one cup at a time. Nobody hurries you.

Kyoto escaped the worst of the wartime bombing, so some of Japan's oldest coffee houses still run there.

The full story is in our Journal: "What is a kissaten?" Link in bio.`,
    slides: [
      { t: 'type', theme: 'ink', native: '喫茶店', kicker: 'Kyoto', headline: 'What is a kissaten?', size: 'xl', valign: 'flex-end' },
      { t: 'type', theme: 'chalk', kicker: 'The word', headline: 'Roughly, a “tea-drinking shop”.', body: 'In everyday Japanese it means a traditional, independent coffee house, as opposed to a chain café.', size: 'l' },
      { t: 'split', img: P('glass-pour-over-dripper-3'), fit: 'cover', ratio: 0.58, kicker: 'The coffee', headline: 'Made by hand, to order, one cup at a time.', body: 'Pour-over through paper or flannel filters. Nothing comes from a button.' },
      { t: 'type', theme: 'stone', kicker: 'The room', headline: 'Dark wood, low lamps and time.', body: 'Wooden counters, leather or velvet chairs, lamps rather than overhead lights. Many kissaten are as much about sitting as drinking.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Why Kyoto', headline: 'More of the old city survived, and with it some of Japan’s oldest coffee houses.', size: 'm' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: 'Bring the ritual home', headline: 'Kyoto Kissaten: the whole pour-over counter in one box.', price: '€229', size: 's' },
    ],
  },
  {
    n: 5,
    date: '2026-11-10',
    time: '08:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Product truth',
    set: 'Kyoto Kissaten',
    headline: 'Five pieces. €279 separately. €229 as a set.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#coffeegifts', '#shopirish'],
    boost: 'Yes. Retargeting ad for people who viewed the Kyoto set page but did not buy.',
    brief: 'The price arithmetic, shown plainly. Each piece is sold on its own at these prices, so the comparison is real (see the advertising plan for the price-claim rules).',
    alt: 'Everything in the Kyoto Kissaten set, with the line: Five pieces. One price.',
    caption: `What's in Kyoto Kissaten, and what each piece costs on its own:

Hario hand grinder €89
Four handleless cups €65
Electric gooseneck kettle €55
Glass dripper with jug €38
Acacia serving board €32

That's €279 one by one. The set is €229.

The only thing you need to add is coffee. Whole beans from an Irish roaster are ideal, since the grinder is in the box.`,
    slides: [
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'Kyoto Kissaten', headline: 'Five pieces. One price.', size: 'l' },
      {
        t: 'rows',
        theme: 'chalk',
        kicker: 'Bought one by one',
        headline: 'What each piece costs on its own',
        rows: [
          { k: 'Hario hand grinder', v: '€89' },
          { k: 'Four handleless cups', v: '€65' },
          { k: 'Electric gooseneck kettle', v: '€55' },
          { k: 'Glass dripper with jug', v: '€38' },
          { k: 'Acacia serving board', v: '€32' },
          { k: 'Separately', v: '€279', cls: 'strike' },
          { k: 'The set', v: '€229', cls: 'total' },
          { k: 'You save', v: '€50', cls: 'save' },
        ],
      },
      { t: 'type', theme: 'stone', kicker: 'What else you need', headline: 'Coffee beans. That’s it.', body: 'Whole beans from an Irish speciality roaster are ideal, since the set includes a grinder. A pack of size 02 filters is in the box.', size: 'l' },
      { t: 'type', theme: 'ink', kicker: 'Christmas', headline: 'Order by 17 November.', body: 'Every set ships by 12 December.', size: 'xl' },
    ],
  },
  {
    n: 6,
    date: '2026-11-11',
    time: '19:30',
    format: 'Reel',
    size: 'story',
    secs: 2.4,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Styling',
    set: 'The Milanese',
    headline: 'From a bare console to Milan, in six pieces.',
    link: '/sets/the-milanese',
    hashtags: [...TAGS.milan, '#homedecorideas', '#irishinteriors'],
    audio: 'Slow Italian-feeling instrumental or soft jazz from the commercial library. No voiceover.',
    boost: 'Yes. Lead video for The Milanese on Instagram and Facebook. For TikTok ads use the version without the decanter frame (see advertising plan).',
    brief: 'Builds the console piece by piece, in the order of the set-up guide, then lands on the finished set photo. All frames are supplier photos of the actual pieces, all shot in the same room, so the sequence reads as one place.',
    alt: 'The pieces of The Milanese appear one at a time on a marble console: travertine lamp, glass vase, crystal decanter, steel shaker, candle holders and the wavy mirror, then the finished corner.',
    caption: `A bare console is one of the hardest surfaces in a home to get right. Here's how six pieces turn one into a Milan drinks corner:

Lamp at one end. Vase at the other. Decanter and glasses towards the lamp. Shaker beside them. Candles at the front. Mirror centred above.

The Milanese is all six, in one box. €409.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'The Milanese', headline: 'A bare console. Six pieces. One evening corner.', size: 'l' },
      { t: 'photo', img: P('travertine-table-lamp'), focus: '50% 60%', kicker: 'First', headline: 'A travertine lamp at one end.', size: 'm' },
      { t: 'photo', img: P('blown-glass-vase'), focus: '50% 55%', kicker: 'Then', headline: 'A blown glass vase at the other.', size: 'm' },
      { t: 'photo', img: P('crystal-decanter-set'), focus: '50% 60%', kicker: 'In between', headline: 'Crystal decanter and glasses, towards the lamp.', size: 'm' },
      { t: 'photo', img: P('boston-shaker-tins'), focus: '50% 55%', kicker: 'Beside them', headline: 'Two steel shaker tins.', size: 'm' },
      { t: 'photo', img: P('ceramic-candle-holders'), focus: '50% 60%', kicker: 'At the front', headline: 'Candlelight.', size: 'l' },
      { t: 'photo', img: MIRROR, focus: '50% 35%', kicker: 'Above', headline: 'A wavy mirror, 20 cm over the top.', size: 'm' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Milanese · €409', headline: 'All six, in one box.', size: 'l' },
    ],
  },
  {
    n: 7,
    date: '2026-11-12',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Gifting',
    set: 'Kyoto Kissaten',
    headline: 'Gifts for coffee lovers, by budget.',
    link: '/journal/gifts-for-coffee-lovers-ireland',
    hashtags: [...TAGS.gifts, '#coffeegifts', '#pourover', '#shopirish'],
    boost: 'Yes. Gift-intent ad (Facebook and Instagram, 30+, coffee and gift interests). Each slide links to its product as a catalogue carousel ad.',
    brief: 'One piece per slide, cheapest first, ending on the full set. Every price is the price of that piece on its own in the shop.',
    alt: 'Gifts for coffee lovers by budget, from a €32 acacia board to the €229 Kyoto Kissaten set.',
    caption: `Gifts for coffee lovers, by budget. Every piece is sold on its own:

€32 Acacia serving board
€38 Glass pour-over dripper with jug (filters included)
€55 Electric gooseneck kettle
€65 Four handleless cups in a gift box
€89 Hario ceramic hand grinder
€229 All five together, as Kyoto Kissaten

Posted from Ireland, so there's nothing to pay on the doorstep. Save this for later.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Christmas gift guide', headline: 'Gifts for coffee lovers, by budget.', size: 'xl' },
      { t: 'split', img: P('acacia-serving-board'), ratio: 0.6, kicker: '€32', headline: 'Acacia serving board', body: 'Carries the dripper, jug and cups to the table in one go.', size: 's' },
      { t: 'split', img: P('glass-pour-over-dripper-2'), ratio: 0.6, kicker: '€38', headline: 'Glass dripper with jug', body: 'Amber glass, 400 ml. A pack of filters comes with it.', size: 's' },
      { t: 'split', img: P('gooseneck-kettle'), ratio: 0.6, kicker: '€55', headline: 'Electric gooseneck kettle', body: 'The thin spout is what makes pour-over easy.', size: 's' },
      { t: 'split', img: P('handleless-cups'), ratio: 0.6, kicker: '€65', headline: 'Four handleless cups', body: 'Four glazes, from dark iron to cream, in a gift box.', size: 's' },
      { t: 'split', img: P('hario-hand-grinder'), ratio: 0.6, kicker: '€89', headline: 'Hario hand grinder', body: 'Ceramic burrs. Almost silent, so it won’t wake the house.', size: 's' },
      { t: 'split', img: KYOTO, ratio: 0.48, kicker: '€229', headline: 'All five, as Kyoto Kissaten', body: '€50 less than buying the pieces one by one.', size: 's' },
    ],
  },
  {
    n: 8,
    date: '2026-11-12',
    time: '19:00',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram Stories', 'Facebook'],
    pillar: 'Deadline',
    set: 'All',
    headline: 'Five days left to order for Christmas.',
    link: '/',
    hashtags: [...TAGS.gifts, '#shopirish'],
    boost: 'Yes. Short deadline ad to everyone who engaged or visited in the last 30 days.',
    brief: 'Countdown card. Story version for Instagram Stories with a link sticker to the homepage; feed version for Facebook.',
    alt: 'The number 5, with the words: days left to order for Christmas.',
    caption: `Five days left. Christmas orders close on Tuesday 17 November, and every set in the batch ships by 12 December.

Sets are made up in batches: when the batch closes we gather every piece, check it and pack each set in one box, here in Ireland.`,
    slides: [{ t: 'number', theme: 'olive', number: '5', headline: 'days left to order for Christmas.', body: 'Orders close Tuesday 17 November. Every set ships by 12 December.', size: 'm' }],
  },
  {
    n: 9,
    date: '2026-11-12',
    time: '21:00',
    format: 'Pin',
    size: 'pin',
    platforms: ['Pinterest'],
    pillar: 'Search and saves',
    set: 'Kyoto Kissaten',
    headline: 'Japanese pour-over coffee set: everything in one box',
    link: '/sets/kyoto-kissaten',
    hashtags: [],
    board: 'Coffee corner ideas',
    pinTitle: 'Japanese pour-over coffee set: dripper, gooseneck kettle, Hario grinder, cups and board',
    boost: 'Yes. Pinterest consideration campaign, keywords: pour over coffee set, coffee gifts, coffee corner.',
    brief: 'Pinterest pin, 2:3. Title and description are written for Pinterest search.',
    alt: 'Everything in the Kyoto Kissaten pour-over coffee set laid out on a pale background.',
    caption: `A complete Japanese pour-over coffee setup in one box: amber glass dripper and jug with filters, electric gooseneck kettle, Hario ceramic hand grinder, four handleless cups and an acacia serving board. Pour-over coffee at home with nothing else to buy apart from beans. A coffee gift for Christmas, posted from Ireland.`,
    slides: [{ t: 'split', img: KYOTO, ratio: 0.5, kicker: 'Kyoto Kissaten · €229', headline: 'Japanese pour-over coffee set: everything in one box.', body: 'Dripper and jug, gooseneck kettle, Hario hand grinder, four cups and a board.', size: 's' }],
  },
  {
    n: 10,
    date: '2026-11-13',
    time: '08:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Ritual and how-to',
    set: 'Kyoto Kissaten',
    headline: 'How to brew pour-over in six steps.',
    link: '/journal/pour-over-coffee-for-beginners',
    hashtags: [...TAGS.coffee, '#coffeetips', '#coffeeireland'],
    boost: 'Optional. Strong save rate makes it a cheap engagement ad and a good Pinterest idea pin.',
    brief: 'The brewing guide from the set page, one step per slide, so people save it. Upload the slides to Pinterest as a multi-image pin too.',
    alt: 'A step-by-step guide to brewing pour-over coffee, starting with hot water being poured into a glass dripper.',
    caption: `How to brew pour-over coffee in six steps. Save this one for Christmas morning.

1. Boil the kettle and let it sit for a minute, so the water is about 93°C.
2. Weigh 15 g of beans and grind them medium-fine, like coarse sea salt.
3. Put a paper filter in the dripper, rinse it with hot water and pour that water away.
4. Add the coffee, wet it with a little water and wait 30 seconds while it blooms.
5. Pour the rest in slow circles until the jug shows 250 ml, over about two minutes.
6. Pour into cups. Rinse everything with hot water; the dripper needs no soap.

Our beginner's guide in the Journal goes further. Link in bio.`,
    slides: [
      { t: 'split', img: P('glass-pour-over-dripper-3'), fit: 'cover', ratio: 0.6, kicker: 'Save for Christmas morning', headline: 'How to brew pour-over in six steps.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Step 1 of 6', headline: 'Boil the kettle and let it sit for a minute, so the water is about 93°C.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Step 2 of 6', headline: 'Weigh 15 g of beans. Grind them medium-fine, like coarse sea salt.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Step 3 of 6', headline: 'Rinse the paper filter with hot water and pour that water away.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Step 4 of 6', headline: 'Wet the coffee with a little water. Wait 30 seconds while it blooms.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Step 5 of 6', headline: 'Pour the rest in slow circles until the jug shows 250 ml, over about two minutes.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Step 6 of 6', headline: 'Pour into the cups. Rinse everything with hot water. No soap needed.', size: 'm' },
      { t: 'plan', theme: 'chalk', kicker: 'Kyoto Kissaten · €229', headline: 'The counter, laid out.', shapes: PLAN_KYOTO, body: 'Kettle beside the dripper, grinder on the side of your stronger hand.' },
    ],
  },
  {
    n: 11,
    date: '2026-11-14',
    time: '10:00',
    format: 'Reel',
    size: 'story',
    secs: 2.8,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok', 'Pinterest'],
    pillar: 'Styling',
    set: 'The Milanese',
    headline: 'The five-piece console formula.',
    link: '/journal/how-to-style-a-console-table',
    hashtags: [...TAGS.milan, '#stylingtips', '#hallwaydecor'],
    audio: 'Upbeat but quiet instrumental from the commercial library. Text carries the content.',
    boost: 'Yes. Best-performing format for cold audiences interested in interiors. TikTok-safe (no drinks shown in this cut).',
    brief: 'Useful styling advice from the Journal, using the real Milanese pieces as the example. The plan frame is drawn from the set page’s layout.',
    alt: 'A five-step console styling formula shown with a travertine lamp, wavy mirror, glass vase, shaker tins and candle holders, then a drawn plan of the console.',
    caption: `The five-piece formula for a console table that looks finished, not cluttered:

1. A lamp at one end. The anchor.
2. A mirror above, centred. It doubles the light.
3. Something tall at the other end. A vase balances the lamp.
4. Something glass or reflective in the middle.
5. Something low at the front, like candle holders.

Think of a triangle: the lamp is the high point, the vase a lower one, everything else lower still.

The full guide, including the narrow-hallway version, is in our Journal.`,
    slides: [
      { t: 'type', theme: 'stone', kicker: 'Styling', headline: 'The five-piece console formula.', size: 'xl' },
      { t: 'photo', img: P('travertine-table-lamp'), focus: '50% 60%', kicker: 'One', headline: 'A lamp at one end. The anchor.', size: 'm' },
      { t: 'photo', img: P('wavy-wall-mirror'), focus: '50% 35%', kicker: 'Two', headline: 'A mirror above, centred.', size: 'm' },
      { t: 'photo', img: P('blown-glass-vase'), focus: '50% 55%', kicker: 'Three', headline: 'Something tall at the other end.', size: 'm' },
      { t: 'photo', img: P('boston-shaker-tins'), focus: '50% 55%', kicker: 'Four', headline: 'Something reflective in the middle.', size: 'm' },
      { t: 'photo', img: P('ceramic-candle-holders'), focus: '50% 60%', kicker: 'Five', headline: 'Something low at the front.', size: 'm' },
      { t: 'plan', theme: 'chalk', kicker: 'The rule', headline: 'Think of a triangle.', shapes: PLAN_MILAN, body: 'Lamp high at one end, vase lower at the other, everything else lower still.' },
    ],
  },
  {
    n: 12,
    date: '2026-11-15',
    time: '11:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Trust',
    set: 'All',
    headline: 'Buying gifts online this Christmas? Read this first.',
    link: '/journal/christmas-delivery-ireland-guide',
    hashtags: [...TAGS.gifts, '#shopirish', '#shoplocalireland'],
    boost: 'Yes. Facebook feed, 35+, gift buyers. This is the strongest trust message for Irish shoppers.',
    brief: 'Plain facts about ordering, all of them true today: posted from Ireland, deliver to the recipient, real dates, free changes until the batch closes, 14-day returns.',
    alt: 'A dark card with the words: Buying gifts online this Christmas? Read this first.',
    caption: `Five things worth knowing before you order Christmas gifts online, and how they work with us:

1. Since Brexit, many orders from Great Britain arrive with VAT, handling fees and sometimes duty to pay. We post from Ireland, so there's nothing to pay on the doorstep.
2. You can send a set straight to the person: put their name and address in delivery at checkout.
3. Our dates are fixed: order by 17 November and every set ships by 12 December.
4. You can change or cancel free of charge until the batch closes.
5. After delivery you have 14 days to cancel without giving a reason, and you can return a whole set or single pieces.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: 'Christmas in Ireland', headline: 'Buying gifts online this Christmas? Read this first.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'No surprise charges', headline: 'Posted from Ireland, so nothing to pay on the doorstep.', body: 'Since Brexit, many orders from Great Britain arrive with VAT and handling fees to pay. Ours don’t: the price in euro is the full price, with delivery added at checkout.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Straight to them', headline: 'Send it to their door.', body: 'Put their name and address as the delivery address at checkout. The set arrives in its box.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Fixed dates', headline: 'Order by 17 November. Ships by 12 December.', body: 'Every set in the Christmas batch is posted ahead of the busiest posting week.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Changed your mind?', headline: 'Free changes until the batch closes.', body: 'After delivery, 14 days to cancel without giving a reason. Return a whole set or single pieces.', size: 'm' },
      { t: 'split', img: KYOTO, ratio: 0.46, kicker: 'The Home Lab', headline: 'Room sets and home gifts, posted from Ireland.', size: 's' },
    ],
  },
  {
    n: 13,
    date: '2026-11-16',
    time: '19:00',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Deadline',
    set: 'All',
    headline: 'Christmas orders close tomorrow.',
    link: '/',
    hashtags: [...TAGS.gifts, '#shopirish'],
    boost: 'Yes. Deadline ad to warm audiences (site visitors, engagers, email list lookalike).',
    brief: 'Deadline card in clay, the brand’s accent colour, used sparingly so it stands out in the feed. Story version with a link sticker.',
    alt: 'A clay-coloured card: Christmas orders close tomorrow.',
    caption: `Christmas orders close tomorrow, Tuesday 17 November, at midnight.

Kyoto Kissaten €229. The Milanese €409. Single pieces from €24.

Everything ordered by then ships by 12 December, posted from Ireland. Link in bio.`,
    slides: [{ t: 'type', theme: 'clay', kicker: 'Tuesday 17 November', headline: 'Christmas orders close tomorrow.', body: 'Order by midnight. Every set ships by 12 December.', size: 'xl' }],
  },
  {
    n: 14,
    date: '2026-11-17',
    time: '08:00',
    format: 'Reel',
    size: 'story',
    secs: 2.4,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Deadline',
    set: 'All',
    headline: 'Last day to order for Christmas.',
    link: '/',
    hashtags: [...TAGS.gifts, '#shopirish', '#irishinteriors'],
    audio: 'A recognisable, upbeat track from the commercial library. Repost to Stories at 12:00 and 20:00.',
    boost: 'Yes. Run all day to warm audiences, then switch off at midnight.',
    brief: 'Fast deadline reel: the two sets, the under-€50 pieces and the hard cut-off. Repost to Stories through the day.',
    alt: 'A short video: last day to order for Christmas, showing Kyoto Kissaten, The Milanese and small gifts, closing at midnight.',
    caption: `Today is the last day to order for Christmas. Orders close at midnight; everything in the batch ships by 12 December.

Kyoto Kissaten, the pour-over coffee counter: €229.
The Milanese, the evening drinks corner: €409.
Single pieces from €24.

Link in bio.`,
    slides: [
      { t: 'type', theme: 'clay', kicker: 'Tuesday 17 November', headline: 'Last day to order for Christmas.', size: 'xl' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: 'Kyoto Kissaten', headline: 'The coffee counter. €229.', size: 'l' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Milanese', headline: 'The drinks corner. €409.', size: 'l' },
      { t: 'grid', theme: 'chalk', kicker: 'Small gifts', headline: 'Pieces from €24.', cells: [{ img: P('ceramic-candle-holders'), label: '€24' }, { img: P('boston-shaker-tins'), label: '€29' }, { img: P('acacia-serving-board'), label: '€32' }, { img: P('glass-pour-over-dripper'), label: '€38' }] },
      { t: 'type', theme: 'ink', kicker: 'Midnight tonight', headline: 'Order today. Ships by 12 December.', body: WEB, size: 'l' },
    ],
  },
  {
    n: 15,
    date: '2026-11-17',
    time: '21:00',
    format: 'Pin',
    size: 'pin',
    platforms: ['Pinterest'],
    pillar: 'Search and saves',
    set: 'The Milanese',
    headline: 'Milan-style home bar: everything for one console',
    link: '/sets/the-milanese',
    hashtags: [],
    board: 'Home bar and console styling',
    pinTitle: 'Milan-style home bar console: travertine lamp, crystal decanter, wavy mirror and shaker in one set',
    boost: 'Yes. Pinterest consideration campaign, keywords: home bar ideas, console table styling, travertine lamp.',
    brief: 'Pinterest pin, 2:3, with a search-friendly title and description.',
    alt: 'A Milan-style drinks console with a travertine lamp, crystal decanter, steel shaker, glass vase, candle holders and wavy mirror.',
    caption: `A Milan-style home bar for a console or sideboard, in one box: cut-crystal whisky decanter with four glasses, two-tin Boston cocktail shaker, travertine mushroom lamp, wavy pine-framed wall mirror, mouth-blown glass vase and two ceramic candle holders. Home bar ideas and console table styling for a living or dining room. Posted from Ireland.`,
    slides: [{ t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Milanese · €409', headline: 'Milan-style home bar: everything for one console.', size: 'm' }],
  },

  /* ───────────── Phase 2: gifting season (18 November – 24 December) ───────────── */
  {
    n: 16,
    date: '2026-11-18',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Behind the scenes',
    set: 'All',
    headline: 'The Christmas batch is closed. Here’s what happens next.',
    link: '/',
    hashtags: [...TAGS.irish, '#smallbusinessireland', '#shopirish'],
    depends: 'Slide 5 announces a second Christmas batch (orders close 30 November, ships by 18 December). If there is no second batch, use slide-05-alt.jpg, which uses the shop’s current wording.',
    boost: 'No. Organic trust post.',
    brief: 'Explains the batch model in plain words, so pre-order feels like a reason to trust, not a risk. No people or premises needed: type slides plus the contents photo.',
    alt: 'A card reading: The Christmas batch is closed. Here’s what happens next.',
    caption: `The Christmas batch closed at midnight. Thank you. Here's what happens now:

We order every piece for every set in the batch. Nothing sits in a warehouse for months.
We check each piece and pack every set in one box, here in Ireland.
Every set is posted by 12 December, and you'll get a tracking email when yours leaves.

Missed it? A second Christmas batch is open until 30 November and ships by 18 December.`,
    altCaption: `Missed it? Sets ordered now are packed to order and posted within three weeks. The date is shown in your basket before you pay.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: 'Thank you', headline: 'The Christmas batch is closed. Here’s what happens next.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'First', headline: 'We order every piece for every set in the batch.', body: 'Sets are made up in batches, so nothing sits in a warehouse for months.', size: 'l' },
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'Then', headline: 'We check each piece and pack every set in one box, in Ireland.', size: 's' },
      { t: 'type', theme: 'stone', kicker: 'By 12 December', headline: 'Every set is posted.', body: 'You get an email with tracking when yours leaves.', size: 'xl' },
      {
        t: 'type',
        theme: 'olive',
        kicker: 'Missed it?',
        headline: 'A second Christmas batch is open until 30 November.',
        body: 'Every set in it ships by 18 December.',
        size: 'l',
        alt: { t: 'type', theme: 'olive', kicker: 'Ordering now?', headline: 'Sets are packed to order and posted within three weeks.', body: 'The date is in your basket before you pay.', size: 'l' },
      },
    ],
  },
  {
    n: 17,
    date: '2026-11-19',
    time: '19:00',
    format: 'Reel',
    size: 'story',
    secs: 2.8,
    platforms: ['Instagram Reels', 'Facebook Reels'],
    pillar: 'Place and culture',
    set: 'The Milanese',
    headline: 'Milan, 7pm. What is aperitivo?',
    link: '/sets/the-milanese',
    hashtags: [...TAGS.milan, '#aperitivo', '#milanostyle'],
    audio: 'Light Italian jazz or bossa from the commercial library. Post at 19:00 Irish time (20:00 in Milan).',
    boost: 'Yes on Instagram and Facebook, 25+. Not for TikTok ads (drinks shown).',
    brief: 'A place-led reel: what aperitivo is, then the pieces that make the corner. Supplier photos throughout.',
    alt: 'A short video about aperitivo in Milan, showing a travertine lamp, a crystal decanter, candle holders and the finished Milanese console.',
    caption: `In Milan, aperitivo is the drink before dinner, usually between seven and nine in the evening.

At home it's poured from a console or sideboard kept for it: a decanter, a few good glasses, and a lamp instead of the ceiling light.

The Milanese is that corner, in one box. €409. Please enjoy responsibly.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Milan, 7pm', headline: 'What is aperitivo?', size: 'xl' },
      { t: 'type', theme: 'stone', headline: 'The drink before dinner, usually between seven and nine in the evening.', size: 'l' },
      { t: 'photo', img: P('travertine-table-lamp'), focus: '50% 60%', headline: 'At home, it’s poured from a console kept for it,', size: 'm' },
      { t: 'photo', img: P('crystal-decanter-set'), focus: '50% 60%', headline: 'with a decanter and a few good glasses,', size: 'm' },
      { t: 'photo', img: P('ceramic-candle-holders'), focus: '50% 60%', headline: 'and a lamp instead of the ceiling light.', size: 'm' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Milanese · €409', headline: 'The whole corner, in one box.', size: 'l' },
    ],
  },
  {
    n: 18,
    date: '2026-11-20',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Gifting',
    set: 'Pieces',
    headline: 'Kris Kindle sorted: five gifts under €50.',
    link: '/gifts',
    hashtags: ['#kriskindle', ...TAGS.gifts, '#shopirish', '#secretsanta'],
    boost: 'Yes. Gift-intent catalogue ad, 25+, all of Ireland. Office Kris Kindle timing.',
    brief: 'Small gifts, each a piece sold on its own. Built for saves and shares into group chats.',
    alt: 'Five gifts under €50: ceramic candle holders, a steel cocktail shaker, an acacia board, a glass coffee dripper and a blown glass vase.',
    caption: `Kris Kindle, sorted. Five gifts under €50, each sold on its own:

€24 Pair of ceramic candle holders
€29 Boston cocktail shaker, two steel tins
€32 Acacia serving board
€38 Glass pour-over dripper with jug
€44 Blown glass vase, 24 cm

Send this to the group chat.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Kris Kindle', headline: 'Five gifts under €50.', size: 'xl' },
      { t: 'photo', img: P('ceramic-candle-holders'), focus: '50% 60%', kicker: '€24', headline: 'Ceramic candle holders, a pair.', size: 'm' },
      { t: 'photo', img: P('boston-shaker-tins'), focus: '50% 55%', kicker: '€29', headline: 'Boston shaker, two steel tins.', size: 'm' },
      { t: 'split', img: P('acacia-serving-board-2'), ratio: 0.6, kicker: '€32', headline: 'Acacia serving board.', size: 'm' },
      { t: 'split', img: P('glass-pour-over-dripper'), ratio: 0.6, kicker: '€38', headline: 'Glass dripper with jug.', size: 'm' },
      { t: 'photo', img: P('blown-glass-vase'), focus: '50% 55%', kicker: '€44', headline: 'Blown glass vase, 24 cm.', size: 'm' },
      { t: 'type', theme: 'ink', kicker: 'All in the shop', headline: 'Every piece is sold on its own.', body: `${WEB}/gifts`, size: 'l' },
    ],
  },
  {
    n: 19,
    date: '2026-11-21',
    time: '09:00',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Place and mood',
    set: 'Kyoto Kissaten',
    headline: 'Three minutes. One cup. No machine.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#slowmornings', '#coffeeireland'],
    boost: 'Yes. Kyoto sales ad variant (test against post 2).',
    brief: 'The supplier’s café photo of the dripper in use, full-bleed, with a short line. Saturday morning post.',
    alt: 'An amber glass pour-over dripper on its jug on a café counter, with the words: Three minutes. One cup. No machine.',
    caption: `Pour-over takes about three minutes. Fresh grounds in a paper filter, hot water poured slowly over them, coffee dripping through into the jug.

It tastes cleaner and lighter than coffee from a machine, and it turns the first cup of the day into a small ritual.

Kyoto Kissaten has everything for it, apart from the beans. €229.`,
    slides: [{ t: 'photo', img: P('glass-pour-over-dripper-3'), focus: '50% 45%', kicker: 'Kyoto Kissaten', headline: 'Three minutes. One cup. No machine.', size: 'l' }],
  },
  {
    n: 20,
    date: '2026-11-22',
    time: '17:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Ritual and how-to',
    set: 'The Milanese',
    headline: 'Three classic cocktails for a Boston shaker.',
    link: '/journal/boston-shaker-cocktails',
    hashtags: ['#homebar', '#cocktailsathome', '#bostonshaker', '#mocktails'],
    boost: 'No. Organic only. Do not boost alcohol recipes (Irish alcohol advertising rules and platform policy).',
    brief: 'Useful content from the Journal, with an alcohol-free option and a drinkaware.ie line. Keep organic.',
    alt: 'Two polished steel Boston shaker tins, with the title: Three classic cocktails for a Boston shaker.',
    caption: `A Boston shaker is two steel tins that fit together. It's what most bartenders use, and once you know the trick it's quicker and less messy than a three-piece shaker.

Stuck? Don't twist or pull. Tap the big tin firmly just below the rim, on the side where the small tin leans away. It releases at once.

Three to start with: a whiskey sour (Irish whiskey works beautifully), the original daiquiri, and an espresso martini made with double-strength pour-over. Plus an alcohol-free shaken iced coffee.

Full recipes in the Journal. Please drink responsibly: drinkaware.ie`,
    slides: [
      { t: 'photo', img: P('boston-shaker-tins'), focus: '50% 55%', kicker: 'Home bar', headline: 'Three classic cocktails for a Boston shaker.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Won’t come apart?', headline: 'Don’t twist. Tap the big tin just below the rim.', body: 'On the side where the small tin leans away. It releases at once.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'One', headline: 'Whiskey sour.', body: 'The best way to learn the balance of strong, sour and sweet. Irish whiskey works beautifully.', size: 'xl' },
      { t: 'type', theme: 'chalk', kicker: 'Two', headline: 'Daiquiri.', body: 'Not the frozen kind. The original is three ingredients and one of the best drinks there is.', size: 'xl' },
      { t: 'type', theme: 'stone', kicker: 'Three', headline: 'Espresso martini.', body: 'No espresso machine? Pour-over made at double strength works.', size: 'xl' },
      { t: 'type', theme: 'olive', kicker: 'Without alcohol', headline: 'Shaken iced coffee.', body: '50 ml strong coffee, 15 ml syrup, plenty of ice. Shake hard for the foam.', size: 'xl' },
      { t: 'type', theme: 'ink', kicker: 'Full recipes in the Journal', headline: 'Please drink responsibly.', body: 'drinkaware.ie', size: 'l' },
    ],
  },
  {
    n: 21,
    date: '2026-11-23',
    time: '21:00',
    format: 'Pin',
    size: 'pin',
    platforms: ['Pinterest'],
    pillar: 'Search and saves',
    set: 'The Milanese',
    headline: 'How to style a console table: the five-piece formula',
    link: '/journal/how-to-style-a-console-table',
    hashtags: [],
    board: 'Home bar and console styling',
    pinTitle: 'How to style a console table: a five-piece formula that works',
    boost: 'Optional. Pinterest traffic campaign to the Journal article.',
    brief: 'A drawn-plan pin that links to the Journal article. Plans like this save well on Pinterest.',
    alt: 'A drawn top-down plan of a styled console: lamp, decanter, shaker, vase, candles and a mirror above.',
    caption: `How to style a console table with five pieces: a lamp at one end, a mirror centred above, something tall at the other end, something glass in the middle and something low at the front. Think of a triangle. Includes the narrow-hallway version and the drinks console version.`,
    slides: [{ t: 'plan', theme: 'chalk', kicker: 'Console styling', headline: 'The five-piece formula.', shapes: PLAN_MILAN, body: 'Lamp at one end, mirror above, vase at the other, glass in the middle, candles in front.' }],
  },
  {
    n: 22,
    date: '2026-11-24',
    time: '08:00',
    format: 'Reel',
    size: 'story',
    secs: 2.8,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Ritual and how-to',
    set: 'Kyoto Kissaten',
    headline: 'Do you need a gooseneck kettle?',
    link: '/products/gooseneck-kettle',
    hashtags: [...TAGS.coffee, '#coffeetips', '#gooseneckkettle'],
    audio: 'Calm instrumental from the commercial library.',
    boost: 'Yes. TikTok and Reels ad to coffee interests; the question hook works for cold audiences.',
    brief: 'An honest answer (“not strictly”), which is more persuasive than a hard sell. Supplier photos of the kettle and dripper.',
    alt: 'A short video answering whether you need a gooseneck kettle, showing the black electric gooseneck kettle and the amber glass dripper.',
    caption: `Do you need a gooseneck kettle for pour-over? Not strictly. Some people pour from a small jug and do fine.

But an ordinary kettle pours too fast and floods the coffee. A gooseneck's long, thin spout makes it much easier to pour slowly and evenly, which is where most beginners go wrong.

If you're buying a kettle anyway, buy a gooseneck. Ours is electric, 1 litre, €55, and it's in the Kyoto Kissaten set.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: 'Pour-over, honestly', headline: 'Do you need a gooseneck kettle?', size: 'xl' },
      { t: 'type', theme: 'chalk', headline: 'Not strictly. Some people pour from a small jug and do fine.', size: 'l' },
      { t: 'split', img: P('glass-pour-over-dripper'), ratio: 0.6, headline: 'But an ordinary kettle pours too fast and floods the coffee.', size: 'm' },
      { t: 'split', img: P('gooseneck-kettle'), ratio: 0.6, headline: 'A long, thin spout gives you a slow, steady stream.', size: 'm' },
      { t: 'split', img: P('gooseneck-kettle-2'), ratio: 0.6, kicker: '€55', headline: 'Electric, 1 litre, lifts off its base to pour.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Our advice', headline: 'If you’re buying a kettle anyway, buy a gooseneck.', size: 'l' },
    ],
  },
  {
    n: 23,
    date: '2026-11-25',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Gifting',
    set: 'Pieces',
    headline: 'Housewarming gifts that will still be out in a year.',
    link: '/journal/housewarming-gifts-ireland',
    hashtags: ['#housewarminggift', '#newhome', '#firsthome', '#irishhomes', '#shopirish'],
    boost: 'Yes. Facebook and Instagram, 25–44, “recently moved” and home interests.',
    brief: 'Gifts that fill a real gap in a new home, one per slide. Uses the Journal’s housewarming angle.',
    alt: 'Housewarming gift ideas: a travertine lamp, a wavy mirror, a blown glass vase and an acacia board.',
    caption: `New homes have bare corners: a hall table with nothing on it, a wall with no mirror, a counter with only the kettle.

The best housewarming gifts fill one of those gaps with something they'll keep out on display:

A lamp for the corner with no light. €139.
A mirror for the bare wall above the hall table. €149.
A vase for the first flowers. €44.
A board for the first time they have people over. €32.

Family, or a group of friends clubbing together? A whole set: The Milanese €409, Kyoto Kissaten €229.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Housewarming', headline: 'Gifts that will still be out in a year.', size: 'xl' },
      { t: 'photo', img: P('travertine-table-lamp'), focus: '50% 60%', kicker: '€139', headline: 'A lamp for the corner with no light.', size: 'm' },
      { t: 'photo', img: P('wavy-wall-mirror'), focus: '50% 35%', kicker: '€149', headline: 'A mirror for the bare wall above the hall table.', size: 'm' },
      { t: 'photo', img: P('blown-glass-vase'), focus: '50% 55%', kicker: '€44', headline: 'A vase for the first flowers.', size: 'm' },
      { t: 'split', img: P('acacia-serving-board'), ratio: 0.6, kicker: '€32', headline: 'A board for the first time they have people over.', size: 's' },
      { t: 'type', theme: 'ink', kicker: 'A group gift', headline: 'Or a whole corner.', body: 'The Milanese €409 · Kyoto Kissaten €229', size: 'xl' },
    ],
  },
  {
    n: 24,
    date: '2026-11-26',
    time: '08:00',
    format: 'Reel',
    size: 'story',
    secs: 3.0,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Product truth',
    set: 'Kyoto Kissaten',
    headline: 'Is a hand grinder worth it? An honest answer.',
    link: '/journal/is-a-hand-grinder-worth-it-hario-skerton',
    hashtags: [...TAGS.coffee, '#hario', '#coffeegrinder'],
    audio: 'Calm instrumental from the commercial library.',
    boost: 'Yes. Reels and TikTok to coffee interests. Honest-review hooks hold attention.',
    brief: 'Pros and limits from the Journal’s review of the Hario grinder. Saying where it falls short is what makes it believable.',
    alt: 'A short video reviewing the Hario hand grinder, showing the grinder and its glass jar of ground coffee.',
    caption: `We sell the Hario hand grinder, so here's both sides.

What it does well: an even grind at pour-over settings, ceramic burrs that don't rust, and it's almost silent, so it won't wake the house at 7am.

Its limits: grinding 15 g for one cup takes about a minute of steady turning, coarse settings are less even, and it's not for daily espresso.

It suits someone making one to three cups at a time, slowly. €89 on its own, or in Kyoto Kissaten.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: 'Honest review', headline: 'Is a hand grinder worth it?', size: 'xl' },
      { t: 'type', theme: 'chalk', headline: 'We sell one, so here’s both sides.', size: 'l' },
      { t: 'split', img: P('hario-hand-grinder'), ratio: 0.58, kicker: 'Good', headline: 'An even grind for pour-over. Almost silent at 7am.', size: 'm' },
      { t: 'split', img: P('hario-hand-grinder-2'), ratio: 0.58, kicker: 'Not so good', headline: 'About a minute of turning per cup.', body: 'Coarse settings are less even, and it’s not for daily espresso.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Who it suits', headline: 'One to three cups at a time, made slowly.', size: 'l' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: '€89 on its own', headline: 'Or in Kyoto Kissaten, €229.', size: 'l' },
    ],
  },
  {
    n: 25,
    date: '2026-11-27',
    time: '08:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Trust',
    set: 'All',
    headline: 'No Black Friday sale here.',
    link: '/',
    hashtags: ['#blackfriday', '#shopirish', '#irishinteriors', '#buylessbuybetter'],
    boost: 'Yes. Black Friday weekend, warm audiences. Contrarian message stands out in a feed full of percentages.',
    brief: 'Black Friday post with no discount. The everyday set saving is the offer. No “was” prices, only the real piece prices.',
    alt: 'A dark card with the words: No Black Friday sale here.',
    caption: `No Black Friday sale here. No countdown timers, no "was" prices.

What there is, every day: each set costs less than its pieces bought one by one.

Kyoto Kissaten: €279 in pieces, €229 as a set.
The Milanese: €484 in pieces, €409 as a set.

And if it's not right, you have 14 days after delivery to return it, whole or piece by piece.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: 'Black Friday', headline: 'No Black Friday sale here.', size: 'xl' },
      { t: 'type', theme: 'chalk', headline: 'No countdown timers. No “was” prices.', body: 'What there is, every day: each set costs less than its pieces bought one by one.', size: 'l' },
      {
        t: 'rows',
        theme: 'chalk',
        kicker: 'Every day',
        headline: 'Pieces vs set',
        rows: [
          { k: '**Kyoto Kissaten**, five pieces', v: '' },
          { k: 'Bought one by one', v: '€279', cls: 'strike' },
          { k: 'As a set', v: '€229', cls: 'total' },
          { k: '**The Milanese**, six pieces', v: '' },
          { k: 'Bought one by one', v: '€484', cls: 'strike' },
          { k: 'As a set', v: '€409', cls: 'total' },
        ],
      },
      { t: 'type', theme: 'stone', kicker: 'And if it’s not right', headline: '14 days to return it, whole or piece by piece.', size: 'l' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The Home Lab', headline: 'Bought once. Used every evening.', size: 'l' },
    ],
  },
  {
    n: 26,
    date: '2026-11-28',
    time: '20:00',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Place and mood',
    set: 'The Milanese',
    headline: 'A mirror doubles the candlelight.',
    link: '/products/wavy-wall-mirror',
    hashtags: [...TAGS.milan, '#wavymirror', '#interiorstyling'],
    boost: 'Optional. Product ad for the mirror (€149) to home-decor interests.',
    brief: 'The real mirror photo above the console. One idea, said simply.',
    alt: 'A tall wavy mirror with a natural pine frame above a marble console with a glass vase and a candle holder.',
    caption: `A mirror above the console doubles the lamp and candlelight in the evening, and makes the corner feel like part of the room rather than a shelf.

Ours is tall, with a wavy outline and a rounded natural pine frame. €149 on its own, or in The Milanese.

Hang it centred, with its bottom edge about 20 cm above the console.`,
    slides: [{ t: 'photo', img: MIRROR, focus: '50% 40%', kicker: 'The Milanese', headline: 'A mirror doubles the candlelight.', size: 'l' }],
  },
  {
    n: 27,
    date: '2026-11-29',
    time: '11:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Community',
    set: 'All',
    headline: 'Give €15. Get €15.',
    link: '/account/referrals',
    hashtags: ['#shopirish', '#irishhomes', '#giftideas'],
    depends: 'Needs member accounts and the referral discount live in Shopify. If not live yet, move this post to January.',
    boost: 'No. Organic and email.',
    brief: 'The member referral programme, in three facts.',
    alt: 'An olive card: Give €15. Get €15.',
    caption: `Know someone who'd love a corner of Kyoto or Milan at home?

Share your link from your account. Your friend gets €15 off their first order, and when it ships, you get €15 credit.

Sign in or create an account at thehomelab.ie.`,
    slides: [
      { t: 'type', theme: 'olive', kicker: 'Members', headline: 'Give €15. Get €15.', size: 'xl' },
      { t: 'type', theme: 'chalk', kicker: 'One', headline: 'Share your link from your account.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'Two', headline: 'Your friend gets €15 off their first order.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Three', headline: 'When it ships, you get €15 credit.', body: `${WEB}/account`, size: 'l' },
    ],
  },
  {
    n: 28,
    date: '2026-11-30',
    time: '19:00',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Deadline',
    set: 'All',
    headline: 'Last call: the second Christmas batch closes tonight.',
    link: '/',
    hashtags: [...TAGS.gifts, '#cybermonday', '#shopirish'],
    depends: 'Second Christmas batch. If there is none, post slide-01-alt.jpg with the alternate caption.',
    boost: 'Yes. Cyber Monday, warm audiences, all day.',
    brief: 'Cyber Monday deadline card.',
    alt: 'A clay card: Last call. The second Christmas batch closes tonight.',
    caption: `Last call. The second Christmas batch closes at midnight tonight, and every set in it ships by 18 December.

Kyoto Kissaten €229. The Milanese €409. Pieces from €24. Link in bio.`,
    altCaption: `Ordering today? Every set is packed to order and posted within three weeks, and the date is shown in your basket before you pay. Kyoto Kissaten €229. The Milanese €409.`,
    slides: [
      {
        t: 'type',
        theme: 'clay',
        kicker: 'Last call · Monday 30 November',
        headline: 'The second Christmas batch closes tonight.',
        body: 'Every set in it ships by 18 December.',
        size: 'l',
        alt: { t: 'type', theme: 'clay', kicker: 'Ordering today?', headline: 'Packed to order, posted within three weeks.', body: 'The date is in your basket before you pay.', size: 'l' },
      },
    ],
  },
  {
    n: 29,
    date: '2026-12-01',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Gifting',
    set: 'All',
    headline: 'A gift guide in four people.',
    link: '/gifts',
    hashtags: [...TAGS.gifts, '#giftguide', '#shopirish'],
    boost: 'Yes. Advantage+ catalogue or carousel ad, 25+, gift interests.',
    brief: 'Match the person to the gift. Fast to read, easy to share.',
    alt: 'A gift guide matching four people to gifts: the coffee person, the host, the new homeowner and the Kris Kindle.',
    caption: `A gift guide in four people:

The one who knows their café order by heart: Kyoto Kissaten, €229.
The friend whose house everyone ends up in: The Milanese, €409.
The new homeowner: the travertine lamp, €139.
The Kris Kindle: a pair of ceramic candle holders, €24.

Tag the person you're buying for. (Or the person who should be buying for you.)`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Christmas', headline: 'A gift guide in four people.', size: 'xl' },
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'The one who knows their café order by heart', headline: 'Kyoto Kissaten, €229.', size: 'm' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The friend whose house everyone ends up in', headline: 'The Milanese, €409.', size: 'm' },
      { t: 'photo', img: P('travertine-table-lamp'), focus: '50% 60%', kicker: 'The new homeowner', headline: 'Travertine lamp, €139.', size: 'm' },
      { t: 'photo', img: P('ceramic-candle-holders'), focus: '50% 60%', kicker: 'The Kris Kindle', headline: 'Candle holders, €24.', size: 'm' },
      { t: 'type', theme: 'ink', kicker: 'More ideas', headline: 'The full gift guide is on our site.', body: `${WEB}/gifts`, size: 'l' },
    ],
  },
  {
    n: 30,
    date: '2026-12-02',
    time: '22:00',
    format: 'Reel',
    size: 'story',
    secs: 2.8,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Place and mood',
    set: 'Kyoto Kissaten',
    headline: 'It’s 7am in Kyoto.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#kyoto', '#slowmornings'],
    audio: 'Quiet, warm piano or ambient from the commercial library.',
    boost: 'Yes. Kyoto awareness, Reels and TikTok.',
    brief: 'Post at 22:00 Irish time, which is exactly 07:00 in Kyoto in winter. A slow, quiet reel about the morning ritual.',
    alt: 'A short video: it’s 7am in Kyoto, showing the kettle, the hand grinder, the glass dripper and the cups from the Kyoto Kissaten set.',
    caption: `Right now it's 7am in Kyoto. Somewhere on a side street, a coffee house is opening.

The kettle goes on. Beans are ground by hand. Water is poured slowly, one cup at a time.

Kyoto Kissaten is that counter, in one box. Yours tomorrow morning, if you like.`,
    slides: [
      { t: 'type', theme: 'ink', native: '喫茶店', kicker: 'Right now', headline: 'It’s 7am in Kyoto.', size: 'xl', valign: 'flex-start' },
      { t: 'type', theme: 'ink', headline: 'Somewhere on a side street, a coffee house is opening.', size: 'l' },
      { t: 'split', img: P('gooseneck-kettle'), ratio: 0.6, headline: 'The kettle goes on.', size: 'l' },
      { t: 'split', img: P('hario-hand-grinder'), ratio: 0.6, headline: 'Beans are ground by hand.', size: 'l' },
      { t: 'split', img: P('glass-pour-over-dripper-3'), fit: 'cover', ratio: 0.6, headline: 'Water is poured slowly, one cup at a time.', size: 'm' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: 'Kyoto Kissaten · €229', headline: 'The counter, in one box.', size: 'l' },
    ],
  },
  {
    n: 31,
    date: '2026-12-03',
    time: '21:00',
    format: 'Pin',
    size: 'pin',
    platforms: ['Pinterest'],
    pillar: 'Search and saves',
    set: 'Kyoto Kissaten',
    headline: 'Gifts for coffee lovers in Ireland, by budget',
    link: '/journal/gifts-for-coffee-lovers-ireland',
    hashtags: [],
    board: 'Christmas gift ideas Ireland',
    pinTitle: 'Gifts for coffee lovers in Ireland: an honest guide by budget',
    boost: 'Yes. Pinterest, keywords: coffee gifts, gifts for coffee lovers, christmas gifts ireland.',
    brief: 'Grid pin of four coffee pieces with prices, linking to the Journal’s coffee gift guide.',
    alt: 'Four coffee gifts with prices: acacia board €32, glass dripper €38, gooseneck kettle €55 and Hario grinder €89.',
    caption: `Gifts for coffee lovers in Ireland, by budget: an acacia serving board (€32), a glass pour-over dripper with jug (€38), an electric gooseneck kettle (€55), a Hario ceramic hand grinder (€89), or the full Kyoto Kissaten pour-over set (€229). Posted from Ireland, no customs charges.`,
    slides: [{ t: 'grid', theme: 'chalk', kicker: 'Gift guide', headline: 'Gifts for coffee lovers in Ireland, by budget.', cells: [{ img: P('acacia-serving-board'), label: '€32' }, { img: P('glass-pour-over-dripper'), label: '€38' }, { img: P('gooseneck-kettle'), label: '€55' }, { img: P('hario-hand-grinder'), label: '€89' }], body: 'Or all of it, as Kyoto Kissaten: €229.' }],
  },
  {
    n: 32,
    date: '2026-12-04',
    time: '20:00',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Place and mood',
    set: 'The Milanese',
    headline: 'Crystal, stone and candlelight.',
    link: '/sets/the-milanese',
    hashtags: [...TAGS.milan, '#colourpalette', '#interiorstyling'],
    boost: 'Optional. Pinterest and Instagram, home-decor interests.',
    brief: 'The set’s palette (from the set page) under the real set photo. Palette posts save well with interiors audiences.',
    alt: 'The Milanese set above five colour swatches: travertine, Calacatta marble, polished steel, whisky amber and natural pine.',
    caption: `The Milanese, as a palette: travertine, Calacatta marble, polished steel, whisky amber and natural pine.

Milan homes are known for these materials: stone, polished metal, cut glass and plaster walls, lit low in the evening. The set uses the same ones on one console.`,
    slides: [{ t: 'palette', img: MILAN, focus: '50% 70%', kicker: 'The Milanese', headline: 'Crystal, stone and candlelight.', swatches: [{ name: 'Travertine', hex: '#D9CBB4' }, { name: 'Calacatta marble', hex: '#ECE8E1' }, { name: 'Polished steel', hex: '#B9BCBE' }, { name: 'Whisky amber', hex: '#B06A2B' }, { name: 'Natural pine', hex: '#B98B5A' }] }],
  },
  {
    n: 33,
    date: '2026-12-05',
    time: '10:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Ritual and how-to',
    set: 'Kyoto Kissaten',
    headline: 'Pour-over, cafetière or moka pot?',
    link: '/journal/pour-over-vs-cafetiere-vs-moka-pot',
    hashtags: [...TAGS.coffee, '#cafetiere', '#mokapot'],
    boost: 'Optional. Engagement ad; comparison posts get comments.',
    brief: 'A fair comparison from the Journal. Recommending the cafetière for busy mornings is what makes the pour-over pitch credible.',
    alt: 'A comparison of three coffee methods: pour-over, cafetière and moka pot.',
    caption: `Most Irish kitchens already have a cafetière, and plenty have a moka pot from a holiday in Italy. So is pour-over worth adding?

Cafetière: full and heavy. The easiest method, and great for several people.
Moka pot: strong, close to espresso. Best if you like lattes at home.
Pour-over: clean and light. Best if you drink coffee black and like tasting different beans.

Plenty of people keep two: a cafetière for busy mornings, pour-over for the slow weekend cup. Which are you?`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'Coffee at home', headline: 'Pour-over, cafetière or moka pot?', size: 'xl' },
      { t: 'type', theme: 'stone', kicker: 'The cafetière', headline: 'Full and heavy.', body: 'Choose it if you want the easiest method or make coffee for several people at once. For a busy weekday it is hard to beat.', size: 'xl' },
      { t: 'type', theme: 'chalk', kicker: 'The moka pot', headline: 'Strong, close to espresso.', body: 'Choose it if you like strong coffee or make lattes at home. Take it off the heat as soon as it gurgles.', size: 'xl' },
      { t: 'split', img: P('glass-pour-over-dripper-3'), fit: 'cover', ratio: 0.5, kicker: 'Pour-over', headline: 'Clean and light.', body: 'Choose it if you drink coffee black and like tasting the difference between beans.', size: 'l' },
      { t: 'type', theme: 'ink', kicker: 'Our answer', headline: 'Keep two.', body: 'A cafetière for busy mornings. Pour-over for the slow weekend cup.', size: 'xl' },
    ],
  },
  {
    n: 34,
    date: '2026-12-07',
    time: '12:30',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Gifting',
    set: 'All',
    headline: 'Too late to post? Gift a place.',
    link: '/products/e-gift-card',
    hashtags: ['#lastminutegifts', ...TAGS.gifts, '#shopirish'],
    depends: 'E-gift cards set up in Shopify and shown on the site. If not, post slide-01-alt.jpg (the printed-photo idea) with the alternate caption.',
    boost: 'Yes. From 7 to 24 December, all warm audiences plus gift interests.',
    brief: 'The e-gift card, for the weeks when nothing physical can be promised before Christmas.',
    alt: 'An olive card with the brand pattern: Too late to post? Gift a place.',
    caption: `Too late to post? Gift a place instead.

Home Lab e-gift cards arrive by email, so they're ready for Christmas morning, and they can be spent on any set or piece in the new year, including Riad Corner when it opens.`,
    altCaption: `Cutting it fine? Order the set, print a photo of it, and wrap that with a note saying it's on its way. It's a lovely Christmas morning moment, and much less stressful than refreshing a tracking page on Christmas Eve.`,
    slides: [
      {
        t: 'pattern',
        kicker: 'E-gift cards',
        headline: 'Too late to post? Gift a place.',
        body: 'Arrives by email. Spend it on any set or piece.',
        size: 'l',
        alt: { t: 'type', theme: 'olive', kicker: 'Cutting it fine?', headline: 'Wrap a photo of it, with a note saying it’s on its way.', size: 'l' },
      },
    ],
  },
  {
    n: 35,
    date: '2026-12-09',
    time: '08:00',
    format: 'Reel',
    size: 'story',
    secs: 2.6,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Place and mood',
    set: 'Kyoto Kissaten',
    headline: 'Christmas morning, 8am.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#christmasmorning', '#slowmornings'],
    audio: 'A gentle Christmas instrumental from the commercial library (no copyrighted pop songs).',
    boost: 'Yes. Kyoto awareness and gift-card ads in December.',
    brief: 'A small story of the gift being used. Supplier photos only.',
    alt: 'A short video: Christmas morning, 8am, with the kettle, grinder, dripper and four cups of the Kyoto Kissaten set.',
    caption: `Christmas morning, 8am. Everyone else is still asleep.

Kettle on. Fifteen grams, ground by hand. Three minutes of pouring. Four cups on the board for when they wake up.

Kyoto Kissaten. €229.`,
    slides: [
      { t: 'type', theme: 'ink', kicker: '25 December', headline: 'Christmas morning, 8am.', size: 'xl' },
      { t: 'type', theme: 'ink', headline: 'Everyone else is still asleep.', size: 'l' },
      { t: 'split', img: P('gooseneck-kettle'), ratio: 0.6, headline: 'Kettle on.', size: 'xl' },
      { t: 'split', img: P('hario-hand-grinder-2'), ratio: 0.6, headline: 'Fifteen grams, ground by hand.', size: 'l' },
      { t: 'split', img: P('glass-pour-over-dripper'), ratio: 0.6, headline: 'Three minutes of pouring.', size: 'l' },
      { t: 'split', img: P('handleless-cups'), ratio: 0.6, headline: 'Four cups, for when they wake up.', size: 'l' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: '€229', headline: 'Kyoto Kissaten.', size: 'xl' },
    ],
  },
  {
    n: 36,
    date: '2026-12-11',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Customer care',
    set: 'All',
    headline: 'Christmas sets are on their way. Here’s what’s in the box.',
    link: '/',
    hashtags: ['#irishinteriors', '#shopirish', '#christmasdelivery'],
    boost: 'No. Organic, for customers and their followers.',
    brief: 'For people who have ordered (and the people watching them): what arrives, what arrives separately, and where the set-up guides are. Cuts down “where is my order” emails.',
    alt: 'Everything in the Kyoto Kissaten box, with the words: Christmas sets are on their way.',
    caption: `Christmas sets are on their way. Every set in the batch is posted by tomorrow, 12 December, and you'll get a tracking email when yours leaves.

What's in the box, so you can check it off:

Kyoto Kissaten: dripper with jug and filters, gooseneck kettle, Hario grinder, four cups in their gift box, acacia board.
The Milanese: decanter with four glasses, stones and tray, shaker tins, travertine lamp, wavy mirror, glass vase, two candle holders.

Add-ons like the console table come separately by courier, by the same date. Set-up guides are on each set page.`,
    slides: [
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'Posted by 12 December', headline: 'Christmas sets are on their way.', size: 'm' },
      { t: 'rows', theme: 'chalk', kicker: 'In the box', headline: 'Kyoto Kissaten', rows: [{ k: 'Glass dripper with jug, and filters', v: '1' }, { k: 'Electric gooseneck kettle', v: '1' }, { k: 'Hario hand grinder', v: '1' }, { k: 'Handleless cups, in a gift box', v: '4' }, { k: 'Acacia serving board', v: '1' }] },
      { t: 'rows', theme: 'chalk', kicker: 'In the box', headline: 'The Milanese', rows: [{ k: 'Decanter, glasses, stones and tray', v: '1' }, { k: 'Boston shaker tins', v: '2' }, { k: 'Travertine table lamp', v: '1' }, { k: 'Wavy wall mirror', v: '1' }, { k: 'Blown glass vase', v: '1' }, { k: 'Ceramic candle holders', v: '2' }] },
      { t: 'type', theme: 'stone', kicker: 'Separately', headline: 'Add-ons arrive by courier, by the same date.', body: 'Like the Manhattan console table and the Tempo tub chair.', size: 'l' },
      { t: 'type', theme: 'ink', kicker: 'When it arrives', headline: 'The set-up guide is on each set page.', body: 'Anything damaged in transit? Tell us within 7 days with a photo and we’ll put it right.', size: 'l' },
    ],
  },
  {
    n: 37,
    date: '2026-12-15',
    time: '19:00',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Gifting',
    set: 'All',
    headline: 'Arrives by email. Opens on Christmas morning.',
    link: '/products/e-gift-card',
    hashtags: ['#lastminutegifts', ...TAGS.gifts, '#shopirish'],
    depends: 'E-gift cards live. If not, post slide-01-alt.jpg with the alternate caption.',
    boost: 'Yes. Gift-card ad, warm audiences.',
    brief: 'E-gift card reminder in the brand pattern.',
    alt: 'An olive patterned card: Arrives by email. Opens on Christmas morning.',
    caption: `Ten days to Christmas, and nothing left to post? A Home Lab e-gift card arrives by email, ready to print or forward on Christmas morning. Spend it on any set or piece.`,
    altCaption: `Ten days to go. Save this for Christmas Eve: every set page has a step-by-step set-up guide, so the gift works the moment it's unwrapped.`,
    slides: [
      {
        t: 'pattern',
        kicker: 'E-gift cards',
        headline: 'Arrives by email. Opens on Christmas morning.',
        size: 'l',
        alt: { t: 'type', theme: 'olive', kicker: 'Ten days to go', headline: 'Every set comes with a set-up guide.', body: 'On each set page, step by step.', size: 'l' },
      },
    ],
  },
  {
    n: 38,
    date: '2026-12-16',
    time: '19:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Ritual and how-to',
    set: 'The Milanese',
    headline: 'Set up The Milanese in six steps.',
    link: '/sets/the-milanese',
    hashtags: [...TAGS.milan, '#stylingtips', '#christmasdecor'],
    boost: 'No. Organic and saves.',
    brief: 'The set-up guide from the set page, with the drawn plan. Timed for people unpacking their sets before Christmas.',
    alt: 'A six-step guide to setting up The Milanese console, with the finished set and a drawn plan.',
    caption: `Setting up The Milanese before Christmas? Six steps:

1. Hang the mirror centred over the console, its bottom edge about 20 cm above the top.
2. Lamp at one end, vase at the other.
3. Decanter and glasses towards the lamp, stones on their tray beside them.
4. Shaker tins next to the glasses, the small tin inside the large one.
5. Candle holders at the front. Light the tealights, turn the lamp on.
6. Turn the main light off. Pour a drink.`,
    slides: [
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'Save this', headline: 'Set up The Milanese in six steps.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Step 1 of 6', headline: 'Hang the mirror centred, its bottom edge about 20 cm above the console.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Step 2 of 6', headline: 'Lamp at one end. Vase at the other.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Step 3 of 6', headline: 'Decanter and glasses towards the lamp, stones on their tray beside them.', size: 'm' },
      { t: 'type', theme: 'stone', kicker: 'Step 4 of 6', headline: 'Shaker tins next to the glasses, the small tin inside the large one.', size: 'm' },
      { t: 'type', theme: 'chalk', kicker: 'Step 5 of 6', headline: 'Candles at the front. Light them. Turn the lamp on.', size: 'm' },
      { t: 'type', theme: 'ink', kicker: 'Step 6 of 6', headline: 'Turn the main light off. Pour a drink.', size: 'l' },
      { t: 'plan', theme: 'chalk', kicker: 'The Milanese', headline: 'The plan.', shapes: PLAN_MILAN },
    ],
  },
  {
    n: 39,
    date: '2026-12-18',
    time: '12:30',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Community',
    set: 'All',
    headline: 'Show us your corner.',
    link: '/',
    hashtags: ['#MyHomeLabCorner', '#irishinteriors', '#irishhomes'],
    boost: 'No. Organic. Starts the customer-photo library.',
    brief: 'Invites customers to share photos of their set at home. This is how the brand gets real-home photos without any shoots. Ask permission in a DM before resharing or using any photo in ads.',
    alt: 'An olive card: Show us your corner. Use #MyHomeLabCorner.',
    caption: `Got your set? Show us your corner.

Post a photo of it at home, tag us and use #MyHomeLabCorner. We'll share our favourites, always with your permission first.`,
    slides: [{ t: 'type', theme: 'olive', kicker: '#MyHomeLabCorner', headline: 'Show us your corner.', body: 'Got your set? Post a photo of it at home and tag us. We’ll share our favourites, with your permission.', size: 'xl' }],
  },
  {
    n: 40,
    date: '2026-12-21',
    time: '12:30',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Gifting',
    set: 'All',
    headline: 'Still time: e-gift cards until Christmas Eve.',
    link: '/products/e-gift-card',
    hashtags: ['#lastminutegifts', '#christmasgiftsireland', '#shopirish'],
    depends: 'E-gift cards live. If not, post slide-01-alt.jpg with the alternate caption.',
    boost: 'Yes. Last gift-card push, 21–24 December.',
    brief: 'Final gift-card reminder. Ink background for contrast with posts 34 and 37.',
    alt: 'A dark card: Still time. E-gift cards until Christmas Eve.',
    caption: `Still time. Home Lab e-gift cards arrive by email, right up to Christmas Eve. Link in bio.`,
    altCaption: `Thank you to everyone who brought a corner of Kyoto or Milan home this Christmas. Our first one. We're very grateful.`,
    slides: [
      {
        t: 'type',
        theme: 'ink',
        kicker: 'E-gift cards',
        headline: 'Still time. Until Christmas Eve.',
        body: 'Arrives by email. Spend it on any set or piece.',
        size: 'xl',
        alt: { t: 'type', theme: 'ink', kicker: 'Thank you', headline: 'Our first Christmas. Thank you for bringing a place home.', size: 'l' },
      },
    ],
  },
  {
    n: 41,
    date: '2026-12-24',
    time: '10:00',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook'],
    pillar: 'Brand',
    set: 'All',
    headline: 'Nollaig shona daoibh.',
    link: '/',
    hashtags: ['#nollaigshona', '#irishhomes', '#shopirish'],
    boost: 'No.',
    brief: 'Christmas greeting in Irish, on the Milanese evening photo.',
    alt: 'The Milanese console in candlelight, with the words: Nollaig shona daoibh.',
    caption: `Nollaig shona daoibh. Happy Christmas from The Home Lab.

Thank you for bringing a place home with us this year.`,
    slides: [{ t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'Happy Christmas from The Home Lab', headline: 'Nollaig shona daoibh.', size: 'xl' }],
  },

  /* ───────────── Phase 3: new year and Riad Corner (January) ───────────── */
  {
    n: 42,
    date: '2027-01-02',
    time: '09:00',
    format: 'Static',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Ritual and how-to',
    set: 'Kyoto Kissaten',
    headline: 'A slower first cup for the new year.',
    link: '/sets/kyoto-kissaten',
    hashtags: [...TAGS.coffee, '#newyear', '#slowmornings'],
    boost: 'Yes. January Kyoto campaign (self-purchase, gift-card redemption).',
    brief: 'January resolution angle without the diet-culture language: a slower morning, not a better you.',
    alt: 'An amber glass dripper and jug with a box of filters, with the words: A slower first cup for the new year.',
    caption: `No resolutions here. Just one small change worth keeping: a slower first cup.

Three minutes at the counter. A kettle, a hand grinder, a glass dripper and a cup you hold in both hands.

Kyoto Kissaten, €229. Got a Home Lab gift card for Christmas? This is a good place to spend it.`,
    slides: [{ t: 'split', img: P('glass-pour-over-dripper-2'), ratio: 0.62, kicker: 'New year', headline: 'A slower first cup.', body: 'Kyoto Kissaten · €229', size: 'l' }],
  },
  {
    n: 43,
    date: '2027-01-05',
    time: '19:00',
    format: 'Reel',
    size: 'story',
    secs: 2.8,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Launch',
    set: 'Riad Corner',
    headline: 'Next stop: Marrakech.',
    link: '/sets/riad-corner',
    hashtags: TAGS.riad.concat(['#marrakech', '#irishinteriors']),
    audio: 'Warm instrumental with oud or hand percussion from the commercial library.',
    boost: 'Yes. Waitlist campaign (leads to the Riad Corner page, goal: email sign-ups).',
    brief: 'Teaser for the third set. No product photos exist yet, so it uses the brand pattern, the palette and the drawn plan. Upgrade option: add licensed stock video of a riad courtyard (search “Marrakech riad courtyard”), labelled as a scene.',
    alt: 'A short video teasing Riad Corner, with a Moroccan star pattern, the word riad in Arabic, the set’s colour palette and a drawn plan of the corner.',
    caption: `Next stop: Marrakech.

A riad is a traditional house built around an open courtyard. Inside, people sit low, on rugs, poufs and cushions, and guests are always offered mint tea.

Riad Corner brings that corner home: a hand-knotted rag rug, a wool pouf, a brass tray, a teapot, six painted tea glasses and a pierced brass lantern.

Opening soon. Leave your email on the set page to hear first.`,
    slides: [
      { t: 'pattern', native: 'رياض', kicker: 'Coming soon', headline: 'Next stop: Marrakech.', size: 'l' },
      { t: 'type', theme: 'olive', bgPattern: true, headline: 'A riad is a house built around an open courtyard.', size: 'l' },
      { t: 'type', theme: 'chalk', headline: 'Inside, people sit low: on rugs, poufs and cushions.', size: 'l' },
      { t: 'type', theme: 'stone', headline: 'And guests are always offered mint tea.', size: 'l' },
      { t: 'plan', theme: 'chalk', kicker: 'Riad Corner', headline: 'Rug, pouf, tray, teapot, six glasses, lantern.', shapes: PLAN_RIAD, size: 'xs' },
      { t: 'pattern', kicker: 'Riad Corner', headline: 'Opening soon.', body: 'Leave your email on the set page to hear first.', size: 'xl' },
    ],
  },
  {
    n: 44,
    date: '2027-01-07',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Place and culture',
    set: 'Riad Corner',
    headline: 'What is a riad?',
    link: '/sets/riad-corner',
    hashtags: TAGS.riad.concat(['#marrakech', '#moroccanstyle']),
    boost: 'Optional. Engagement ad to travel and Morocco interests; builds the waitlist audience.',
    brief: 'Place explainer from the Riad Corner set page, all type and pattern (no product photos yet).',
    alt: 'The word riad in Arabic on a Moroccan star pattern, with the question: What is a riad?',
    caption: `What is a riad?

A traditional house in Marrakech, built around an open courtyard. Inside, people sit low: on rugs, poufs and cushions rather than sofas.

Guests are always offered mint tea, poured from a height into small glasses and served on a brass tray.

And the rugs? Boucherouite: a Moroccan tradition of knotting strips of old cloth into bright, bold rugs. Every one is different.

Riad Corner opens soon.`,
    slides: [
      { t: 'pattern', native: 'رياض', kicker: 'Marrakech', headline: 'What is a riad?', size: 'xl' },
      { t: 'type', theme: 'chalk', kicker: 'The house', headline: 'A traditional house built around an open courtyard.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'The seating', headline: 'People sit low, on rugs, poufs and cushions rather than sofas.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'The tea', headline: 'Mint tea, poured from a height into small glasses, on a brass tray.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'The rug', headline: 'Boucherouite: old cloth, knotted by hand into bright, bold rugs.', body: 'Every one is different.', size: 'l' },
      { t: 'pattern', kicker: 'Riad Corner', headline: 'Opening soon.', body: 'Leave your email on the set page to hear first.', size: 'xl' },
    ],
  },
  {
    n: 45,
    date: '2027-01-09',
    time: '16:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Ritual and how-to',
    set: 'Riad Corner',
    headline: 'How to make Moroccan mint tea.',
    link: '/sets/riad-corner',
    hashtags: ['#minttea', '#moroccanminttea', ...TAGS.riad.slice(0, 2), '#teatime'],
    boost: 'Optional. Recipe posts are cheap to promote and build the Riad audience.',
    brief: 'The recipe from the Riad Corner FAQ, one step per slide. Saturday afternoon post.',
    alt: 'A step-by-step guide to Moroccan mint tea, on a Moroccan star pattern.',
    caption: `How to make Moroccan mint tea:

1. Rinse a spoonful of green gunpowder tea with hot water.
2. Add a handful of fresh mint, and sugar to taste.
3. Add boiling water and steep for a few minutes.
4. Pour from a height into small glasses, so it froths.

Why from a height? It cools the tea and puts a little foam on top. That's what the long, curved spout of a Moroccan teapot is for.`,
    slides: [
      { t: 'pattern', kicker: 'Riad Corner', headline: 'How to make Moroccan mint tea.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Step 1 of 4', headline: 'Rinse a spoonful of green gunpowder tea with hot water.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'Step 2 of 4', headline: 'Add a handful of fresh mint, and sugar to taste.', size: 'l' },
      { t: 'type', theme: 'chalk', kicker: 'Step 3 of 4', headline: 'Add boiling water. Steep for a few minutes.', size: 'l' },
      { t: 'type', theme: 'stone', kicker: 'Step 4 of 4', headline: 'Pour from a height into small glasses, so it froths.', size: 'l' },
      { t: 'type', theme: 'olive', bgPattern: true, kicker: 'Why from a height?', headline: 'It cools the tea and puts a little foam on top.', body: 'That’s what the long spout of a Moroccan teapot is for.', size: 'l' },
    ],
  },
  {
    n: 46,
    date: '2027-01-12',
    time: '12:30',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Styling',
    set: 'All',
    headline: 'New home this year? Start with one corner.',
    link: '/',
    hashtags: ['#newhome', '#firsthome', '#irishhomes', '#interiorstyling'],
    boost: 'Yes. January new-home campaign, 25–44, recently moved.',
    brief: 'Matches each set to a part of the home, with the space each one needs (from the set pages).',
    alt: 'Three corners for a new home: a kitchen counter, a console and a reading corner.',
    caption: `New home this year? You don't have to finish every room at once. Start with one corner:

The kitchen counter: Kyoto Kissaten needs about 60 × 30 cm.
The console or sideboard: The Milanese needs about 120 × 40 cm and the wall above it.
The reading corner: Riad Corner needs about 150 × 200 cm of floor. Opening soon.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'New home', headline: 'Start with one corner.', size: 'xl' },
      { t: 'split', img: KYOTO, ratio: 0.5, kicker: 'The kitchen counter · 60 × 30 cm', headline: 'Kyoto Kissaten, €229.', size: 'm' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'The console · 120 × 40 cm', headline: 'The Milanese, €409.', size: 'm' },
      { t: 'pattern', kicker: 'The reading corner · 150 × 200 cm', headline: 'Riad Corner, opening soon.', size: 'm' },
      { t: 'type', theme: 'ink', kicker: 'Every piece has a job', headline: 'One box per corner.', body: WEB, size: 'xl' },
    ],
  },
  {
    n: 47,
    date: '2027-01-14',
    time: '21:00',
    format: 'Pin',
    size: 'pin',
    platforms: ['Pinterest'],
    pillar: 'Search and saves',
    set: 'Riad Corner',
    headline: 'Moroccan reading corner: the six pieces',
    link: '/sets/riad-corner',
    hashtags: [],
    board: 'Moroccan corner ideas',
    pinTitle: 'Moroccan reading corner ideas: rag rug, wool pouf, brass tray, teapot, tea glasses and lantern',
    boost: 'Yes. Pinterest waitlist campaign, keywords: moroccan decor, reading nook ideas, boho corner.',
    brief: 'Plan pin for Pinterest search, linking to the waitlist.',
    alt: 'A drawn plan of a Moroccan reading corner: rag rug, pouf with tea tray, and lantern.',
    caption: `A Moroccan reading corner, the riad way: a hand-knotted boucherouite rag rug, a wool Beni Ourain-style pouf, a hand-engraved brass tea tray, a Moroccan teapot, six painted tea glasses and a pierced brass lantern. Reading nook and tea corner ideas for a living room, bedroom or spare room.`,
    slides: [{ t: 'plan', theme: 'chalk', kicker: 'Riad Corner · opening soon', headline: 'A Moroccan reading corner, in six pieces.', shapes: PLAN_RIAD, body: 'Rag rug, wool pouf, brass tray, teapot, six tea glasses and a pierced lantern.' }],
  },
  {
    n: 48,
    date: '2027-01-16',
    time: '10:00',
    format: 'Carousel',
    size: 'feed',
    platforms: ['Instagram', 'Facebook', 'Pinterest'],
    pillar: 'Styling',
    set: 'Riad Corner',
    headline: 'One corner, three ways.',
    link: '/sets/riad-corner',
    hashtags: [...TAGS.riad, '#smallspaces', '#irishhomes'],
    boost: 'Optional. Waitlist audience builder.',
    brief: 'Three drawn plans showing where Riad Corner fits in an ordinary Irish home.',
    alt: 'Three drawn floor plans showing a Moroccan tea corner under a window, in a bedroom and in a spare room.',
    caption: `One corner, three ways. Riad Corner needs about 150 × 200 cm of floor:

Under a window: rug with its short side to the wall, an armchair along the long side.
In a bedroom: rug in the corner beside the bed, lantern at the back.
In a spare room: rug in the middle, floor cushions along two walls.

Where would yours go?`,
    slides: [
      { t: 'pattern', kicker: 'Riad Corner', headline: 'One corner, three ways.', size: 'xl' },
      {
        t: 'plan',
        theme: 'chalk',
        kicker: 'One',
        headline: 'Under a window.',
        shapes: [
          { shape: 'rect', x: 2, y: 2, w: 96, h: 66, stroke: 'var(--muted)' },
          { shape: 'rect', x: 30, y: 0.5, w: 40, h: 3, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Window', ly: 5.4, fs: 20 },
          { shape: 'rect', x: 24, y: 8, w: 52, h: 33, fill: 'rgba(194,86,61,.22)', label: 'Rug', ly: 29, fs: 22 },
          { shape: 'circle', x: 44, y: 18, w: 12, h: 12, label: 'Pouf and tray', ly: -2, fs: 20 },
          { shape: 'rect', x: 8, y: 14, w: 13, h: 14, label: 'Armchair', ly: 18, fs: 20 },
          { shape: 'circle', x: 84, y: 8, w: 6, h: 6, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Lantern', ly: 10, fs: 20 },
        ],
      },
      {
        t: 'plan',
        theme: 'chalk',
        kicker: 'Two',
        headline: 'In a bedroom corner.',
        shapes: [
          { shape: 'rect', x: 2, y: 2, w: 96, h: 66, stroke: 'var(--muted)' },
          { shape: 'rect', x: 52, y: 22, w: 44, h: 44, fill: 'var(--bg)', label: 'Bed', fs: 24 },
          { shape: 'rect', x: 4, y: 4, w: 42, h: 28, fill: 'rgba(194,86,61,.22)', label: 'Rug', ly: 23, fs: 22 },
          { shape: 'circle', x: 20, y: 12, w: 11, h: 11, label: 'Pouf', ly: -2, fs: 20 },
          { shape: 'circle', x: 6, y: 40, w: 6, h: 6, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Lantern', ly: 9, fs: 20 },
        ],
      },
      {
        t: 'plan',
        theme: 'chalk',
        kicker: 'Three',
        headline: 'In a spare room.',
        shapes: [
          { shape: 'rect', x: 2, y: 2, w: 96, h: 66, stroke: 'var(--muted)' },
          { shape: 'rect', x: 22, y: 14, w: 56, h: 40, fill: 'rgba(194,86,61,.22)', label: 'Rug', ly: 6, fs: 22 },
          { shape: 'circle', x: 44, y: 28, w: 12, h: 12, label: 'Pouf and tray', ly: 17, fs: 20 },
          { shape: 'rect', x: 4, y: 10, w: 8, h: 48, label: 'Cushions', ly: -3, fs: 20 },
          { shape: 'rect', x: 22, y: 58, w: 56, h: 8, label: 'Cushions', ly: -3, fs: 20 },
          { shape: 'circle', x: 86, y: 8, w: 6, h: 6, fill: 'var(--accent)', stroke: 'var(--accent)', label: 'Lantern', ly: 10, fs: 20 },
        ],
      },
      { t: 'pattern', kicker: 'Riad Corner', headline: 'Where would yours go?', body: 'Opening soon. Leave your email on the set page.', size: 'l' },
    ],
  },
  {
    n: 49,
    date: '2027-01-19',
    time: '12:30',
    format: 'Static',
    size: 'feed',
    variants: ['story'],
    platforms: ['Instagram', 'Instagram Stories', 'Facebook'],
    pillar: 'Launch',
    set: 'Riad Corner',
    headline: 'Riad Corner: six pieces, one box.',
    link: '/sets/riad-corner',
    hashtags: [...TAGS.riad, '#marrakech', '#irishinteriors'],
    boost: 'Yes. Waitlist ad to everyone who engaged with posts 43–48.',
    brief: 'The full piece list, ahead of launch. Rows card, no product photos needed.',
    alt: 'A list of the six pieces in Riad Corner: rag rug, wool pouf, brass tea tray, teapot, six tea glasses and a pierced brass lantern.',
    caption: `Riad Corner: six pieces, one box.

A Moroccan rag rug, knotted by hand in Marrakech from recycled fabric.
A wool pouf in a Beni Ourain pattern.
A hand-engraved brass tea tray.
A Moroccan teapot with a long spout.
Six painted tea glasses.
A pierced brass lantern that throws stars across the walls.

The rug, pouf and lantern are made by hand, so they take longer to arrive. Opening soon: leave your email on the set page to hear first.`,
    slides: [
      {
        t: 'rows',
        theme: 'olive',
        kicker: 'Riad Corner · opening soon',
        headline: 'Six pieces, one box.',
        size: 'm',
        rows: [
          { k: 'Moroccan rag rug, knotted by hand', v: '158 × 98 cm' },
          { k: 'Wool pouf, Beni Ourain pattern', v: '50 cm' },
          { k: 'Brass tea tray, hand-engraved', v: '35 cm' },
          { k: 'Moroccan teapot', v: '600 ml' },
          { k: 'Painted tea glasses', v: '6' },
          { k: 'Pierced brass lantern', v: '35 cm' },
        ],
      },
    ],
  },
  {
    n: 50,
    date: '2027-01-21',
    time: '19:00',
    format: 'Reel',
    size: 'story',
    secs: 2.6,
    platforms: ['Instagram Reels', 'Facebook Reels', 'TikTok'],
    pillar: 'Brand',
    set: 'All',
    headline: 'Three places. One box each.',
    link: '/',
    hashtags: [...TAGS.irish, '#roomideas', '#interiorstyling'],
    audio: 'The brand’s signature track: pick one calm instrumental from the commercial library and reuse it across brand reels.',
    boost: 'Yes. Evergreen brand reel for always-on awareness from February.',
    brief: 'Brand recap that works all year: the three places, the three moments and the promise.',
    alt: 'A short video: three places, one box each. Kyoto Kissaten, The Milanese and Riad Corner.',
    caption: `Three places. One box each.

Kyoto, 7am: a Japanese coffee counter. Kyoto Kissaten.
Milan, 7pm: an evening drinks corner. The Milanese.
Marrakech, any time: a low tea corner with lantern light. Riad Corner, opening soon.

Every piece has a job. Packed and posted from Ireland.`,
    slides: [
      { t: 'type', theme: 'chalk', kicker: 'The Home Lab', headline: 'Three places. One box each.', size: 'xl' },
      { t: 'split', img: KYOTO, ratio: 0.45, kicker: 'Kyoto, 7am', headline: 'Kyoto Kissaten.', body: 'A Japanese coffee counter.', size: 'l' },
      { t: 'photo', img: MILAN, focus: '50% 70%', kicker: 'Milan, 7pm', headline: 'The Milanese.', body: 'An evening drinks corner.', size: 'l' },
      { t: 'pattern', native: 'رياض', kicker: 'Marrakech, any time', headline: 'Riad Corner.', body: 'Opening soon.', size: 'l' },
      { t: 'type', theme: 'ink', headline: 'Every piece has a job.', body: 'Packed and posted from Ireland.', size: 'xl' },
    ],
  },
];

// No repeated hashtags, and never more than five (Instagram's limit).
for (const post of POSTS) post.hashtags = [...new Set(post.hashtags)].slice(0, 5);
