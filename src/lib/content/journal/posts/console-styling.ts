import type { Post } from '../types';

export const consoleStyling: Post = {
  slug: 'how-to-style-a-console-table',
  title: 'How to style a console table: a five-piece formula that works',
  metaTitle: 'How to style a console table: a simple 5-piece formula',
  description:
    'A simple formula for styling a console table or sideboard: lamp, mirror, height, glass and candlelight. Mirror sizes, heights and spacing, with a small-hallway version.',
  excerpt: 'Lamp, mirror, something tall, something glass and candlelight. The rules for heights, mirror size and spacing, and a version for a narrow hall.',
  category: 'Styling',
  keyword: 'how to style a console table',
  published: '2026-11-04',
  hero: { id: 'photo-1785535573604-62e31f0fd341', alt: 'A round mirror above a wooden console table with decor' },
  set: 'the-milanese',
  blocks: [
    {
      type: 'lead',
      text: 'A console table is one of the hardest surfaces in a home to get right. Leave it bare and it looks unfinished; fill it and it becomes a dumping ground for keys and post. The fix is a simple formula of five pieces, each with a job.',
    },
    { type: 'h2', id: 'formula', text: 'The five-piece formula' },
    {
      type: 'list',
      ordered: true,
      items: [
        '**A lamp at one end.** This is the anchor. A table lamp gives the corner its own light in the evening, which matters more than anything else on the table.',
        '**A mirror above, centred.** It doubles the lamp’s light, makes a hall or living room feel bigger and pulls the wall and table together.',
        '**Something tall at the other end.** A vase, a stack of books with an object on top, or a tall bottle. It balances the lamp.',
        '**Something glass or reflective in the middle.** A decanter, glasses on a tray or a bowl. Glass catches the light and keeps the middle from feeling heavy.',
        '**Something low at the front.** Candle holders or a small dish. They bring the eye down and give you a place for small things.',
      ],
    },
    { type: 'image', wide: true, photo: { id: 'photo-1778731525568-74f8a261f3af', alt: 'Modern entryway with console table and mirror' } },
    { type: 'h2', id: 'heights', text: 'Getting the heights right' },
    {
      type: 'p',
      text: 'Think of a triangle. The lamp is the high point at one end, the vase a slightly lower point at the other, and the things in the middle and front are lower still. Objects all the same height in a row look like a shop shelf; a triangle looks composed.',
    },
    {
      type: 'tip',
      title: 'Odd numbers, grouped',
      text: 'Group small things in threes or fives rather than spacing single objects evenly along the table. A tray helps: anything on a tray reads as one group.',
    },
    { type: 'h2', id: 'mirror', text: 'Mirror size and height' },
    {
      type: 'table',
      head: ['Question', 'Rule of thumb'],
      rows: [
        ['How wide?', 'About two-thirds to three-quarters of the console’s width. Wider than the table looks top-heavy.'],
        ['How high?', 'Bottom edge about 15 to 25 cm above the tabletop, so the lamp and vase overlap it slightly.'],
        ['Centred?', 'Yes, on the table rather than on the wall, even if the table is off-centre.'],
        ['Shape?', 'A round or wavy mirror softens a straight-edged table; a tall, narrow one suits a low ceiling or narrow wall.'],
      ],
    },
    { type: 'h2', id: 'lamp', text: 'Choosing the lamp' },
    {
      type: 'p',
      text: 'The lamp should be tall enough to light the wall and the mirror, not just the tabletop. Pick a warm bulb (around 2700K) so the evening light is soft. Stone, ceramic or glass bases give weight; a mushroom or dome shade throws light downwards across the table. Run the cable down the back leg and plug it in behind the table.',
    },
    { type: 'image', photo: { id: 'photo-1784653549130-67586c49f016', alt: 'A black console table with a vase and irregular mirrors' } },
    { type: 'h2', id: 'small-hallway', text: 'The small-hallway version' },
    {
      type: 'p',
      text: 'Many Irish hallways are narrow, so a deep console is not an option. Use a slim console or a wall-mounted shelf about 25 to 30 cm deep, and cut the formula to three pieces: a slim lamp or a wall light, the mirror, and one tray for keys. The tray is what stops it turning into a pile of post.',
    },
    { type: 'h2', id: 'living-room', text: 'The drinks console version' },
    {
      type: 'p',
      text: 'In a living or dining room, a console or sideboard makes an elegant drinks corner, the way Milan apartments do it. Keep the formula and make the glass piece a decanter with glasses: lamp at one end, vase at the other, decanter and glasses towards the lamp, a shaker beside them, candles at the front and the mirror above. Our guide to [home bar essentials](/journal/home-bar-essentials-small-drinks-corner) covers what to keep on it.',
    },
    {
      type: 'set',
      handle: 'the-milanese',
      text: 'The Milanese is this formula in one box: a travertine table lamp, a wavy pine-framed mirror, a mouth-blown glass vase, a cut-crystal decanter with four glasses, a two-tin Boston shaker and a pair of ceramic candle holders. Set it on a console or sideboard about 120 × 40 cm.',
    },
    {
      type: 'p',
      text: 'No console yet? The set page also offers the Manhattan console table, a 120 cm cream console with a marble-effect top and fluted drawers, delivered separately by courier and cheaper when ordered with the set.',
    },
    { type: 'pieces', handles: ['travertine-table-lamp', 'wavy-wall-mirror', 'blown-glass-vase'] },
    { type: 'h2', id: 'mistakes', text: 'Five common mistakes' },
    {
      type: 'list',
      items: [
        'A mirror that is too small, floating high up the wall.',
        'Everything the same height.',
        'No lamp, so the corner disappears in the evening.',
        'Too many small things spread out instead of grouped.',
        'Nowhere for keys and post, so they end up everywhere.',
      ],
    },
    { type: 'h2', id: 'faq', text: 'Questions' },
    {
      type: 'faq',
      items: [
        { q: 'What size console table do I need?', a: 'Allow at least 15 cm of wall either side. For a drinks or display console, about 120 cm wide and 35 to 40 cm deep works well. In a narrow hall, look for 25 to 30 cm deep.' },
        { q: 'Should a console table match the other furniture?', a: 'It does not need to. It should share one thing with the room, such as a wood tone, metal finish or colour.' },
        { q: 'What can I put on a console table instead of a lamp?', a: 'A wall light above it, or a cluster of candles. But a lamp is the single most effective piece.' },
      ],
    },
  ],
};
