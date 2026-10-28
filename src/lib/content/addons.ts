/**
 * Add-ons: larger pieces that go with a set but are not packed in its box.
 * They are delivered separately, and cost less when bought with any room set.
 *
 * The basket shows the add-on discount while a room set is in it. In Shopify,
 * set up the same rule as an automatic discount ("buy any product in
 * room-sets, get this add-on at the lower price") so checkout agrees; see
 * docs/SHOPIFY.md.
 *
 * Tempo tub chair (confirmed by MPD, 20 Oct 2026): trade €90 ex VAT, couriered
 * by Fastway straight to the customer, unbranded, €17, 2-3 days. Photo use OK.
 * Manhattan console (Muiz, 27 Oct 2026): trade €238.80 ex VAT, about €294 with
 * VAT. Courier cost and arrival date still to confirm with MPD.
 */
import { isRoomSetHandle } from './sets';

export interface AddOn {
  handle: string;
  title: string;
  /** Which set pages offer it. */
  sets: string[];
  /** In cents. */
  price: number;
  withSetPrice: number;
  what: string;
  note: string;
  details: { label: string; value: string }[];
  delivery: string;
  photo: { src: string; alt: string };
}

export const ADD_ONS: AddOn[] = [
  {
    handle: 'tempo-tub-chair',
    title: 'Tempo tub chair',
    sets: ['kyoto-kissaten'],
    price: 22900,
    withSetPrice: 18900,
    what: 'A compact armchair with a rounded tub back, upholstered in soft grey fabric on dark feet. Small enough for a kitchen corner or beside a window.',
    note: 'Somewhere to sit with the first cup. It turns the coffee corner into a place you stay, rather than a counter you stand at.',
    details: [
      { label: 'Upholstery', value: 'Grey woven fabric' },
      { label: 'Feet', value: 'Dark tapered feet' },
      { label: 'Size', value: 'Measurements to follow' },
    ],
    delivery: 'Delivered separately from the set box by courier, by the same ship-by date as your order.',
    photo: { src: '/images/pieces/tempo-tub-chair.jpg', alt: 'A grey fabric tub chair with dark feet in a bright living room' },
  },
  {
    handle: 'manhattan-console',
    title: 'Manhattan console table',
    sets: ['the-milanese'],
    price: 54900,
    withSetPrice: 47900,
    what: 'A console table, 120 cm wide, in a cream finish with a marble-effect top, two fluted drawers with gold handles, and a gold-coloured metal frame for legs.',
    note: 'The surface the whole set stands on. It is the same width as the set layout, with the lamp at one end, the vase at the other and the mirror on the wall above.',
    details: [
      { label: 'Size', value: 'W 120 × D 36 × H 77 cm' },
      { label: 'Finish', value: 'Cream with a marble-effect top' },
      { label: 'Storage', value: 'Two drawers with gold handles' },
      { label: 'Frame', value: 'Gold-coloured metal' },
      { label: 'Assembly', value: 'Arrives assembled' },
    ],
    delivery: 'Delivered separately from the set box by courier, by the same ship-by date as your order.',
    photo: { src: '/images/pieces/manhattan-console.jpg', alt: 'A cream console table with a marble-effect top, fluted drawers, gold handles and a gold frame, styled in a hallway' },
  },
];

export const getAddOn = (handle: string) => ADD_ONS.find((a) => a.handle === handle) ?? null;
export const addOnsForSet = (setHandle: string) => ADD_ONS.filter((a) => a.sets.includes(setHandle));

/**
 * The add-on discounts for a basket: each room set in it takes the discount
 * off one add-on, so two chairs with one set get one discount.
 */
export function addOnDiscounts(lines: { handle: string; quantity: number }[]) {
  const sets = lines.filter((l) => isRoomSetHandle(l.handle)).reduce((n, l) => n + l.quantity, 0);
  return ADD_ONS.flatMap((addOn) => {
    const quantity = Math.min(
      lines.filter((l) => l.handle === addOn.handle).reduce((n, l) => n + l.quantity, 0),
      sets,
    );
    return quantity ? [{ addOn, quantity, amount: (addOn.price - addOn.withSetPrice) * quantity }] : [];
  });
}
