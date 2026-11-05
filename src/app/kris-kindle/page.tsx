import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant } from '@/lib/catalog/variants';
import { SITE_URL } from '@/lib/config/site';
import { KRIS_KINDLE } from '@/lib/content/landings';
import { preorderPage } from '@/lib/content/preorders';
import { setForPiece } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { AddToBasket } from '@/components/landing/AddToBasket';
import { COMMON_FAQS, LandingFaq } from '@/components/landing/LandingFaq';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

const LIMIT = 5000; // cents
const BANDS = [
  { id: 'under-25', label: 'Under €25', max: 2500 },
  { id: 'under-35', label: 'Under €35', max: 3500 },
  { id: 'under-50', label: 'Under €50', max: 5000 },
];

export const metadata: Metadata = {
  title: 'Kris Kindle gifts under €50 in Ireland',
  description:
    'Kris Kindle and Secret Santa gifts under €50: candle holders, a Boston shaker, an acacia board, a glass pour-over dripper and a blown glass vase, posted from Ireland with no customs charges.',
  alternates: { canonical: '/kris-kindle' },
  openGraph: {
    title: 'Kris Kindle, sorted',
    url: `${SITE_URL}/kris-kindle`,
    images: [{ url: '/images/landing/og-kris-kindle.jpg', width: 1200, height: 630, alt: 'Five gifts under €50 in a row' }],
  },
};

export default async function KrisKindlePage() {
  const page = preorderPage();
  const products = await getProducts();
  const gifts = products
    .filter((p): p is Product => p.productType !== 'Room set' && Boolean(p.variants[0]?.availableForSale) && p.variants[0].price.amount <= LIMIT)
    .sort((a, b) => a.variants[0].price.amount - b.variants[0].price.amount);
  const cheapest = gifts[0] ? formatMoney(defaultVariant(gifts[0]).price) : null;
  const band = (p: Product) => BANDS.find((b) => p.variants[0].price.amount <= b.max)!;
  const usedBands = BANDS.filter((b) => gifts.some((g) => band(g).id === b.id));

  const faqs = [
    ...(page.christmasAnswer ? [{ q: 'Will it arrive before Christmas?', a: page.christmasAnswer }] : []),
    {
      q: 'Can I order a few at once?',
      a: 'Yes. Add as many as you need to the basket and they come in one delivery, or send each one to a different address in separate orders.',
    },
    ...COMMON_FAQS,
  ];

  return (
    <div className="lp lp-kk">
      {/* Header: type first, then the tags hanging on a line. */}
      <header className="lp-kk-hero">
        <div className="container lp-kk-hero__text">
          <p className="lp-kicker lp-kicker--clay">Kris Kindle and Secret Santa</p>
          <h1 className="display lp-kk-hero__title">
            Kris Kindle,
            <br />
            sorted.
          </h1>
          <p className="lp-kk-hero__lede">
            {gifts.length} gifts under €50{cheapest ? `, from ${cheapest}` : ''}. Each one is a piece from our room sets, sold on its own and posted from Ireland, so
            there is nothing to pay at the door.
          </p>
        </div>
        <ul className="lp-kk-tags" aria-label="Gifts under €50">
          {gifts.map((p, i) => {
            const extra = KRIS_KINDLE[p.handle];
            return (
              <li key={p.handle} className="lp-kk-tag" style={{ '--i': i } as React.CSSProperties}>
                <a href={`#${p.handle}`}>
                  <span className="lp-kk-tag__hole" aria-hidden="true" />
                  {extra && <Media src={extra.image.src} alt="" ratio="1 / 1" sizes="(min-width: 1024px) 15vw, 40vw" priority={i < 3} />}
                  <span className="lp-kk-tag__price">{formatMoney(defaultVariant(p).price)}</span>
                  <span className="visually-hidden">{p.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <nav className="container lp-kk-bands" aria-label="Budget">
          {usedBands.map((b) => (
            <a key={b.id} href={`#${b.id}`}>
              {b.label}
            </a>
          ))}
        </nav>
      </header>

      {/* By budget. */}
      <section className="container lp-kk-list" aria-label="Gifts by budget">
        {usedBands.map((b) => (
          <div key={b.id} id={b.id} className="lp-kk-band">
            <h2 className="lp-kk-band__title">{b.label}</h2>
            <ul>
              {gifts
                .filter((g) => band(g).id === b.id)
                .map((p) => {
                  const extra = KRIS_KINDLE[p.handle];
                  const set = setForPiece(p.handle);
                  return (
                    <li key={p.handle} id={p.handle} className="lp-kk-gift">
                      <Link href={`/products/${p.handle}`} className="lp-kk-gift__media" tabIndex={-1} aria-hidden="true">
                        {extra && <Media src={extra.image.src} alt="" ratio="1 / 1" sizes="(min-width: 900px) 220px, 40vw" />}
                      </Link>
                      <div className="lp-kk-gift__body">
                        <h3>
                          <Link href={`/products/${p.handle}`}>{p.title}</Link>
                        </h3>
                        {extra && <p className="lp-kk-gift__for">{extra.forWhom}</p>}
                        {set && <p className="lp-kk-gift__from">From {set.title}</p>}
                      </div>
                      <div className="lp-kk-gift__buy">
                        <span className="lp-kk-gift__price">{formatMoney(defaultVariant(p).price)}</span>
                        <AddToBasket product={p} />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </section>

      {/* Tips. */}
      <section className="lp-kk-tips" aria-labelledby="tips-title">
        <div className="container">
          <h2 id="tips-title" className="display-2">
            Kris Kindle, the easy way
          </h2>
          <ol className="lp-kk-tips__list">
            <li>
              <h3>Agree the budget first</h3>
              <p>Set it before names come out of the hat, so nobody is left holding a €10 gift against a €50 one.</p>
            </li>
            <li>
              <h3>Order by {page.dates.orderBy === 'Today' ? 'this week' : page.dates.orderBy}</h3>
              <p>{page.line} Delivery usually takes 1 to 3 working days after posting.</p>
            </li>
            <li>
              <h3>Post it straight to them</h3>
              <p>Use their address and your email at checkout. The tracking comes to you, and the name on the tag stays a secret.</p>
            </li>
          </ol>
          <Link href="/gifts" className="arrow-link">
            Bigger gifts in the Christmas gift guide <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      <LandingFaq id="kk-faq" faqs={faqs} />
    </div>
  );
}
