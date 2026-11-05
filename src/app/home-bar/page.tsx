import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { setOffer } from '@/lib/catalog/offers';
import { defaultVariant } from '@/lib/catalog/variants';
import { SITE_URL } from '@/lib/config/site';
import { addOnsForSet } from '@/lib/content/addons';
import { COCKTAILS, CONSOLE_SPOTS } from '@/lib/content/landings';
import { preorderPage } from '@/lib/content/preorders';
import { getRoomSet } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { COMMON_FAQS, LandingFaq } from '@/components/landing/LandingFaq';
import { SetBuy } from '@/components/sets/SetBuy';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

const HANDLE = 'the-milanese';
const RECIPES = '/journal/boston-shaker-cocktails';
/** Same breakpoint as `.world-hero__img--tall` in sets.css. */
const TALL = '(max-width: 767px) and (orientation: portrait)';

export const metadata: Metadata = {
  title: 'Home bar gifts in Ireland: a complete drinks corner in one box',
  description:
    'A Christmas gift for a host or cocktail fan: crystal decanter and glasses, Boston shaker, travertine lamp, wavy mirror, vase and candle holders, packed in one box and posted from Ireland.',
  alternates: { canonical: '/home-bar' },
  openGraph: {
    title: 'The drinks corner',
    url: `${SITE_URL}/home-bar`,
    images: [{ url: '/images/landing/og-home-bar.jpg', width: 1200, height: 630, alt: 'The Milanese drinks corner on a marble console in evening light' }],
  },
};

