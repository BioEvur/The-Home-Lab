import type { Post } from '../types';

export const handGrinder: Post = {
  slug: 'is-a-hand-grinder-worth-it-hario-skerton',
  title: 'Is a hand grinder worth it? An honest look at the Hario Skerton',
  metaTitle: 'Is a hand coffee grinder worth it? The Hario Skerton',
  description:
    'Why grinding fresh matters, burr vs blade, and an honest look at the Hario Skerton ceramic hand grinder: what it does well, its limits and who should spend more.',
  excerpt: 'Why fresh grinding is the best upgrade for home coffee, what a ceramic hand grinder does well, and when it is worth spending more.',
  category: 'Coffee at home',
  keyword: 'hario skerton review',
  published: '2026-11-04',
  hero: { id: 'photo-1496282808562-d01e97fac01c', alt: 'A person grinding coffee by hand' },
  set: 'kyoto-kissaten',
  blocks: [
    {
      type: 'lead',
      text: 'We sell the Hario Skerton in our Kyoto Kissaten set and on its own, so we have an interest here. That is exactly why this guide is straight about both what it does well and where it falls short.',
    },
    { type: 'h2', id: 'why-grind', text: 'Why grind your own coffee at all?' },
    {
      type: 'p',
      text: 'Roasted coffee holds its aroma inside the bean. Once you grind it, the surface area increases enormously and the aromas start to fade within minutes. Pre-ground coffee is perfectly drinkable, but beans ground just before brewing taste noticeably more alive. For most people, a grinder is a bigger upgrade than a new brewer.',
    },
    { type: 'h2', id: 'burr-vs-blade', text: 'Burr or blade?' },
    {
      type: 'table',
      head: ['', 'Blade grinder', 'Burr grinder'],
      rows: [
        ['How it works', 'A spinning blade chops the beans', 'Two burrs crush beans to a set size'],
        ['Result', 'A mix of dust and chunks', 'Mostly even particles'],
        ['Taste', 'Bitter and sour at once', 'Balanced, adjustable'],
        ['Adjustable?', 'Only by how long you grind', 'Yes, from fine to coarse'],
      ],
    },
    {
      type: 'p',
      text: 'Even particles matter because water extracts flavour from small pieces faster than big ones. A mix of dust and chunks over-extracts some coffee and under-extracts the rest. That is why a burr grinder, hand or electric, is the one to buy.',
    },
    { type: 'image', photo: { id: 'photo-1573066380308-24ff4c273dbc', alt: 'A brown and black coffee grinder' } },
    { type: 'h2', id: 'skerton', text: 'The Hario Skerton: what it is' },
    {
      type: 'p',
      text: 'Hario is a Japanese glassware and coffee company founded in Tokyo in 1921, and the maker of the well-known V60 dripper. The Skerton is its long-running ceramic burr hand grinder: you put beans in the top, turn the handle, and the grounds collect in a glass jar underneath, which has its own lid so you can store them.',
    },
    { type: 'h3', text: 'What it does well' },
    {
      type: 'list',
      items: [
        '**Even grind at pour-over settings.** At medium-fine, the setting pour-over needs, it produces a consistent grind for its price.',
        '**Ceramic burrs.** They do not rust and stay sharp for a long time.',
        '**No electricity and almost silent.** It will not wake the house at 7am.',
        '**Easy to store.** The lidded glass jar doubles as a container for the morning’s grounds.',
        '**It looks the part.** Glass and steel on a wooden board, rather than a plastic appliance.',
      ],
    },
    { type: 'h3', text: 'Its limits' },
    {
      type: 'list',
      items: [
        '**Coarse grinds are less even.** At the coarse settings a cafetière needs, the bottom burr can wobble and the grind gets more mixed. Hario’s later Skerton Pro and Plus versions added a stabiliser to address this. Reviewers note that ceramic burrs are not as sharp as the steel burrs in premium grinders.',
        '**It takes effort.** Grinding 15 g for one cup takes about a minute of steady turning. For a pot for four, it is a workout.',
        '**Espresso is hard work.** It can grind fine, but grinding for espresso every day is slow and tiring. Anyone with an espresso machine needs an electric grinder.',
      ],
    },
    {
      type: 'tip',
      title: 'Getting the best from it',
      text: 'Find your pour-over setting once, then leave it. Grind with steady, even turns rather than fast ones. Brush the burrs clean every week or two and wash the glass jar by hand.',
    },
    { type: 'h2', id: 'who', text: 'Who it suits, and who should spend more' },
    {
      type: 'table',
      head: ['You are…', 'Our advice'],
      rows: [
        ['Starting pour-over, one or two cups a day', 'The Skerton is a sensible, good-looking first grinder.'],
        ['Making a cafetière for the family every morning', 'Consider an electric burr grinder for coarse grinds and speed.'],
        ['Using an espresso machine', 'Buy an electric espresso grinder.'],
        ['A keen hobbyist chasing every detail', 'A premium steel-burr hand grinder (roughly €150 to €300) grinds faster and more evenly.'],
      ],
    },
    { type: 'image', wide: true, photo: { id: 'photo-1522825180917-a355ef45e880', alt: 'Ground coffee being added to a coffee brewer' } },
    { type: 'h2', id: 'set', text: 'Where it fits in the Kyoto Kissaten set' },
    {
      type: 'p',
      text: 'We chose the Skerton for the set because it suits exactly the person the set is for: someone who wants a lovely, complete pour-over ritual at home, one to three cups at a time. It is not an enthusiast’s endgame grinder, and we would rather say so than pretend otherwise.',
    },
    {
      type: 'set',
      handle: 'kyoto-kissaten',
      text: 'The grinder comes with an amber glass dripper and jug, an electric gooseneck kettle, four handleless cups and an acacia board: the full pour-over setup in one box, for less than the pieces cost separately.',
    },
    { type: 'pieces', handles: ['hario-hand-grinder'] },
    { type: 'h2', id: 'hand-vs-electric', text: 'Hand or electric burr grinder?' },
    {
      type: 'table',
      head: ['', 'Hand burr grinder', 'Electric burr grinder'],
      rows: [
        ['Price for decent quality', 'Lower', 'Higher'],
        ['Speed', 'About a minute per cup', 'Seconds'],
        ['Noise', 'Almost silent', 'Loud'],
        ['Counter space', 'Small, can be put away', 'Needs a spot and a socket'],
        ['Best for', 'One or two cups, pour-over, travel', 'Families, espresso, coarse grinds in volume'],
      ],
    },
    { type: 'h2', id: 'grind-guide', text: 'Grind size by brewing method' },
    {
      type: 'table',
      head: ['Method', 'Grind', 'Looks like'],
      rows: [
        ['Espresso', 'Fine', 'Flour or icing sugar, slightly gritty'],
        ['Moka pot', 'Fine to medium-fine', 'Fine sand'],
        ['Pour-over', 'Medium-fine', 'Coarse sea salt'],
        ['Cafetière', 'Coarse', 'Breadcrumbs or rock salt'],
      ],
    },
    { type: 'h2', id: 'faq', text: 'Questions' },
    {
      type: 'faq',
      items: [
        { q: 'What setting for pour-over?', a: 'Medium-fine, like coarse sea salt. Start in the middle of the range and adjust: finer if the coffee tastes sour, coarser if it tastes bitter.' },
        { q: 'How long does a hand grinder last?', a: 'Ceramic burrs wear very slowly. Looked after, a hand grinder lasts for years.' },
        { q: 'Can I wash the burrs?', a: 'Brush them clean rather than washing them. Wash the glass jar by hand.' },
      ],
    },
  ],
};
