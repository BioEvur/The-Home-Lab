/**
 * DEVELOPMENT CATALOGUE: the room sets.
 *
 * Each set is one product with one variant, so it is one price and one basket
 * line. The pieces inside a set are described in `src/lib/content/sets.ts`
 * and are also sold on their own (PIECE_PRODUCTS below). A set always costs
 * less than its pieces bought one by one; a test checks this.
 *
 * Prices are sample figures until supplier prices are confirmed. In Shopify,
 * each set is a product in the `room-sets` collection with the same handle.
 */
import type { SampleProductSpec } from './sample-data';
import { ADD_ONS } from '../content/addons';
import { ROOM_SETS } from '../content/sets';

export const SET_PRODUCTS: SampleProductSpec[] = [
  {
    handle: 'kyoto-kissaten',
    title: 'Kyoto Kissaten',
    productType: 'Room set',
    category: 'coffee-kitchen',
    extraCollections: ['room-sets'],
    short: 'A Japanese coffee corner: a glass pour-over dripper with jug, a gooseneck kettle, a Hario hand grinder, four handleless cups and an acacia board.',
    description:
      'Everything for making filter coffee by hand the way Japan’s old coffee houses do: an amber glass pour-over dripper with its own 400 ml jug, an electric gooseneck kettle, a Hario ceramic hand grinder, four handleless ceramic cups in a gift box and a long acacia serving board.',
    features: ['Five pieces', 'Packed together in one box', 'Brewing guide on the set page'],
    materials: ['Glass', 'Ceramic', 'Acacia wood', 'Steel'],
    materialFamilies: ['Ceramic', 'Glass', 'Wood', 'Metal'],
    dimensions: { notes: 'Laid out, the set takes about 60 × 30 cm of counter.' },
    weightKg: 3.2,
    care: 'See each piece for care.',
    assembly: null,
    tags: ['room set', 'set', 'bundle', 'coffee', 'japanese', 'kyoto', 'gift'],
    related: [],
    isNew: true,
    createdAt: '2026-10-15',
    rank: 1,
    defaultTone: 'smoked-oak',
    options: [],
    basePrice: 22900,
  },
  {
    handle: 'the-milanese',
    title: 'The Milanese',
    productType: 'Room set',
    category: 'living-room',
    extraCollections: ['room-sets'],
    short: 'A Milan-style drinks corner: a crystal decanter with four glasses, a cocktail shaker, a travertine lamp, a wavy pine mirror, a blown glass vase and two candle holders.',
    description:
      'An evening drinks corner for a console or sideboard: a cut crystal whisky decanter with four glasses and chilling stones, a two-tin Boston cocktail shaker, a travertine table lamp, a wavy wall mirror with a pine frame, a 24 cm blown glass vase and a pair of ceramic candle holders.',
    features: ['Six pieces', 'Set-up guide on the set page'],
    materials: ['Crystal', 'Stainless steel', 'Travertine', 'Pinewood', 'Glass', 'Ceramic'],
    materialFamilies: ['Glass', 'Metal', 'Stone', 'Wood', 'Ceramic'],
    dimensions: { notes: 'Fits a console or sideboard about 120 × 40 cm, with the mirror on the wall above.' },
    weightKg: 10,
    care: 'See each piece for care.',
    assembly: null,
    tags: ['room set', 'set', 'bundle', 'milan', 'italian', 'home bar', 'drinks', 'gift'],
    related: [],
    isNew: true,
    createdAt: '2026-10-23',
    rank: 2,
    defaultTone: 'travertine',
    options: [],
    basePrice: 40900,
  },
  {
    handle: 'riad-corner',
    title: 'Riad Corner',
    productType: 'Room set',
    category: 'living-room',
    extraCollections: ['room-sets'],
    short: 'A Moroccan tea corner: a rag rug, a wool pouf, a brass tea tray and teapot, six tea glasses and a brass lantern.',
    description:
      'A low, warm corner in the manner of a Marrakech riad: a Moroccan rag rug, a wool pouf to sit on, a brass tea tray, a Moroccan teapot, six painted tea glasses and a pierced brass lantern.',
    features: ['Six pieces', 'Handmade pieces vary slightly', 'Arranging guide on the set page'],
    materials: ['Recycled textile', 'Wool', 'Brass', 'Glass'],
    materialFamilies: ['Wool', 'Metal', 'Glass'],
    dimensions: { notes: 'Needs a floor area of about 150 × 200 cm.' },
    weightKg: 10.5,
    care: 'See each piece for care.',
    assembly: 'Fill the pouf before use.',
    tags: ['room set', 'set', 'bundle', 'moroccan', 'riad', 'reading corner', 'marrakech'],
    related: [],
    isNew: true,
    createdAt: '2026-10-15',
    rank: 3,
    defaultTone: 'rust',
    options: [],
    basePrice: 42500,
    unavailable: ['Default'],
  },
];

/** Every piece in every set, sold on its own at its own price. */
export const PIECE_PRODUCTS: SampleProductSpec[] = ROOM_SETS.flatMap((set) =>
  set.pieces.map((piece, i) => ({
    handle: piece.handle,
    title: piece.name,
    productType: 'Piece',
    category: SET_PRODUCTS.find((p) => p.handle === set.handle)!.category,
    extraCollections: ['pieces', `set-${set.handle}`],
    short: piece.what,
    description: `${piece.what} ${piece.note}`,
    features: piece.soldAs ? [piece.soldAs] : [],
    materials: [],
    materialFamilies: [],
    dimensions: null,
    weightKg: null,
    care: piece.details.find((d) => d.label === 'Care')?.value ?? null,
    assembly: null,
    tags: ['piece', set.place.toLowerCase()],
    related: [set.handle],
    createdAt: '2026-10-19',
    rank: 10 + i,
    defaultTone: SET_PRODUCTS.find((p) => p.handle === set.handle)!.defaultTone,
    options: [],
    basePrice: piece.price,
    unavailable: set.status === 'coming-soon' ? ['Default'] : [],
  })),
);

/** Add-ons, at their own price; the basket takes the set discount off. */
export const ADD_ON_PRODUCTS: SampleProductSpec[] = ADD_ONS.map((a) => ({
  handle: a.handle,
  title: a.title,
  productType: 'Add-on',
  category: 'living-room',
  extraCollections: ['add-ons'],
  short: a.what,
  description: `${a.what} ${a.note}`,
  features: [a.delivery],
  materials: [],
  materialFamilies: [],
  dimensions: null,
  weightKg: null,
  care: null,
  assembly: null,
  tags: ['add-on'],
  related: a.sets,
  createdAt: '2026-10-19',
  rank: 30,
  defaultTone: 'charcoal',
  options: [],
  basePrice: a.price,
}));