export default async function HomeBarPage() {
  const set = getRoomSet(HANDLE)!;
  const page = preorderPage();
  const products = await getProducts();
  const product = products.find((p) => p.handle === HANDLE);
  const productOf = (handle: string) => products.find((p) => p.handle === handle);
  const offer = setOffer(set, products);
  const price = product ? formatMoney(defaultVariant(product).price) : null;
  const console_ = addOnsForSet(HANDLE).find((a) => a.handle === 'manhattan-console');
  const spotted = CONSOLE_SPOTS.map((s, i) => ({ ...s, n: i + 1, piece: set.pieces.find((p) => p.handle === s.handle) })).filter((s) => s.piece);
  const unspotted = set.pieces.filter((p) => !CONSOLE_SPOTS.some((s) => s.handle === p.handle));

  const faqs = [
    ...(page.christmasAnswer ? [{ q: 'Will it arrive before Christmas?', a: page.christmasAnswer }] : []),
    { q: 'Are the drinks included?', a: 'No. The set is everything for the corner except the drinks: they add the whiskey, the rum and the limes.' },
    {
      q: 'Does it come with the console table?',
      a: console_
        ? `No. The set is what goes on and above the console. The ${console_.title} is an optional add-on on the set page, ${formatMoney(console_.withSetPrice)} with the set.`
        : 'No. The set is what goes on and above a console or sideboard you already have.',
    },
    { q: 'Is the decanter real crystal?', a: 'Yes, clear cut crystal, with four matching glasses, whisky chilling stones and a small wooden tray for them, in a black and gold gift box.' },
    ...COMMON_FAQS,
  ];

  return (
    <div className="lp lp-bar">
      {/* Cover: the set after dark, title centred inside a thin frame. */}
      <header className="lp-bar-hero">
        <Media src="/images/landing/bar-evening.jpg" alt="The Milanese drinks corner on a marble console in low evening light" ratio="fill" priority sizes={`${TALL} 1px, 100vw`} className="lp-bar-hero__img lp-bar-hero__img--wide" />
        <Media src="/images/landing/bar-evening-tall.jpg" alt="The wavy pine mirror above the marble console in evening light" ratio="fill" priority sizes={`${TALL} 100vw, 1px`} className="lp-bar-hero__img lp-bar-hero__img--tall" />
        <div className="lp-bar-hero__frame" aria-hidden="true" />
        <div className="container lp-bar-hero__body">
          <p className="lp-kicker">{set.title}: a drinks corner in one box</p>
          <h1 className="display lp-bar-hero__title">Evenings start here.</h1>
          <p className="lp-bar-hero__lede">A decanter and glasses, a shaker, a lamp, a mirror and candlelight. For the friend whose house everyone ends up in.</p>
          <div className="lp-bar-hero__actions">
            <a href="#order" className="button button--light">
              {page.cta}
              {price ? `, ${price}` : ''}
            </a>
            <a href="#drinks" className="hero-link">
              Three drinks to make first <Icon name="arrow-down" size={16} />
            </a>
          </div>
        </div>
        <p className="lp-bar-hero__date">{page.line}</p>
      </header>

      {/* Three drinks. */}
      <section id="drinks" className="lp-bar-drinks" aria-labelledby="drinks-title">
        <div className="container">
          <header className="lp-head lp-head--light">
            <h2 id="drinks-title" className="display-2">
              Three drinks to make first
            </h2>
            <p>Shaken, all three, in the two-tin Boston shaker that comes in the box.</p>
          </header>
          <ul className="lp-bar-drinks__list">
            {COCKTAILS.map((c) => (
              <li key={c.id} className="lp-drink">
                <Media src={c.image.src} alt={c.image.alt} ratio="4 / 5" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                <h3 className="lp-drink__name">{c.name}</h3>
                <ul className="lp-drink__items">
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="lp-drink__method">{c.method}</p>
                <Link href={`${RECIPES}#${c.id}`} className="arrow-link">
                  The full recipe <Icon name="arrow-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The console, with each piece numbered. */}
      <section className="lp-bar-console" aria-labelledby="console-title">
        <div className="container">
          <header className="lp-head lp-head--light">
            <h2 id="console-title" className="display-2">
              What is on the console
            </h2>
            <p>
              {offer
                ? `The pieces cost ${formatMoney(offer.separately)} bought one by one. As a set, ${formatMoney(offer.setPrice)}, packed in one box.`
                : 'Every piece, chosen to work together and packed in one box.'}
            </p>
          </header>
        </div>
        <figure className="lp-bar-console__figure">
          <div className="lp-bar-console__img">
            <Media src="/images/landing/bar-console.jpg" alt="The lamp, decanter, shaker, vase and candle holders along the marble console" ratio="1960 / 640" sizes="100vw" />
            {spotted.map((s) => (
              <span key={s.handle} className="lp-bar-console__dot" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-hidden="true">
                {s.n}
              </span>
            ))}
          </div>
          <figcaption className="container">
            <ol className="lp-bar-console__legend">
              {spotted.map((s) => {
                const single = productOf(s.handle);
                return (
                  <li key={s.handle} data-n={s.n}>
                    <Link href={`/products/${s.handle}`}>{s.piece!.name}</Link>
                    {single && <span>{formatMoney(defaultVariant(single).price)}</span>}
                  </li>
                );
              })}
              {unspotted.map((p) => {
                const single = productOf(p.handle);
                return (
                  <li key={p.handle} data-n="↑">
                    <Link href={`/products/${p.handle}`}>{p.name}</Link>
                    {single && <span>{formatMoney(defaultVariant(single).price)}</span>}
                  </li>
                );
              })}
            </ol>
          </figcaption>
        </figure>
      </section>

      {/* How to set it up. */}
      <section className="container lp-bar-setup" aria-labelledby="setup-title">
        <div className="lp-bar-setup__media">
          <Media src="/images/landing/bar-lamp.jpg" alt="The travertine mushroom lamp on the console in evening light" ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="lp-bar-setup__body">
          <h2 id="setup-title" className="display-2">
            {set.guide.heading}
          </h2>
          <ol className="lp-bar-setup__steps">
            {set.guide.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Order. */}
      {product && (
        <section id="order" className="lp-close world world--ink" aria-labelledby="bar-order">
          <div className="container lp-close__inner lp-close__inner--split">
            <div>
              <h2 id="bar-order" className="display-2">
                {set.title}, {price}
              </h2>
              <p>
                {page.line}
                {offer && offer.saving > 0 ? ` ${formatMoney(offer.saving)} less than buying the pieces separately.` : ''}
              </p>
            </div>
            <div className="lp-close__actions">
              <SetBuy product={product} cta={page.cta} line={page.line} compact />
              <Link href={`/sets/${HANDLE}#order`} className="arrow-link">
                {console_ ? `Add the ${console_.title} on the set page` : 'See the set page'} <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <LandingFaq id="bar-faq" faqs={faqs} />
    </div>
  );
}
