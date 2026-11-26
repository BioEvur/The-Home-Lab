/**
 * Gift boxes: a smaller way into a set, held in stock and posted quickly.
 *
 * A gift box is two or three pieces from a room set, packed together at a
 * lower price than the pieces bought one by one (a test checks this). Unlike
 * the full sets, a box is bought ahead and kept in stock, so it is posted
 * within a couple of working days instead of with a batch.
 *
 * Until the stock arrives (`postedFrom`), the box can be pre-ordered and the
 * page says the date it will be posted from. Change the dates here and the
 * box page, homepage, shop and basket all follow.
 *
 * Kissaten pour-over box (26 Nov 2026): Green Life dripper with jug and the
 * 4-cup handleless gift set, both from one supplier, so one minimum order.
 * About €62 landed at estimated wholesale prices; check against the invoice.
 *
 * In Shopify, create each box as a product with the same handle, product type
 * `Gift box`, in a collection with the handle `gift-boxes`. See docs/SHOPIFY.md.
 */
import { dublinToday, formatDay } from './batches';

export interface GiftBox {
  handle: string;
  title: string;
  /** The room set the pieces come from. */
  set: string;
  /** Handles of the set pieces packed in the box. */
  pieces: string[];
  /** In cents. */
  price: number;
  what: string;
  note: string;
  details: { label: string; value: string }[];
  /** The first day boxes can be posted (the stock is in hand), YYYY-MM-DD. */
  postedFrom: string;
  /** Last day to order for Christmas delivery, YYYY-MM-DD. Leave empty outside the season. */
  christmasOrderBy?: string;
}

export const GIFT_BOXES: GiftBox[] = [
  {
    handle: 'kissaten-pour-over-box',
    title: 'Kissaten pour-over gift box',
    set: 'kyoto-kissaten',
    pieces: ['glass-pour-over-dripper', 'handleless-cups'],
    price: 8500,
    what: 'The heart of the Kyoto Kissaten set in one gift box: the amber glass pour-over dripper with its own 400 ml jug and a pack of paper filters, and four handleless ceramic cups in their own gift box. Add ground coffee and a kettle, and it makes three or four cups the way Japan’s old coffee houses do.',
    note: 'A smaller way to start. If they love it, the gooseneck kettle, the Hario grinder and the acacia board complete the set later, and each is sold on its own.',
    details: [
      { label: 'In the box', value: 'Glass dripper with 400 ml jug, paper filters, four handleless cups' },
      { label: 'Cups', value: 'Glazed ceramic, about 180 ml each, four different glazes' },
      { label: 'You add', value: 'Ground coffee and hot water from any kettle' },
      { label: 'Posted', value: 'From Ireland, so no customs charges' },
    ],
    postedFrom: '2026-12-07',
    christmasOrderBy: '2026-12-16',
  },
];

export const getGiftBox = (handle: string) => GIFT_BOXES.find((b) => b.handle === handle) ?? null;
export const isGiftBoxHandle = (handle: string) => GIFT_BOXES.some((b) => b.handle === handle);
export const giftBoxesForSet = (setHandle: string) => GIFT_BOXES.filter((b) => b.set === setHandle);

/** The words for ordering a box today: in stock or not, and the Christmas date while it applies. */
export function giftBoxCopy(box: GiftBox, now = new Date()) {
  const today = dublinToday(now);
  const inStock = today >= box.postedFrom;
  const christmas = box.christmasOrderBy && today <= box.christmasOrderBy ? ` Order by ${formatDay(box.christmasOrderBy)} for Christmas.` : '';
  const posted = inStock ? 'In stock. Posted within two working days.' : `Posted from ${formatDay(box.postedFrom)}.`;
  return {
    inStock,
    cta: inStock ? 'Add to basket' : 'Pre-order the box',
    line: `${posted}${christmas}`,
    basket: posted,
  };
}
