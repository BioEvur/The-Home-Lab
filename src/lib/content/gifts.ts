/**
 * The Christmas gift guide at /gifts. Each section points at a room set and
 * a few single pieces; prices come from the catalogue.
 */
export interface GiftSection {
  id: string;
  title: string;
  intro: string;
  set?: { handle: string; text: string };
  pieces: string[];
  /** Pieces chosen by price instead of by hand, in cents. */
  maxPrice?: number;
}

export const GIFT_SECTIONS: GiftSection[] = [
  {
    id: 'coffee',
    title: 'For coffee lovers',
    intro:
      'For the person who knows their café order by heart, or who has just started buying beans. Pour-over is the slow, hand-poured method behind the cleanest cup of black coffee, and it needs no machine.',
    set: {
      handle: 'kyoto-kissaten',
      text: 'Everything for pour-over coffee at home, in one box: an amber glass dripper with its jug, an electric gooseneck kettle, a Hario ceramic hand grinder, four handleless cups and an acacia board. Add a bag of beans from their favourite Irish roaster and it is ready on Christmas morning.',
    },
    pieces: ['hario-hand-grinder', 'gooseneck-kettle', 'glass-pour-over-dripper', 'handleless-cups'],
  },
  {
    id: 'hosts',
    title: 'For hosts and cocktail fans',
    intro:
      'For the friend whose house everyone ends up in, or the one who has taken up cocktails. A proper drinks corner turns a sideboard into the place the evening starts.',
    set: {
      handle: 'the-milanese',
      text: 'A Milan-style drinks console in one box: a cut-crystal decanter with four glasses, a two-tin Boston shaker, a travertine lamp, a wavy pine mirror, a blown glass vase and two candle holders. They add the drinks.',
    },
    pieces: ['crystal-decanter-set', 'boston-shaker-tins', 'ceramic-candle-holders'],
  },
  {
    id: 'new-home',
    title: 'For a new home',
    intro:
      'Housewarming gifts that will still be out on display in a year: a lamp for the corner that has no light, a mirror for the bare wall above the hall table, a vase for the first flowers.',
    pieces: ['travertine-table-lamp', 'wavy-wall-mirror', 'blown-glass-vase', 'acacia-serving-board'],
  },
  {
    id: 'under-50',
    title: 'Gifts under €50',
    intro: 'Smaller pieces from the sets, each sold on its own. Good for a Kris Kindle, a stocking or a thank-you.',
    pieces: [],
    maxPrice: 5000,
  },
];

export const GIFT_FAQS = [
  {
    q: 'Can you deliver straight to the person I am buying for?',
    a: 'Yes. Put their name and address in the delivery address at checkout. We deliver anywhere in the Republic of Ireland.',
  },
  {
    q: 'Are there customs charges?',
    a: 'No. Orders are posted from within Ireland, so there are no customs or import charges on delivery.',
  },
  {
    q: 'What if the gift is not right?',
    a: 'After delivery there are 14 days to cancel without giving a reason. A set can be returned whole or piece by piece. See the returns page for how.',
  },
  {
    q: 'Can I buy one piece from a set as a gift?',
    a: 'Yes. Every piece is sold on its own. Buying the whole set always costs less than the pieces bought one by one.',
  },
];
