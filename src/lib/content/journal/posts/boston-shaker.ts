import type { Post } from '../types';

export const bostonShaker: Post = {
  slug: 'boston-shaker-cocktails',
  title: 'How to use a Boston shaker, and three classic cocktails to make with it',
  metaTitle: 'How to use a Boston shaker, plus 3 classic cocktails',
  description:
    'How to seal, shake and open a two-tin Boston shaker without spills, plus three classic recipes in millilitres: a whiskey sour, a daiquiri and an espresso martini.',
  excerpt: 'Seal, shake, tap, strain. How a two-tin shaker works, and three classics to practise on: a whiskey sour, a daiquiri and an espresso martini.',
  category: 'Home bar',
  keyword: 'how to use a boston shaker',
  published: '2026-11-04',
  hero: { id: 'photo-1779635593390-8b478382885f', alt: 'A bartender straining a cocktail into a glass' },
  set: 'the-milanese',
  blocks: [
    {
      type: 'lead',
      text: 'A Boston shaker is two metal tins, one larger than the other, that fit together to shake a drink. It is what most bartenders use, and once you know the trick to sealing and opening it, it is quicker and less messy than the three-piece shakers sold in gift sets.',
    },
    { type: 'h2', id: 'how-it-works', text: 'How to use it, step by step' },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Build the drink in the small tin.** Measure in the ingredients, cheapest first (citrus and syrup, then spirit), so a mistake costs less.',
        '**Fill the large tin with ice,** about two-thirds full.',
        '**Seal.** Tip the large tin over the small one at a slight angle, so one side of the tins lines up, and give the top a firm tap with the heel of your hand. It should hold together if you lift it by the top tin.',
        '**Shake hard for 10 to 15 seconds,** holding both tins, small tin towards you. The outside will frost when it is cold enough.',
        '**Open.** Hold the tins with the large one at the bottom. Where the rims meet at a gap, tap the large tin sharply with the heel of your other hand. The seal breaks.',
        '**Strain** into the glass through a Hawthorne strainer held over the large tin.',
      ],
    },
    {
      type: 'tip',
      title: 'It will not come apart?',
      text: 'Do not twist or pull. Find the side where the small tin leans away from the large one, and tap the large tin firmly just below the rim there. It releases at once.',
    },
    { type: 'image', photo: { id: 'photo-1629274535685-846d95e04095', alt: 'A drink being poured into a clear glass' } },
    { type: 'h2', id: 'whiskey-sour', text: '1. Whiskey sour' },
    {
      type: 'p',
      text: 'The best way to learn the balance of strong, sour and sweet that most classic cocktails follow. Irish whiskey works beautifully.',
    },
    {
      type: 'list',
      items: ['50 ml whiskey', '25 ml fresh lemon juice', '15 to 20 ml simple syrup', 'Optional: 1 egg white, or 15 ml aquafaba, for a foamy top', 'A few drops of Angostura bitters, to finish'],
    },
    {
      type: 'p',
      text: 'Shake everything except the bitters without ice first if you use egg white (a "dry shake"), then add ice and shake again. Strain into a rocks glass over fresh ice and dot the bitters on top.',
    },
    { type: 'h2', id: 'daiquiri', text: '2. Daiquiri' },
    {
      type: 'p',
      text: 'Not the frozen, strawberry kind: the original is three ingredients and one of the best drinks there is.',
    },
    { type: 'list', items: ['50 ml white rum', '25 ml fresh lime juice', '15 ml simple syrup'] },
    { type: 'p', text: 'Shake hard with ice and strain into a chilled coupe. Taste, and adjust the syrup to your limes next time.' },
    { type: 'image', photo: { id: 'photo-1551790629-9d5c2d781d8b', alt: 'A clear martini glass on a brown surface' } },
    { type: 'h2', id: 'espresso-martini', text: '3. Espresso martini' },
    {
      type: 'p',
      text: 'A good use for a shaker and your coffee kit together. Use freshly made coffee: pour-over made at double strength works if you do not have an espresso machine.',
    },
    { type: 'list', items: ['40 ml vodka', '25 ml coffee liqueur', '25 ml fresh espresso or strong coffee, cooled slightly', '5 to 10 ml simple syrup, to taste'] },
    {
      type: 'p',
      text: 'Shake very hard with plenty of ice: that is what makes the foam. Strain into a chilled coupe and float three coffee beans on top.',
    },
    { type: 'h2', id: 'stirred', text: 'What not to shake: the Negroni' },
    {
      type: 'p',
      text: 'Drinks made only of spirits, like a Negroni (25 ml each of gin, Campari and sweet vermouth) or an Old Fashioned, are stirred, not shaken, so they stay clear and silky. Use the large tin as a mixing glass: stir with ice for about 20 seconds and strain over fresh ice. The rule of thumb is simple: if it has citrus, juice or egg, shake it; if not, stir it.',
    },
    { type: 'image', wide: true, photo: { id: 'photo-1761361371739-546f12a9cee4', alt: 'A dark amber cocktail with an orange peel garnish' } },
    {
      type: 'set',
      handle: 'the-milanese',
      text: 'The Milanese set includes a two-tin Boston shaker in polished steel (18 oz and 25 oz), alongside a cut-crystal decanter with four glasses, a travertine lamp, a wavy mirror, a glass vase and candle holders: a whole Milan-style drinks corner in one box.',
    },
    { type: 'pieces', handles: ['boston-shaker-tins', 'crystal-decanter-set'] },
    { type: 'h2', id: 'dilution', text: 'Why shaking with ice matters' },
    {
      type: 'p',
      text: 'Shaking does three things at once: it chills the drink, adds air, and melts some ice into it. That water is part of the recipe; a properly shaken sour is roughly a quarter meltwater, which softens the alcohol and brings out the flavour. So use plenty of ice, fill the tin about two-thirds full, and shake hard rather than gently.',
    },
    { type: 'h2', id: 'party', text: 'Making drinks for a group' },
    {
      type: 'list',
      items: [
        'Squeeze the citrus and make the syrup before guests arrive. Fresh juice keeps for a few hours in the fridge.',
        'A Boston shaker comfortably shakes two drinks at once; double everything.',
        'For stirred drinks like a Negroni, mix a bottle in advance, keep it in the fridge and pour over ice.',
        'Put out a jug of water and a non-alcoholic option for drivers.',
      ],
    },
    { type: 'h2', id: 'zero', text: 'Without alcohol' },
    {
      type: 'p',
      text: 'The shaker works just as well for alcohol-free drinks. Shake 50 ml of cold brew or strong coffee with 15 ml of syrup and plenty of ice for a frothy iced coffee, or shake fresh lemon or lime juice, syrup and a non-alcoholic spirit for a sour that everyone at the table can have.',
    },
    { type: 'h2', id: 'faq', text: 'Questions' },
    {
      type: 'faq',
      items: [
        { q: 'Why is my shaker leaking?', a: 'The seal was not firm enough. Tap the top tin down harder, and make sure the tins are dry on the outside. Cold metal seals better, so the seal tightens as you shake.' },
        { q: 'Do I need a strainer with a Boston shaker?', a: 'Yes, a Hawthorne strainer is easiest. In a pinch, crack the tins open just slightly and pour through the gap.' },
        { q: 'What is simple syrup?', a: 'Equal parts white sugar and hot water, stirred until clear and cooled. It keeps in the fridge for about a month.' },
      ],
    },
    {
      type: 'p',
      text: 'Please drink responsibly and never drink and drive. See [drinkaware.ie](https://www.drinkaware.ie) for guidance. Raw egg white is not recommended during pregnancy or for anyone with a weakened immune system; aquafaba is a good alternative.',
    },
  ],
};
