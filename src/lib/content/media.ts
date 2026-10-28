/**
 * Development photography.
 *
 * Every image here is a free photo from Unsplash (unsplash.com/license: free
 * for commercial use, no attribution required). They stand in for The Home
 * Lab's own photography and supplier product shots, and they do NOT show the
 * exact pieces in the sets. Swap the ids here (or move to
 * Shopify media) and the whole site updates.
 *
 * Ids are the `photo-…` part of an images.unsplash.com URL.
 */
export interface Photo {
  id: string;
  alt: string;
  /** Focal point for object-position, e.g. '50% 60%'. */
  focus?: string;
}

const UNSPLASH = 'https://images.unsplash.com/';

export function photoUrl(id: string, width = 1600, quality = 75) {
  // A path starting with "/" is a photo kept in /public (e.g. a supplier's own product shot).
  if (id.startsWith('/')) return id;
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const isUnsplash = (src: string) => src.startsWith(UNSPLASH);

/** next/image loader: Unsplash resizes on its CDN, so no server-side optimisation is needed. */
export function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  return url.toString();
}

/** Room and editorial photography. */
export const SCENES = {
  hero: { id: 'photo-1745429523617-0d837856ca35', alt: 'A calm living room in warm neutral tones with a low sofa and soft daylight', focus: '50% 55%' },
  heroPortrait: { id: 'photo-1632935190508-bd46801c14af', alt: 'A bright living room with a sofa and a painting on the wall' },
  livingRoom: { id: 'photo-1649083048381-520a5b3d91ff', alt: 'A living room with pale upholstered furniture on wooden floors' },
  livingRoomAlt: { id: 'photo-1762544968153-b9b47435fefd', alt: 'A living room with tan leather chairs in front of a fireplace' },
  bedroom: { id: 'photo-1722942723511-11c7603d003c', alt: 'A bedroom with a large made bed and a plant in the corner' },
  bedroomPortrait: { id: 'photo-1780672823770-dc40e2181cdf', alt: 'A bright bedroom with white bedding, a wooden headboard and a nightstand' },
  dining: { id: 'photo-1696986296905-e631802befb0', alt: 'A dining table with chairs and a vase of flowers' },
  diningPortrait: { id: 'photo-1770646403987-64cf5c08c870', alt: 'A dining table and chairs in a sunlit room' },
  lighting: { id: 'photo-1772208392480-2ad69429769a', alt: 'A sofa in a dim room lit by a floor lamp behind it' },
  lightingPortrait: { id: 'photo-1786075235955-350ef4d4a7f7', alt: 'A wooden tripod floor lamp casting warm light against a dark wall' },
  evening: { id: 'photo-1769117549887-d7ab37279060', alt: 'A dimly lit living room in the evening with framed art on the wall' },
  storage: { id: 'photo-1758279745605-1e03b0d62613', alt: 'A hallway with a staircase, a mirror and a low cabinet' },
  storagePortrait: { id: 'photo-1758279745939-d116fdfb8f29', alt: 'A hallway with a round mirror above a cabinet' },
  accessories: { id: 'photo-1725169412537-acd1cd15e10f', alt: 'A group of ceramic vases on a tabletop' },
  accessoriesPortrait: { id: 'photo-1623276234990-c74be03fd36a', alt: 'Shelves styled with vases and objects' },
  coffee: { id: 'photo-1768674150936-1d2044ba32d6', alt: 'A pour-over coffee maker and kettle on a wooden table' },
  coffeePortrait: { id: 'photo-1780643891270-001e7815711f', alt: 'A kitchen counter with coffee brewing equipment in warm light' },
  readingCorner: { id: 'photo-1759448867521-08b5f26d32bc', alt: 'Two chairs and a small table by a window' },
  sunlight: { id: 'photo-1781771760142-1b04201fa6d8', alt: 'Warm sunlight casting sharp shadows across a room with plants' },
  windowLight: { id: 'photo-1748244452961-58bf389efa6c', alt: 'Sunlight casting the shadow of a window onto a wall' },
  shelfDetail: { id: 'photo-1578257807782-565256d20935', alt: 'Vases on a wooden floating shelf' },
  coffeeTable: { id: 'photo-1688728147390-6925695b443f', alt: 'A coffee table with a book and a vase' },
} satisfies Record<string, Photo>;

