import type { Post } from '../types';

export const brewMethods: Post = {
  slug: 'pour-over-vs-cafetiere-vs-moka-pot',
  title: 'Pour-over vs cafetière vs moka pot: which suits your mornings?',
  metaTitle: 'Pour-over vs cafetière vs moka pot: which is best?',
  description:
    'An honest comparison of pour-over, cafetière (French press) and moka pot: taste, time, cost, clean-up and which one suits the way you drink coffee.',
  excerpt: 'Three ways to make coffee without a machine, compared on taste, time, cost and washing up. The cafetière wins on some of them.',
  category: 'Coffee at home',
  keyword: 'pour over vs cafetiere',
  published: '2026-11-04',
  hero: { id: 'photo-1742466851711-24e957c6f2a8', alt: 'Coffee and a moka pot on a sunny day' },
  set: 'kyoto-kissaten',
  blocks: [
    {
      type: 'lead',
      text: 'Most Irish kitchens already have a cafetière in the cupboard, and plenty have a moka pot from a holiday in Italy. So is pour-over worth adding? It depends on what you want from your morning cup. Here is a fair comparison.',
    },
    { type: 'h2', id: 'at-a-glance', text: 'At a glance' },
    {
      type: 'table',
      head: ['', 'Pour-over', 'Cafetière', 'Moka pot'],
      rows: [
        ['Taste', 'Clean, light, bright; shows off the bean', 'Full, heavy, rich; some sediment', 'Strong, intense, close to espresso'],
        ['Time', 'About 3 minutes, hands-on', 'About 4 minutes, hands-off', 'About 5 minutes on the hob'],
        ['Grind', 'Medium-fine', 'Coarse', 'Fine'],
        ['Skill needed', 'A little: pouring speed matters', 'Very little', 'A little: heat control matters'],
        ['Clean-up', 'Easy: lift out the paper', 'Messy: grounds in the jug', 'Medium: unscrew and rinse'],
        ['Makes', '1 to 3 cups', '1 to 8 cups', '1 to 6 small cups'],
        ['Best with milk?', 'Better black', 'Good either way', 'Good for milky drinks'],
      ],
    },
    { type: 'h2', id: 'cafetiere', text: 'The cafetière (French press)' },
    { type: 'image', photo: { id: 'photo-1708127368781-cd5f069a90a5', alt: 'A French press coffee maker on a wooden table' } },
    {
      type: 'p',
      text: 'You put coarse coffee in the jug, add hot water, wait four minutes and push the plunger down. A metal mesh filter lets the coffee’s oils and some fine particles through, which is why cafetière coffee tastes full and heavy, and why the last mouthful is gritty.',
    },
    {
      type: 'p',
      text: '**Choose it if** you want the easiest method, make coffee for several people at once, or like a rich cup with milk. Honestly, for a busy weekday it is hard to beat.',
    },
    { type: 'h2', id: 'moka-pot', text: 'The moka pot' },
    { type: 'image', photo: { id: 'photo-1452415005154-c06158558480', alt: 'A moka pot on a gas hob' } },
    {
      type: 'p',
      text: 'The stovetop pot found in almost every Italian home. Water in the bottom chamber heats, steam pressure pushes it up through fine coffee, and strong coffee collects in the top. It is not true espresso, which needs much higher pressure, but it is close in strength.',
    },
    {
      type: 'p',
      text: '**Choose it if** you like strong coffee, drink lattes or cappuccinos at home (with frothed milk), or want an Italian-style cup without a machine. Take it off the heat as soon as it starts to gurgle, or it turns bitter.',
    },
    { type: 'h2', id: 'pour-over', text: 'Pour-over' },
    { type: 'image', photo: { id: 'photo-1541469406036-71229832e06e', alt: 'Water being poured into a glass coffee jar' } },
    {
      type: 'p',
      text: 'Medium-fine coffee in a paper filter, hot water poured slowly over it, coffee dripping through into a jug. The paper holds back oils and fine particles, so the cup tastes clean and light, and you can taste the difference between beans: fruity, floral, chocolatey.',
    },
    {
      type: 'p',
      text: '**Choose it if** you drink coffee black, enjoy trying different beans, or want your morning coffee to be a small ritual rather than a chore. It takes slightly more attention than a cafetière, and the payoff is a noticeably cleaner cup. Our [beginner’s guide](/journal/pour-over-coffee-for-beginners) covers the method.',
    },
    { type: 'h2', id: 'cost', text: 'What it costs to start' },
    {
      type: 'p',
      text: 'All three are cheap compared with an espresso machine. A cafetière or moka pot costs roughly €20 to €50. A basic plastic pour-over cone costs less than that, but pour-over works best with a gooseneck kettle and a burr grinder, so a full setup costs more. The grinder is worth it whichever method you choose: freshly ground beans improve every one of them.',
    },
    { type: 'h2', id: 'verdict', text: 'So which one?' },
    {
      type: 'list',
      items: [
        '**Easiest and for a crowd:** cafetière.',
        '**Strongest, and best for milky drinks:** moka pot.',
        '**Best-tasting black coffee, and the most enjoyable to make:** pour-over.',
      ],
    },
    {
      type: 'p',
      text: 'Many people keep two: a cafetière for busy mornings and guests, and pour-over for the slow weekend cup.',
    },
    {
      type: 'set',
      handle: 'kyoto-kissaten',
      text: 'If pour-over sounds like your kind of morning, the Kyoto Kissaten set has the whole setup in one box: dripper and jug with filters, electric gooseneck kettle, Hario hand grinder, four cups and a serving board. The dripper is also sold on its own if you already have a kettle and grinder.',
    },
    { type: 'pieces', handles: ['glass-pour-over-dripper', 'hario-hand-grinder', 'gooseneck-kettle'] },
    { type: 'h2', id: 'others', text: 'Other methods you will hear about' },
    {
      type: 'list',
      items: [
        '**AeroPress.** A plastic plunger that pushes coffee through a paper filter. Quick, forgiving and good for travel; a cup at a time.',
        '**Chemex.** A large glass pour-over brewer with thick filters. Very clean coffee, good for two to four people.',
        '**Bean-to-cup and espresso machines.** Best for milky drinks at the touch of a button, but expensive, and they need cleaning and descaling.',
      ],
    },
    { type: 'h2', id: 'better', text: 'One tip to improve each method' },
    {
      type: 'table',
      head: ['Method', 'Biggest single improvement'],
      rows: [
        ['Cafetière', 'After four minutes, skim off the crust and wait five more before pressing gently. Less sludge, cleaner taste.'],
        ['Moka pot', 'Start with hot water in the base and medium heat, and take it off as soon as it gurgles.'],
        ['Pour-over', 'Grind fresh and pour slowly; a gooseneck kettle makes this easy.'],
        ['All of them', 'Fresh beans, ground just before brewing.'],
      ],
    },
    { type: 'h2', id: 'faq', text: 'Questions' },
    {
      type: 'faq',
      items: [
        { q: 'Which method has the most caffeine?', a: 'It depends far more on how much coffee you use than on the method. Moka pot coffee tastes strongest because it is concentrated, but a large mug of pour-over or cafetière coffee can contain as much caffeine or more.' },
        { q: 'Is paper-filtered coffee healthier?', a: 'Paper filters remove most of the oils in coffee, including cafestol, which can raise cholesterol in some people who drink a lot of unfiltered coffee. If that is a concern, ask your doctor.' },
        { q: 'Can I use the same beans for all three?', a: 'Yes, but change the grind: coarse for a cafetière, medium-fine for pour-over and fine for a moka pot.' },
      ],
    },
  ],
};
