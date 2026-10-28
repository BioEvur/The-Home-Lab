/**
 * The room sets: everything except price and availability.
 *
 * The commercial side of a set (price, availability, basket line) is a product
 * with the same handle in the `room-sets` collection. Everything here is the
 * world around it: the place, the story, what is in the box, how it is laid
 * out and how to use it. Each piece's photo comes from PRODUCT_PHOTOS in
 * `media.ts`, keyed by the piece's handle.
 */
import { PRODUCT_PHOTOS, SET_SCENES, photoUrl, type Photo } from './media';

export type SetStatus = 'available' | 'coming-soon';

/** Each set's page colours: ink (dark), chalk (light) or olive (deep green). */
export type SetTheme = 'ink' | 'chalk' | 'olive';

/** A shape on the top-down plan, in a 100 × 70 grid. */
export interface PlanShape {
  shape: 'rect' | 'circle';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SetPiece {
  handle: string;
  name: string;
  /** What the piece actually is and what it is used for, in plain words. */
  what: string;
  qty: number;
  /** Price of this piece bought on its own, in cents, for the whole quantity. */
  price: number;
  /** How the quantity is sold on its own, e.g. "Pair" or "Set of six". */
  soldAs?: string;
  /** What the piece is for in the set, e.g. "The grinder". */
  role: string;
  /** Why it is in the set, in a sentence or two. */
  note: string;
  /** Size as it reads in the packing list, e.g. "600 ml". */
  short: string;
  /** Material, size, origin and care, shown in full beside the piece. */
  details: { label: string; value: string }[];
  plan: PlanShape;
}

export interface SetSwatch {
  name: string;
  hex: string;
}

export interface RoomSetContent {
  handle: string;
  title: string;
  place: string;
  /** The place's own name for the set's idea, shown small in the hero. */
  native: { text: string; lang: string; dir?: 'rtl' };
  /** Used for the live local time in the hero. */
  timeZone: string;
  theme: SetTheme;
  /** One line: the moment the set recreates. */
  moment: string;
  /** Short line for cards and menus. */
  kicker: string;
  /** The story, told in three short beats, each with its photograph. */
  beats: { text: string; photo: Photo }[];
  hero: Photo;
  /** A styled scene of the whole set, shown at the top of "What's in the box". */
  boxHero?: Photo;
  /** One plain photo of every piece in the set together, shown under the pieces. */
  contents?: Photo;
  heroTall: Photo;
  band: Photo;
  palette: SetSwatch[];
  pieces: SetPiece[];
  plan: { surface: string; surfaceShape: PlanShape; note: string };
  guide: { heading: string; steps: string[] };
  /** Plain facts shown next to the order button. */
  facts: { label: string; value: string }[];
  status: SetStatus;
  statusNote?: string;
}

/** "the Kyoto Kissaten", but "The Milanese" when the title already starts with "The". */
export const theTitle = (title: string) => (title.startsWith('The ') ? title : `the ${title}`);

export const ROOM_SETS: RoomSetContent[] = [
  {
    handle: 'kyoto-kissaten',
    title: 'Kyoto Kissaten',
    place: 'Kyoto',
    native: { text: '喫茶店', lang: 'ja' },
    timeZone: 'Asia/Tokyo',
    theme: 'ink',
    moment: 'A Japanese coffee house, on your kitchen counter',
    kicker: 'Slow coffee made by hand, one cup at a time.',
    beats: [
      {
        text: 'Kissaten are Japan’s traditional coffee houses. They spread after the war, and many still run today: dark wood, low light, and coffee brewed by hand for each customer, one cup at a time.',
        photo: SET_SCENES.kyotoTall,
      },
      {
        text: 'The method is called pour-over. Fresh grounds go in a paper filter, hot water is poured over them slowly, and the coffee drips through. It takes about three minutes and tastes cleaner and lighter than coffee from a machine.',
        photo: SET_SCENES.kyotoDetail,
      },
      {
        text: 'This set is everything you need to make it at home, apart from the coffee: a glass dripper with its own jug, a gooseneck kettle, a Japanese hand grinder, four handleless cups and an acacia board to keep it together.',
        photo: SET_SCENES.kyotoBand,
      },
    ],
    hero: SET_SCENES.kyotoHero,
    contents: {
      id: '/images/sets/kyoto/contents.jpg',
      alt: 'Everything in the Kyoto Kissaten set: four handleless cups in their gift box, the amber glass dripper on its jug, the black gooseneck kettle, the Hario hand grinder and the long acacia board',
    },
    heroTall: SET_SCENES.kyotoTall,
    band: SET_SCENES.kyotoBand,
    palette: [
      { name: 'Matte glaze', hex: '#2B2C2B' },
      { name: 'Cream glaze', hex: '#E5DCCB' },
      { name: 'Acacia', hex: '#8A5A3B' },
      { name: 'Amber glass', hex: '#B8732F' },
    ],
    pieces: [
      {
        handle: 'glass-pour-over-dripper',
        name: 'Glass pour-over coffee dripper with jug, 400 ml',
        what: 'A ribbed amber glass cone that sits on its own matching glass jug. You put a paper filter and ground coffee in the cone, pour hot water over it, and the coffee drips through into the jug. A pack of paper filters comes with it.',
        qty: 1,
        price: 3800,
        role: 'The dripper and jug',
        note: 'The ribs inside the cone let the coffee drip through evenly. The amber glass and walnut-coloured band give it the warm look of an old coffee house.',
        short: '400 ml',
        details: [
          { label: 'Material', value: 'Amber glass cone and jug, black holder, wooden band' },
          { label: 'Size', value: '400 ml jug, enough for one to three cups' },
          { label: 'Includes', value: 'A pack of paper filters' },
        ],
        plan: { shape: 'circle', x: 40, y: 40, w: 11, h: 11 },
      },
      {
        handle: 'gooseneck-kettle',
        name: 'Electric gooseneck kettle, 1 litre',
        what: 'An electric kettle with a long, thin, curved spout. It boils the water on its own base, then lets you pour it slowly and exactly where you want it over the coffee, which is what makes pour-over work.',
        qty: 1,
        price: 5500,
        role: 'The kettle',
        note: 'An ordinary kettle pours too fast and floods the coffee. The thin spout gives you a steady, gentle stream.',
        short: '1 litre, electric',
        details: [
          { label: 'Spout', value: 'Long, thin gooseneck for a slow, steady pour' },
          { label: 'Size', value: '1 litre' },
          { label: 'Power', value: 'Electric, lifts off its base to pour' },
          { label: 'Finish', value: 'Matt black with a brown handle and base' },
        ],
        plan: { shape: 'circle', x: 68, y: 30, w: 11, h: 11 },
      },
      {
        handle: 'handleless-cups',
        name: 'Handleless ceramic cups, 180 ml',
        what: 'Four small ceramic cups without handles, the way coffee and tea are served in Japan. You hold them in both hands. Each cup has a different glaze, and they come in a gift box.',
        qty: 4,
        price: 6500,
        soldAs: 'Set of four',
        role: 'The cups',
        note: 'Four glazes, from dark iron to cream, so everyone at the counter knows which cup is theirs.',
        short: '180 ml each',
        details: [
          { label: 'Material', value: 'Glazed ceramic' },
          { label: 'Size', value: 'About 180 ml each' },
          { label: 'Comes in', value: 'A gift box' },
        ],
        plan: { shape: 'circle', x: 16, y: 45, w: 7, h: 7 },
      },
      {
        handle: 'acacia-serving-board',
        name: 'Acacia serving board',
        what: 'A long, flat wooden board with a handle at one end. The dripper, jug and cups sit along it, and you carry everything to the table in one go.',
        qty: 1,
        price: 3200,
        role: 'The board',
        note: 'It keeps the set together in one line on the counter, like the bar of a little coffee house rather than a pile of things.',
        short: 'Long, with a handle',
        details: [
          { label: 'Material', value: 'Acacia wood' },
          { label: 'Care', value: 'Wipe clean; oil now and then' },
        ],
        plan: { shape: 'rect', x: 8, y: 42, w: 50, h: 13 },
      },
      {
        handle: 'hario-hand-grinder',
        name: 'Hario ceramic hand coffee grinder',
        what: 'Grinds whole coffee beans by turning the handle on top. The ground coffee collects in the glass jar underneath, which has its own lid so you can store it.',
        qty: 1,
        price: 7900,
        role: 'The grinder',
        note: 'Made by Hario, the Japanese coffee brand founded in Tokyo in 1921. Ceramic burrs crush every bean to the same size, which is what makes a good pour-over.',
        short: 'Ceramic burrs',
        details: [
          { label: 'Brand', value: 'Hario, Japan' },
          { label: 'Material', value: 'Ceramic burrs, glass jar, steel handle' },
          { label: 'Care', value: 'Brush the burrs clean; wash the jar by hand' },
        ],
        plan: { shape: 'circle', x: 80, y: 20, w: 9, h: 9 },
      },
    ],
    plan: {
      surface: 'Counter, 60 × 30 cm',
      surfaceShape: { shape: 'rect', x: 4, y: 8, w: 92, h: 54 },
      note: 'Keep the kettle beside the dripper, the grinder on the side of your stronger hand and the cups waiting on the board.',
    },
    guide: {
      heading: 'How to brew',
      steps: [
        'Fill the kettle, boil it and let it sit for a minute, so the water is about 93°C.',
        'Weigh 15 g of beans and grind them medium-fine, like coarse sea salt.',
        'Put a paper filter in the dripper, rinse it with hot water and pour that water away.',
        'Add the coffee, pour in just enough water to wet it and wait 30 seconds while it blooms.',
        'Pour the rest from the kettle in slow circles until the jug shows 250 ml, over about two minutes.',
        'Pour into the cups on the board. Rinse everything with hot water; the dripper needs no soap.',
      ],
    },
    facts: [
      { label: 'In the box', value: 'Dripper with jug, kettle, four cups, board and grinder' },
      { label: 'Space needed', value: 'About 60 × 30 cm of counter' },
      { label: 'Makes', value: 'One to three cups at a time' },
      { label: 'Uses', value: 'Size 02 cone filter papers (a pack is included)' },
    ],
    status: 'available',
  },
  {
    handle: 'the-milanese',
    title: 'The Milanese',
    place: 'Milan',
    native: { text: 'Milano', lang: 'it' },
    timeZone: 'Europe/Rome',
    theme: 'chalk',
    moment: 'An evening drink in a Milan apartment',
    kicker: 'A drinks corner for the evening: crystal, stone and candlelight.',
    beats: [
      {
        text: 'In Milan, aperitivo is the drink before dinner, usually between seven and nine in the evening. At home it is poured from a console or sideboard kept for it, with a decanter, glasses and a lamp rather than the ceiling light.',
        photo: SET_SCENES.milaneseLamp,
      },
      {
        text: 'Milan homes are known for their design: marble and travertine, polished metal, cut glass and plaster walls, lit low in the evening. This set uses the same materials on one console.',
        photo: SET_SCENES.milaneseDecanter,
      },
      {
        text: 'This set is that drinks corner: a crystal decanter with four glasses, a two-tin cocktail shaker, a travertine lamp, a wavy pine mirror, a blown glass vase and two candle holders. Add your own drinks.',
        photo: SET_SCENES.milaneseBand,
      },
    ],
    hero: SET_SCENES.milaneseHero,
    boxHero: SET_SCENES.milaneseHero,
    heroTall: SET_SCENES.milaneseTall,
    band: SET_SCENES.milaneseBand,
    palette: [
      { name: 'Travertine', hex: '#D9CBB4' },
      { name: 'Calacatta marble', hex: '#ECE8E1' },
      { name: 'Polished steel', hex: '#B9BCBE' },
      { name: 'Whisky amber', hex: '#B06A2B' },
      { name: 'Natural pine', hex: '#B98B5A' },
    ],
    pieces: [
      {
        handle: 'crystal-decanter-set',
        name: 'Crystal whisky decanter with four glasses',
        what: 'A square cut-crystal decanter with a stopper, four matching cut glasses, a set of whisky chilling stones and a small wooden tray for the stones. It comes in a black and gold gift box.',
        qty: 1,
        price: 9900,
        role: 'The decanter',
        note: 'The decanter is the centre of the corner. Pour whisky, brandy or an amaro into it and keep it out on the console, with the glasses beside it.',
        short: 'Decanter, 4 glasses, stones',
        details: [
          { label: 'Material', value: 'Clear cut crystal decanter and glasses' },
          { label: 'Includes', value: 'Four glasses, chilling stones and a wooden stone tray' },
          { label: 'Comes in', value: 'A black and gold gift box' },
          { label: 'Care', value: 'Hand wash' },
        ],
        plan: { shape: 'rect', x: 28, y: 30, w: 14, h: 12 },
      },
      {
        handle: 'boston-shaker-tins',
        name: 'Boston cocktail shaker, two tins',
        what: 'Two polished steel tins, one larger than the other, that fit together to shake a cocktail. You build the drink in the small tin, put the large tin over it, shake, then pull them apart and strain.',
        qty: 1,
        price: 2900,
        role: 'The shaker',
        note: 'This is the kind of shaker bartenders use. Two tins seal well, chill the drink quickly and come apart easily, and there is no small cap to lose.',
        short: '18 oz and 25 oz tins',
        details: [
          { label: 'Material', value: '304 stainless steel, polished' },
          { label: 'Size', value: '18 oz (about 530 ml) and 25 oz (about 740 ml)' },
          { label: 'Care', value: 'Dishwasher safe' },
        ],
        plan: { shape: 'circle', x: 50, y: 38, w: 6, h: 6 },
      },
      {
        handle: 'travertine-table-lamp',
        name: 'Travertine table lamp',
        what: 'A table lamp made of travertine stone, with a round mushroom-shaped shade on a tapered base. It plugs into the wall and gives a low, warm light across the console.',
        qty: 1,
        price: 13900,
        role: 'The lamp',
        note: 'Travertine is the pale stone used across Italian buildings and furniture. A lamp at one end of the console lights the whole corner without the main light on.',
        short: 'Travertine, corded',
        details: [
          { label: 'Material', value: 'Natural travertine stone' },
          { label: 'Shape', value: 'Mushroom shade on a tapered base' },
          { label: 'Power', value: 'Corded, plugs into the wall' },
          { label: 'Note', value: 'Natural stone, so the colour and markings vary from lamp to lamp' },
        ],
        plan: { shape: 'circle', x: 14, y: 34, w: 13, h: 13 },
      },
      {
        handle: 'ceramic-candle-holders',
        name: 'Ceramic candle holders',
        what: 'Two small round ceramic candle holders in a brown glaze, with shapes cut out of the sides so the candlelight shows through. Each one holds a tealight.',
        qty: 2,
        price: 2400,
        soldAs: 'Pair',
        role: 'The candles',
        note: 'Set at the front of the console, they throw small patterns of light across the marble and the wall.',
        short: 'Pair, for tealights',
        details: [
          { label: 'Material', value: 'Glazed ceramic, brown' },
          { label: 'Holds', value: 'One tealight each' },
          { label: 'Care', value: 'Wipe clean' },
        ],
        plan: { shape: 'circle', x: 76, y: 46, w: 6, h: 6 },
      },
      {
        handle: 'wavy-wall-mirror',
        name: 'Wavy wall mirror, pine frame',
        what: 'A tall wall mirror with a curved, uneven outline and a rounded natural pine frame. It hangs on the wall above the console.',
        qty: 1,
        price: 14900,
        role: 'The mirror',
        note: 'A mirror above the console doubles the lamp and candlelight in the evening and makes the corner feel like part of the room rather than a shelf.',
        short: 'Pine frame',
        details: [
          { label: 'Frame', value: 'Natural pinewood' },
          { label: 'Shape', value: 'Tall, with a wavy, organic outline' },
          { label: 'Hanging', value: 'Wall-mounted, above the console' },
        ],
        plan: { shape: 'rect', x: 36, y: 14, w: 28, h: 4 },
      },
      {
        handle: 'blown-glass-vase',
        name: 'Blown glass vase, 24 cm',
        what: 'A tall glass vase, blown by mouth, with a wavy rim. The glass fades from grey at the base to white at the top. Use it with a few stems or on its own.',
        qty: 1,
        price: 4400,
        role: 'The vase',
        note: 'It balances the lamp at the other end of the console and catches the light through the glass.',
        short: '13 × 12.5 × 24 cm',
        details: [
          { label: 'Material', value: 'Mouth-blown glass, grey fading to white' },
          { label: 'Size', value: '13 × 12.5 × 24 cm' },
          { label: 'Care', value: 'Hand wash' },
        ],
        plan: { shape: 'circle', x: 66, y: 32, w: 8, h: 8 },
      },
    ],
    plan: {
      surface: 'Console or sideboard, about 120 × 40 cm',
      surfaceShape: { shape: 'rect', x: 4, y: 20, w: 92, h: 36 },
      note: 'The mirror centred on the wall above, the lamp at one end, the vase at the other and the drinks in between.',
    },
    guide: {
      heading: 'How to set it up',
      steps: [
        'Hang the mirror centred over the console, with its bottom edge about 20 cm above the top.',
        'Put the lamp at one end of the console and the vase at the other.',
        'Group the decanter and glasses towards the lamp, with the stones on their tray beside them.',
        'Stand the shaker tins next to the glasses, the small tin inside the large one.',
        'Put the candle holders at the front, light the tealights and turn the lamp on.',
        'Turn the main light off. Pour a drink.',
      ],
    },
    facts: [
      { label: 'In the box', value: 'Decanter with four glasses and stones, shaker, lamp, mirror, vase and two candle holders' },
      { label: 'Space needed', value: 'A console or sideboard about 120 × 40 cm, and the wall above it' },
      { label: 'Lamp', value: 'Plugs into the wall' },
    ],
    status: 'available',
  },
  {
    handle: 'riad-corner',
    title: 'Riad Corner',
    place: 'Marrakech',
    native: { text: 'رياض', lang: 'ar', dir: 'rtl' },
    timeZone: 'Africa/Casablanca',
    theme: 'olive',
    moment: 'A reading corner in a riad courtyard',
    kicker: 'Low seating, lantern light and a pot of mint tea.',
    beats: [
      {
        text: 'A riad is a traditional house in Marrakech, built around an open courtyard. Inside, people sit low, on rugs, poufs and cushions rather than sofas.',
        photo: SET_SCENES.riadTall,
      },
      {
        text: 'Guests are always offered mint tea: green tea with fresh mint and sugar, poured from a height into small glasses and served on a brass tray.',
        photo: SET_SCENES.riadDetail,
      },
      {
        text: 'This set turns any corner of a room into that seating area: a Moroccan rag rug, a wool pouf, a brass tray, a teapot, six tea glasses and a pierced lantern for the evening.',
        photo: SET_SCENES.riadBand,
      },
    ],
    hero: SET_SCENES.riadHero,
    heroTall: SET_SCENES.riadTall,
    band: SET_SCENES.riadBand,
    palette: [
      { name: 'Rag-rug colour', hex: '#C2563D' },
      { name: 'Wool ivory', hex: '#F3F0E9' },
      { name: 'Engraved brass', hex: '#B89660' },
      { name: 'Ink line', hex: '#171918' },
    ],
    pieces: [
      {
        handle: 'boucherouite-rug',
        name: 'Moroccan rag rug, 158 × 98 cm',
        what: 'A colourful floor rug, knotted by hand in Marrakech from strips of recycled fabric. It marks out the corner and is soft enough to sit on.',
        qty: 1,
        price: 9900,
        role: 'The rug',
        note: 'Boucherouite rugs are a Moroccan tradition of turning old cloth into bright, bold rugs. Every one is different.',
        short: '158 × 98 cm',
        details: [
          { label: 'Material', value: 'Recycled cotton and textile strips' },
          { label: 'Made in', value: 'Marrakech, Morocco, by hand' },
          { label: 'Size', value: 'About 158 × 98 cm' },
          { label: 'Care', value: 'Shake out; spot clean' },
        ],
        plan: { shape: 'rect', x: 16, y: 12, w: 62, h: 46 },
      },
      {
        handle: 'beni-ourain-pouf',
        name: 'Moroccan wool pouf (floor seat)',
        what: 'A round, firm floor cushion in thick wool with a checkerboard pattern. Use it as a low seat, a footrest or a side table for the tea tray.',
        qty: 1,
        price: 11900,
        role: 'The pouf',
        note: 'The pattern follows the Beni Ourain rugs woven in the Atlas mountains. It arrives unfilled so it travels flat; fill it with old cushions or a pouf insert.',
        short: '50 cm across',
        details: [
          { label: 'Material', value: 'Wool, handwoven' },
          { label: 'Size', value: 'About 50 cm across, 30 cm high when filled' },
          { label: 'Arrives', value: 'Unfilled, so it travels flat; fill with old cushions or a pouf insert' },
        ],
        plan: { shape: 'circle', x: 52, y: 34, w: 14, h: 14 },
      },
      {
        handle: 'engraved-brass-tray',
        name: 'Brass tea tray, 35 cm',
        what: 'A round brass tray, engraved by hand with a pattern. The teapot and glasses sit on it, and it sits on the pouf.',
        qty: 1,
        price: 8900,
        role: 'The tray',
        note: 'In Morocco, tea is always served on a tray. It turns the pouf into a table.',
        short: 'About 35 cm',
        details: [
          { label: 'Material', value: 'Brass, hand-engraved' },
          { label: 'Size', value: 'About 35 cm across' },
          { label: 'Care', value: 'Wipe dry; polish with lemon and salt' },
        ],
        plan: { shape: 'circle', x: 54, y: 36, w: 10, h: 10 },
      },
      {
        handle: 'engraved-moroccan-teapot',
        name: 'Moroccan teapot',
        what: 'A metal teapot with a long curved spout, engraved all over. It holds about six small glasses of mint tea.',
        qty: 1,
        price: 5900,
        role: 'The teapot',
        note: 'The long spout is for pouring from high above the glass, which is how Moroccan mint tea is served: it cools the tea and puts a little foam on top.',
        short: 'About 600 ml',
        details: [
          { label: 'Material', value: 'Silver-plated metal, hand-engraved' },
          { label: 'Size', value: 'About 600 ml, six small glasses' },
          { label: 'Care', value: 'Hand wash; dry straight away' },
        ],
        plan: { shape: 'circle', x: 57, y: 37, w: 4, h: 4 },
      },
      {
        handle: 'painted-tea-glasses',
        name: 'Painted Moroccan tea glasses',
        what: 'Six small glasses for mint tea, painted by hand with white patterns. Each holds about 120 ml.',
        qty: 6,
        price: 7900,
        soldAs: 'Set of six',
        role: 'The tea glasses',
        note: 'Mint tea in Morocco is drunk from small glasses, not cups, so you can see its colour.',
        short: '120 ml each',
        details: [
          { label: 'Material', value: 'Glass, hand-painted' },
          { label: 'Size', value: 'About 120 ml each' },
          { label: 'Care', value: 'Hand wash to keep the painting' },
        ],
        plan: { shape: 'circle', x: 50, y: 33, w: 3, h: 3 },
      },
      {
        handle: 'pierced-brass-lantern',
        name: 'Pierced brass lantern, 35 cm',
        what: 'A brass lantern with patterns punched through it. Put a candle or an LED light inside and it throws star-shaped light across the walls.',
        qty: 1,
        price: 6900,
        role: 'The lantern',
        note: 'With the main light off, this is what makes the corner feel like a riad in the evening.',
        short: '35 cm tall',
        details: [
          { label: 'Material', value: 'Pierced brass' },
          { label: 'Made in', value: 'Morocco, by hand' },
          { label: 'Size', value: 'About 35 cm tall' },
        ],
        plan: { shape: 'circle', x: 82, y: 14, w: 7, h: 7 },
      },
    ],
    plan: {
      surface: 'Floor, about 150 × 200 cm',
      surfaceShape: { shape: 'rect', x: 4, y: 4, w: 92, h: 62 },
      note: 'Push the rug into a corner or under a window. Add floor cushions or an armchair along the long side.',
    },
    guide: {
      heading: 'How to arrange it',
      steps: [
        'Lay the rug first, with one short side against a wall or under a window.',
        'Fill the pouf firmly and set it near the open edge of the rug.',
        'Put the tray on the pouf, with the teapot and glasses on it.',
        'Stand the lantern on the floor at the back corner, away from curtains.',
        'Add cushions or a low chair along the wall, turn the big light off and pour.',
      ],
    },
    facts: [
      { label: 'In the box', value: 'Rug, pouf, tray, teapot, six tea glasses and a lantern' },
      { label: 'Space needed', value: 'About 150 × 200 cm of floor' },
      { label: 'Made by hand', value: 'The rug, pouf and lantern vary from piece to piece' },
    ],
    status: 'coming-soon',
    statusNote: 'Riad Corner opens in the new year. The rug, pouf and lantern are made by hand in Morocco, so they take longer to arrive. Leave your email and we will tell you when it opens.',
  },
];

export function getRoomSet(handle: string) {
  return ROOM_SETS.find((s) => s.handle === handle) ?? null;
}

export const isRoomSetHandle = (handle: string) => ROOM_SETS.some((s) => s.handle === handle);

/** Where a product lives on the site: sets have their own pages, pieces and add-ons a product page. */
export const productHref = (handle: string) => (isRoomSetHandle(handle) ? `/sets/${handle}` : `/products/${handle}`);

export const setPhoto = (photo: Photo, width = 1600) => photoUrl(photo.id, width);

/** The photos for a piece in "What's in the box": the piece, then a detail. */
export const piecePhotos = (piece: SetPiece): Photo[] => PRODUCT_PHOTOS[piece.handle] ?? [];

/** The main photo for a piece. */
export const piecePhoto = (piece: SetPiece): Photo | null => piecePhotos(piece)[0] ?? null;

/** What the pieces cost bought one by one, in cents. */
export const piecesTotal = (set: RoomSetContent) => set.pieces.reduce((n, p) => n + p.price, 0);

/** The set a piece belongs to. */
export const setForPiece = (handle: string) => ROOM_SETS.find((s) => s.pieces.some((p) => p.handle === handle)) ?? null;

export const getPiece = (handle: string) => {
  for (const set of ROOM_SETS) {
    const piece = set.pieces.find((p) => p.handle === handle);
    if (piece) return { set, piece };
  }
  return null;
};

/** Total number of items in the box, counting each cup or glass. */
export const itemCount = (set: RoomSetContent) => set.pieces.reduce((n, p) => n + p.qty, 0);
