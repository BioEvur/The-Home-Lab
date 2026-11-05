/**
 * Campaign landing pages: one per gift idea, each built from the catalogue,
 * the set content in `sets.ts` and the batch dates in `batches.ts`. Copy that
 * is only used on one page lives here; prices, pieces and dates never do.
 *
 * The images under /images/landing are made from our own product photos by
 * `scripts/landing-images.mjs` (re-compositions, crops and an evening grade).
 */

export const LANDING_PAGES = [
  { href: '/coffee-gifts', title: 'The pour-over gift', line: 'For coffee lovers' },
  { href: '/home-bar', title: 'The drinks corner', line: 'For hosts and cocktail fans' },
  { href: '/housewarming', title: 'For a first home', line: 'Housewarming gifts' },
  { href: '/kris-kindle', title: 'Kris Kindle, sorted', line: 'Gifts under €50' },
  { href: '/riad-waitlist', title: 'Riad Corner, first look', line: 'Opening in the new year' },
] as const;

const IMG = '/images/landing';

/** /coffee-gifts: the brew, in four moments, each with its own studio tile. */
export const COFFEE_MOMENTS = [
  {
    title: 'Boil',
    piece: 'gooseneck-kettle',
    image: { src: `${IMG}/coffee-kettle.jpg`, alt: 'The black gooseneck kettle on a pale stone background' },
    text: 'Fill the kettle, boil it and let it sit for a minute, so the water is about 93°C. The long spout is what makes a slow, steady pour possible.',
  },
  {
    title: 'Grind',
    piece: 'hario-hand-grinder',
    image: { src: `${IMG}/coffee-grinder.jpg`, alt: 'The Hario hand grinder with its glass jar, on a pale clay background' },
    text: 'Weigh 15 g of beans and grind them medium-fine, like coarse sea salt. Freshly ground beans are the biggest single difference to the cup.',
  },
  {
    title: 'Bloom and pour',
    piece: 'glass-pour-over-dripper',
    image: { src: `${IMG}/coffee-dripper.jpg`, alt: 'The amber glass dripper sitting on its jug, on a chalk background' },
    text: 'Wet the grounds and wait 30 seconds while they bloom, then pour the rest in slow circles until the jug shows 250 ml, over about two minutes.',
  },
  {
    title: 'Serve',
    piece: 'handleless-cups',
    image: { src: `${IMG}/coffee-cups.jpg`, alt: 'Four handleless glazed cups in their gift box, on a pale sage background' },
    text: 'Pour into the cups on the acacia board. Rinse everything with hot water; the dripper needs no soap.',
  },
] as const;

/** /home-bar: three classics from the Journal guide, each shot in the set's evening light. */
export const COCKTAILS = [
  {
    id: 'whiskey-sour',
    name: 'Whiskey sour',
    image: { src: `${IMG}/bar-decanter.jpg`, alt: 'The cut crystal decanter of whisky and two glasses in low evening light' },
    items: ['50 ml Irish whiskey', '25 ml fresh lemon juice', '15 to 20 ml simple syrup', 'A few drops of Angostura bitters'],
    method: 'Shake hard with ice, strain over fresh ice in a rocks glass and dot the bitters on top.',
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    image: { src: `${IMG}/bar-shaker.jpg`, alt: 'The two steel Boston shaker tins on the marble console in evening light' },
    items: ['50 ml white rum', '25 ml fresh lime juice', '15 ml simple syrup'],
    method: 'Shake hard with ice and strain into a chilled coupe. Adjust the syrup to your limes next time.',
  },
  {
    id: 'espresso-martini',
    name: 'Espresso martini',
    image: { src: `${IMG}/bar-candles.jpg`, alt: 'Two brown ceramic candle holders lit with tealights on the console' },
    items: ['40 ml vodka', '25 ml coffee liqueur', '25 ml strong coffee, cooled slightly', '5 to 10 ml simple syrup'],
    method: 'Shake very hard with plenty of ice for the foam, strain into a chilled coupe and float three coffee beans on top.',
  },
] as const;