/** Room set photography: a wide hero, a tall crop for phones, a detail and a full-bleed band. */
export const SET_SCENES = {
  kyotoHero: { id: 'photo-1767840272045-b1419f025dc3', alt: 'A quiet café interior with wooden chairs and tables', focus: '50% 60%' },
  kyotoTall: { id: 'photo-1747852222501-e03aeccd2093', alt: 'Hot water being poured over coffee grounds in a dripper' },
  kyotoDetail: { id: 'photo-1783206695207-aa4deabafa7b', alt: 'A ceramic coffee dripper sitting on a glass carafe' },
  kyotoBand: { id: 'photo-1788947965792-87181a9a81f9', alt: 'Coffee brewers on a café counter with cherry blossom outside the window' },
  milaneseHero: { id: '/images/sets/milanese/set.jpg', alt: 'The Milanese set on a white marble console: a travertine mushroom lamp, a crystal decanter with cut glasses, two steel shaker tins, a grey and white glass vase, two brown ceramic candle holders, and a wavy pine mirror on the wall above', focus: '50% 70%' },
  milaneseTall: { id: '/images/sets/milanese/mirror.jpg', alt: 'A wavy mirror with a pine frame on a panelled wall above a marble console, with a glass vase and a candle holder' },
  milaneseLamp: { id: '/images/pieces/travertine-table-lamp.jpg', alt: 'A travertine table lamp with a mushroom shade on a marble console' },
  milaneseDecanter: { id: '/images/pieces/crystal-decanter-set.jpg', alt: 'A cut crystal decanter of whisky with two cut glasses on a marble console' },
  milaneseBand: { id: '/images/sets/milanese/set.jpg', alt: 'The Milanese set laid out on a marble console under a wavy pine mirror', focus: '50% 70%' },
  riadHero: { id: 'photo-1759250451654-72ab594ba2c9', alt: 'A courtyard with patterned tiles and arched colonnades' },
  riadTall: { id: 'photo-1770712338702-87ce3b131f25', alt: 'A traditional Moroccan archway hung with textiles' },
  riadDetail: { id: 'photo-1770872938037-390c2f1a987f', alt: 'A low, layered seating corner with plants and textiles' },
  riadBand: { id: 'photo-1786437548087-3ff73341a247', alt: 'A pierced metal lantern in a niche of a textured plaster wall' },
} satisfies Record<string, Photo>;

/**
 * Photos for each set (its product images) and for each piece shown in
 * "What's in the box". Paths starting with "/" are the supplier's own photos of
 * the exact piece, kept in /public; the rest are stock photos of similar items.
 */
