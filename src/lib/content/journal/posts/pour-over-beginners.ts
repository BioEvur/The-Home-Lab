import type { Post } from '../types';

export const pourOverBeginners: Post = {
  slug: 'pour-over-coffee-for-beginners',
  title: 'Pour-over coffee for beginners: what you need, and what you don’t',
  metaTitle: 'Pour-over coffee for beginners: kit, ratio and method',
  description:
    'A plain guide to pour-over coffee at home: the kit you need, the 1:16 ratio, grind size, water temperature and a six-step method, plus the common mistakes.',
  excerpt: 'The kit, the ratio and a six-step method for a clean, bright cup of coffee by hand, with no machine and no jargon.',
  category: 'Coffee at home',
  keyword: 'pour over coffee for beginners',
  published: '2026-11-04',
  hero: { id: 'photo-1758221052634-33f352d1318b', alt: 'Hot water pouring into a pour-over coffee filter' },
  set: 'kyoto-kissaten',
  blocks: [
    {
      type: 'lead',
      text: 'Pour-over is the simplest way to make coffee: ground beans in a paper filter, hot water poured over them slowly, coffee dripping through into a jug. It takes about three minutes, costs far less than an espresso machine and makes a cup that tastes clean and bright.',
    },
    { type: 'h2', id: 'what-you-need', text: 'What you actually need' },
    {
      type: 'p',
      text: 'Ask on any coffee forum and you will get a long list. Here is the short one, in order of how much each piece matters.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Fresh beans.** Coffee roasted in the last few weeks makes more difference than any gear. Irish speciality roasters print the roast date on the bag.',
        '**A burr grinder.** Ground coffee loses its aroma within minutes. A burr grinder crushes beans to an even size, which lets water pass through evenly. Blade grinders chop unevenly and make the cup taste both sour and bitter.',
        '**A dripper and filters.** A cone-shaped dripper and paper filters to fit it. Glass, ceramic and plastic all work.',
        '**A kettle you can pour slowly.** A gooseneck kettle gives a thin, steady stream.',
        '**Something to measure with.** A kitchen scale is best. A tablespoon works to start.',
      ],
    },
    {
      type: 'tip',
      title: 'Do you need a gooseneck kettle?',
      text: 'Not strictly. Some home brewers pour from a small jug and do fine. But a gooseneck makes it much easier to pour slowly and evenly, which is where most beginners go wrong, and coffee professionals usually recommend one as early gear. If you are buying a kettle anyway, buy a gooseneck.',
    },
    { type: 'image', photo: { id: 'photo-1768674150917-55b1ddf46a02', alt: 'A stainless steel gooseneck kettle on a wooden board' }, caption: 'The long, thin spout of a gooseneck kettle gives you control over where the water goes.' },
    { type: 'h2', id: 'ratio', text: 'The ratio, grind and temperature' },
    {
      type: 'table',
      head: ['Setting', 'Start here', 'Why'],
      rows: [
        ['Coffee to water', '15 g coffee to 250 ml water (about 1:16)', 'One generous mug. Scale up for two.'],
        ['Grind size', 'Medium-fine, like coarse sea salt', 'Too fine and it drips slowly and tastes bitter; too coarse and it runs through and tastes sour.'],
        ['Water temperature', 'About 93°C: boil, then wait a minute', 'Boiling water straight off can taste harsh; cooler water under-extracts.'],
        ['Total brew time', 'About 2½ to 3½ minutes', 'A useful check on your grind.'],
      ],
    },
    { type: 'h2', id: 'method', text: 'The method, step by step' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Boil the kettle and let it sit for about a minute.',
        'Weigh 15 g of beans and grind them medium-fine.',
        'Put the paper filter in the dripper, wet it with hot water and pour that water away. This rinses out any papery taste and warms the jug.',
        'Add the coffee and shake it level. Pour in about 40 ml of water, just enough to wet all the grounds, and wait 30 seconds. The coffee will puff up and bubble: this is the "bloom", as trapped gas escapes.',
        'Pour the rest of the water slowly in small circles, keeping the stream in the middle and away from the paper, until you reach 250 ml. Take about two minutes.',
        'Let it finish dripping, lift off the dripper and pour.',
      ],
    },
    { type: 'image', wide: true, photo: { id: 'photo-1442512595331-e89e73853f31', alt: 'Coffee dripping through a filter into a glass jug' } },
    { type: 'h2', id: 'mistakes', text: 'Common mistakes, and the fix' },
    {
      type: 'table',
      head: ['If it tastes…', 'Probably', 'Try'],
      rows: [
        ['Sour, thin or salty', 'Under-extracted', 'Grind a little finer, or use hotter water'],
        ['Bitter, dry or harsh', 'Over-extracted', 'Grind a little coarser, or pour a bit faster'],
        ['Weak and watery', 'Too little coffee', 'Use 16 to 17 g for 250 ml'],
        ['Fine one day, off the next', 'Inconsistent pouring', 'Weigh everything for a week until it becomes habit'],
      ],
    },
    {
      type: 'p',
      text: 'Change one thing at a time. Most people find their cup within four or five mornings.',
    },
    { type: 'h2', id: 'beans', text: 'Choosing beans for pour-over' },
    {
      type: 'p',
      text: 'Pour-over shows off the flavour of the bean, so lighter and medium roasts suit it well. Look for single-origin coffees with tasting notes you like the sound of, such as chocolate and nuts, or citrus and berries. Buy whole beans in small bags and use them within a month of the roast date. Keep them in their bag or an airtight tin, away from light, and not in the fridge.',
    },
    { type: 'h2', id: 'everything-in-one-box', text: 'Everything in one box' },
    {
      type: 'set',
      handle: 'kyoto-kissaten',
      text: 'The Kyoto Kissaten set is everything on the list above apart from the beans: an amber glass dripper with its jug and a pack of filters, an electric gooseneck kettle, a Hario ceramic hand grinder, four handleless cups and an acacia board. It was put together so that a beginner can make a proper cup on the first morning.',
    },
    {
      type: 'p',
      text: 'Wondering how pour-over compares with the cafetière in your cupboard? See [pour-over vs cafetière vs moka pot](/journal/pour-over-vs-cafetiere-vs-moka-pot).',
    },
    { type: 'h2', id: 'faq', text: 'Questions' },
    {
      type: 'faq',
      items: [
        { q: 'Is pour-over stronger than a cafetière?', a: 'Not usually. With the same amount of coffee, pour-over tastes lighter and cleaner because the paper filter holds back oils and fine particles. A cafetière tastes heavier and fuller.' },
        { q: 'Can I use pre-ground coffee?', a: 'Yes. Buy a "filter" grind and use it within a week or two of opening. Freshly ground beans taste noticeably better.' },
        { q: 'How much coffee for two cups?', a: 'About 30 g of coffee to 500 ml of water. Check your dripper and jug hold that much.' },
        { q: 'What does "bloom" mean?', a: 'The first small pour that wets the grounds. Fresh coffee releases gas and puffs up; waiting 30 seconds lets the gas out so the rest of the water can extract evenly.' },
      ],
    },
  ],
};