/** Where each piece sits in /images/landing/bar-console.jpg, as % of the image. */
export const CONSOLE_SPOTS: { handle: string; x: number; y: number }[] = [
  { handle: 'travertine-table-lamp', x: 14, y: 40 },
  { handle: 'crystal-decanter-set', x: 36, y: 58 },
  { handle: 'boston-shaker-tins', x: 63, y: 56 },
  { handle: 'blown-glass-vase', x: 81, y: 42 },
  { handle: 'ceramic-candle-holders', x: 92, y: 74 },
];

/** /housewarming: a few first things, room by room. */
export const HOME_ROOMS = [
  {
    id: 'hall',
    title: 'The hall',
    text: 'The first thing anyone sees when they open the door. A mirror for the bare wall, a lamp for the dark corner and a vase for the first flowers.',
    image: { src: '/images/pieces/travertine-table-lamp.jpg', alt: 'A travertine table lamp with a mushroom shade on a marble console' },
    pieces: ['wavy-wall-mirror', 'travertine-table-lamp', 'blown-glass-vase'],
  },
  {
    id: 'kitchen',
    title: 'The kitchen counter',
    text: 'Proper coffee on the first weekend morning in the new place, served on a board that will see every cheese plate after it.',
    image: { src: `${IMG}/home-counter.jpg`, alt: 'Four handleless cups in their box and an amber glass dripper behind a long acacia serving board' },
    pieces: ['glass-pour-over-dripper', 'handleless-cups', 'acacia-serving-board'],
  },
  {
    id: 'evening',
    title: 'The first evening in',
    text: 'For the night the boxes are finally unpacked: candlelight and a drink poured from something nicer than the bottle.',
    image: { src: '/images/pieces/ceramic-candle-holders.jpg', alt: 'Two brown ceramic candle holders with cut-out sides, lit with tealights' },
    pieces: ['ceramic-candle-holders', 'crystal-decanter-set', 'boston-shaker-tins'],
  },
] as const;

/** /kris-kindle: one plain line on who each piece suits, and its gift-tag image. */
export const KRIS_KINDLE: Record<string, { forWhom: string; image: { src: string; alt: string } }> = {
  'ceramic-candle-holders': {
    forWhom: 'The colleague whose desk has a candle on it already.',
    image: { src: `${IMG}/kk-candles.jpg`, alt: 'Two brown ceramic candle holders lit with tealights' },
  },
  'boston-shaker-tins': {
    forWhom: 'Whoever brings the cocktails to every party.',
    image: { src: `${IMG}/kk-shaker.jpg`, alt: 'Two polished steel Boston shaker tins' },
  },
  'acacia-serving-board': {
    forWhom: 'The one who always arrives with cheese.',
    image: { src: `${IMG}/kk-board.jpg`, alt: 'A long acacia serving board with a handle' },
  },
  'glass-pour-over-dripper': {
    forWhom: 'The person who talks about their coffee order.',
    image: { src: `${IMG}/kk-dripper.jpg`, alt: 'An amber glass pour-over dripper on its jug' },
  },
  'blown-glass-vase': {
    forWhom: 'Anyone who buys themselves flowers.',
    image: { src: `${IMG}/kk-vase.jpg`, alt: 'A tall blown glass vase, grey fading to white' },
  },
};

/** /riad-waitlist: why this set takes longer, and the tea it is built around. */
export const RIAD = {
  handmade: [
    { title: 'The rug', text: 'A boucherouite, knotted by hand in Marrakech from strips of recycled fabric. Every one is different.' },
    { title: 'The pouf', text: 'Handwoven wool in a Beni Ourain checkerboard. It arrives unfilled so it travels flat; fill it with old cushions.' },
    { title: 'The lantern', text: 'Pierced brass, made by hand. With a candle inside it throws star-shaped light across the walls.' },
  ],
  tea: [
    'Rinse a spoonful of green gunpowder tea with a little hot water and pour it away.',
    'Add a handful of fresh mint, sugar to taste and boiling water.',
    'Let it steep for a few minutes.',
    'Pour from a height into small glasses, so it froths.',
  ],
};
