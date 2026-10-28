import type { CategoryHandle } from '@/lib/catalog/types';
import { SCENES, photoUrl } from './media';

/**
 * Editorial content for each collection. Product membership comes from the
 * catalogue (local or Shopify); this file only holds the words and imagery
 * that turn a collection into a useful landing page.
 */
export interface CollectionContent {
  handle: CategoryHandle;
  title: string;
  /** Short label used in menus. */
  navLabel: string;
  intro: string;
  /** Longer, practical guidance shown lower on the page. */
  guide: { heading: string; body: string[] };
  banner: string;
  bannerAlt: string;
  /** Portrait image used in menus and the room index. */
  thumb: string;
  related: CategoryHandle[];
  /** Journal articles that help with decisions in this category. */
  articles: string[];
}

export const COLLECTIONS: CollectionContent[] = [
  {
    handle: 'living-room',
    title: 'Living room',
    navLabel: 'Living room',
    intro: 'Sofas, chairs, tables and rugs for the room that has to do the most: relaxing, hosting, working and everything in between.',
    guide: {
      heading: 'Planning a living room',
      body: [
        'Start with the sofa, because it sets the scale for everything else. Measure the wall it will sit against and leave at least 45 cm between the sofa and a coffee table so people can walk through.',
        'A rug should be large enough for at least the front legs of the sofa and chairs to sit on it. Too small and the room feels disconnected.',
      ],
    },
    banner: photoUrl(SCENES.livingRoom.id, 2400),
    bannerAlt: SCENES.livingRoom.alt,
    thumb: photoUrl(SCENES.livingRoomAlt.id, 900),
    related: ['lighting', 'home-accessories', 'storage'],
    articles: ['how-to-choose-a-coffee-table', 'making-the-most-of-a-compact-living-space'],
  },
  {
    handle: 'bedroom',
    title: 'Bedroom',
    navLabel: 'Bedroom',
    intro: 'Beds, bedside tables, storage and bedding for a calmer room at both ends of the day.',
    guide: {
      heading: 'Planning a bedroom',
      body: [
        'Allow around 60 cm of clear floor on each side of the bed you get in and out of. If space is tight, a wall light frees the bedside table for a book and a glass of water.',
        'Wide, low storage keeps the room feeling open and gives you a surface you can use, where a tall chest can dominate a small room.',
      ],
    },
    banner: photoUrl(SCENES.bedroom.id, 2400),
    bannerAlt: SCENES.bedroom.alt,
    thumb: photoUrl(SCENES.bedroomPortrait.id, 900),
    related: ['storage', 'lighting', 'home-accessories'],
    articles: ['lighting-a-room-in-layers'],
  },
  {
    handle: 'dining',
    title: 'Dining',
    navLabel: 'Dining',
    intro: 'Tables, chairs, benches and tableware for everyday meals and longer evenings.',
    guide: {
      heading: 'Planning a dining space',
      body: [
        'Allow around 60 cm of table edge per person and 75 to 90 cm behind each chair so people can stand up without bumping the wall.',
        'Round tables are easier in compact rooms and kitchens. They have no corners to walk around and you can usually fit one more chair than you expect.',
      ],
    },
    banner: photoUrl(SCENES.dining.id, 2400),
    bannerAlt: SCENES.dining.alt,
    thumb: photoUrl(SCENES.diningPortrait.id, 900),
    related: ['lighting', 'coffee-kitchen', 'home-accessories'],
    articles: ['lighting-a-room-in-layers'],
  },
  {
    handle: 'lighting',
    title: 'Lighting',
    navLabel: 'Lighting',
    intro: 'Pendants, floor lamps, table lamps and wall lights. Most rooms need more than one source of light.',
    guide: {
      heading: 'Choosing lighting',
      body: [
        'Think in layers: general light from the ceiling, task light where you read or cook, and low accent light for the evening.',
        'Check the bulb fitting and whether a light needs an electrician before you buy. Hardwired pendants and wall lights must be installed by a qualified electrician.',
      ],
    },
    banner: photoUrl(SCENES.lighting.id, 2400),
    bannerAlt: SCENES.lighting.alt,
    thumb: photoUrl(SCENES.lightingPortrait.id, 900),
    related: ['living-room', 'bedroom', 'dining'],
    articles: ['lighting-a-room-in-layers'],
  },
  {
    handle: 'storage',
    title: 'Storage',
    navLabel: 'Storage',
    intro: 'Shelving, drawers, baskets and hooks that keep things to hand and out of the way.',
    guide: {
      heading: 'Choosing storage',
      body: [
        'Decide what should be visible and what should be hidden. Open shelving is for books and things you like to look at; doors and drawers are for everything else.',
        'Tall freestanding pieces should always be fixed to the wall, especially in homes with children.',
      ],
    },
    banner: photoUrl(SCENES.storage.id, 2400),
    bannerAlt: SCENES.storage.alt,
    thumb: photoUrl(SCENES.storagePortrait.id, 900),
    related: ['living-room', 'bedroom', 'home-accessories'],
    articles: ['making-the-most-of-a-compact-living-space'],
  },
  {
    handle: 'home-accessories',
    title: 'Home accessories',
    navLabel: 'Accessories',
    intro: 'Vases, mirrors, cushions, textiles and the smaller things that make a room feel lived in.',
    guide: {
      heading: 'Styling with accessories',
      body: [
        'Group objects in odd numbers and vary their height. A few larger pieces usually look calmer than many small ones.',
        'Textiles are the easiest way to change a room with the seasons: swap cushion covers and throws rather than furniture.',
      ],
    },
    banner: photoUrl(SCENES.accessories.id, 2400),
    bannerAlt: SCENES.accessories.alt,
    thumb: photoUrl(SCENES.accessoriesPortrait.id, 900),
    related: ['living-room', 'bedroom', 'dining'],
    articles: ['making-the-most-of-a-compact-living-space'],
  },
  {
    handle: 'coffee-kitchen',
    title: 'Coffee & kitchen',
    navLabel: 'Coffee & kitchen',
    intro: 'Kettles, grinders, brewers, cups and serving pieces for a better cup at home and a well-laid table.',
    guide: {
      heading: 'Setting up for better coffee',
      body: [
        'Fresh beans and a burr grinder make the biggest difference. After that, weighing coffee and water helps you repeat the cups you like.',
        'Keep everything you use daily in one place, near a socket and a tap, so the routine stays easy.',
      ],
    },
    banner: photoUrl(SCENES.coffee.id, 2400),
    bannerAlt: SCENES.coffee.alt,
    thumb: photoUrl(SCENES.coffeePortrait.id, 900),
    related: ['dining', 'home-accessories', 'lighting'],
    articles: ['creating-a-considered-coffee-corner'],
  },
];

export function getCollectionContent(handle: string) {
  return COLLECTIONS.find((c) => c.handle === handle) ?? null;
}