export const PRODUCT_PHOTOS: Record<string, Photo[]> = {
  'kyoto-kissaten': [
    { id: '/images/sets/kyoto/contents.jpg', alt: 'Everything in the Kyoto Kissaten set: four handleless cups in a gift box, an amber glass dripper on its jug, a black gooseneck kettle, a Hario hand grinder and a long acacia board' },
    { id: 'photo-1767840272045-b1419f025dc3', alt: 'A quiet café interior with wooden chairs and tables' },
  ],
  'the-milanese': [
    { id: '/images/sets/milanese/set.jpg', alt: 'Everything in The Milanese set on a marble console: travertine lamp, crystal decanter and glasses, shaker tins, glass vase, two candle holders and the wavy pine mirror above' },
    { id: '/images/sets/milanese/mirror.jpg', alt: 'The wavy pine mirror above a marble console' },
  ],
  'riad-corner': [{ id: 'photo-1770872938037-390c2f1a987f', alt: 'A low, layered seating corner with plants and textiles' }],
  // Kyoto Kissaten
  'glass-pour-over-dripper': [
    { id: '/images/pieces/glass-pour-over-dripper.jpg', alt: 'An amber glass pour-over dripper sitting on its matching glass jug with a wooden band', focus: '50% 40%' },
    { id: '/images/pieces/glass-pour-over-dripper-2.jpg', alt: 'The amber glass dripper and jug next to the box of paper filters that comes with it' },
    { id: '/images/pieces/glass-pour-over-dripper-3.jpg', alt: 'The amber glass dripper and jug on a café counter, with coffee in the jug' },
  ],
  'gooseneck-kettle': [
    { id: '/images/pieces/gooseneck-kettle.jpg', alt: 'A matt black electric gooseneck kettle with a brown handle, on its brown base' },
    { id: '/images/pieces/gooseneck-kettle-2.jpg', alt: 'The gooseneck kettle with its lid lifted and its power base set apart' },
  ],
  'handleless-cups': [
    { id: '/images/pieces/handleless-cups.jpg', alt: 'Four handleless ceramic cups in dark iron, speckled green, red and cream glazes, in an open pale blue gift box' },
  ],
  'acacia-serving-board': [
    { id: '/images/pieces/acacia-serving-board.jpg', alt: 'A long acacia wood serving board with a handle, seen from above' },
    { id: '/images/pieces/acacia-serving-board-2.jpg', alt: 'The acacia serving board from the side, showing its low feet' },
  ],
  'hario-hand-grinder': [
    { id: '/images/pieces/hario-hand-grinder.jpg', alt: 'A Hario hand coffee grinder with a black top, crank handle and glass jar' },
    { id: '/images/pieces/hario-hand-grinder-2.jpg', alt: 'The Hario grinder taken apart: the glass jar of ground coffee with its lid beside the grinder' },
  ],
  // The Milanese
  'crystal-decanter-set': [
    { id: '/images/pieces/crystal-decanter-set.jpg', alt: 'A square cut crystal decanter with a stopper, filled with whisky, beside two cut crystal glasses and chilling stones' },
    { id: '/images/pieces/crystal-decanter-set-2.jpg', alt: 'The decanter, four glasses, chilling stones and wooden tray laid out in their black and gold gift box' },
  ],
  'boston-shaker-tins': [{ id: '/images/pieces/boston-shaker-tins.jpg', alt: 'Two polished steel Boston shaker tins, one large and one small, on a marble console' }],
  'travertine-table-lamp': [{ id: '/images/pieces/travertine-table-lamp.jpg', alt: 'A travertine table lamp with a round mushroom shade on a tapered base' }],
  'ceramic-candle-holders': [{ id: '/images/pieces/ceramic-candle-holders.jpg', alt: 'Two round brown glazed ceramic candle holders with cut-out sides, lit with tealights' }],
  'wavy-wall-mirror': [{ id: '/images/pieces/wavy-wall-mirror.jpg', alt: 'A tall wall mirror with a wavy outline and a rounded natural pine frame' }],
  'blown-glass-vase': [{ id: '/images/pieces/blown-glass-vase.jpg', alt: 'A tall blown glass vase with a wavy rim, grey at the base fading to white' }],
  // Add-ons (supplier photo, kept in /public)
  'tempo-tub-chair': [{ id: '/images/pieces/tempo-tub-chair.jpg', alt: 'A grey fabric tub chair with dark feet in a bright living room' }],
  'manhattan-console': [
    { id: '/images/pieces/manhattan-console.jpg', alt: 'A cream console table with a marble-effect top, fluted drawers, gold handles and a gold frame, styled in a hallway' },
    { id: '/images/pieces/manhattan-console-2.jpg', alt: 'Close-up of the console corner: the marble-effect top, fluted cream drawer front, gold handle and gold frame' },
  ],
  // Riad Corner
  'boucherouite-rug': [{ id: 'photo-1757356884685-685e62b442ce', alt: 'Colourful woven Moroccan rugs with bold geometric patterns' }],
  'beni-ourain-pouf': [{ id: 'photo-1781255575628-d645cc39160f', alt: 'Colourful cushions and woven poufs on a wooden floor' }],
  'engraved-brass-tray': [{ id: 'photo-1518439532222-5dcc881e74b8', alt: 'A Moroccan teapot and tea glasses on a tray on a rooftop table' }],
  'engraved-moroccan-teapot': [{ id: 'photo-1541168350939-a118c5c13b4d', alt: 'A Moroccan metal teapot pouring tea into a glass' }],
  'painted-tea-glasses': [{ id: 'photo-1763571494240-e88c4ae18742', alt: 'Two decorated Moroccan tea glasses with a geometric pattern' }],
  'pierced-brass-lantern': [{ id: 'photo-1779599790541-2f50889661ed', alt: 'An ornate metal lantern glowing on a dark wall' }],
};
