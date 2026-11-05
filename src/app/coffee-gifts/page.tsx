import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { setOffer } from '@/lib/catalog/offers';
import { defaultVariant } from '@/lib/catalog/variants';
import { SITE_URL } from '@/lib/config/site';
import { getPost } from '@/lib/content/journal';
import { COFFEE_MOMENTS } from '@/lib/content/landings';
import { preorderPage } from '@/lib/content/preorders';
import { getRoomSet } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { AddToBasket } from '@/components/landing/AddToBasket';
import { COMMON_FAQS, LandingFaq } from '@/components/landing/LandingFaq';
import { PostCard } from '@/components/journal/PostCard';
import { SetBuy } from '@/components/sets/SetBuy';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

const HANDLE = 'kyoto-kissaten';

export const metadata: Metadata = {
  title: 'Gifts for coffee lovers in Ireland: a complete pour-over set',
  description:
    'A Christmas gift for a coffee lover: a complete pour-over coffee set in one box, with a gooseneck kettle, Hario hand grinder, glass dripper, four cups and an acacia board. Posted from Ireland.',
  alternates: { canonical: '/coffee-gifts' },
  openGraph: {
    title: 'The pour-over gift',
    url: `${SITE_URL}/coffee-gifts`,
    images: [{ url: '/images/landing/og-coffee-gifts.jpg', width: 1200, height: 630, alt: 'A black gooseneck kettle tilted over an amber glass pour-over dripper' }],
  },
};

export default async function CoffeeGiftsPage() {
  const set = getRoomSet(HANDLE)!;
  const page = preorderPage();
  const products = await getProducts();
  const product = products.find((p) => p.handle === HANDLE);
  const productOf = (handle: string) => products.find((p) => p.handle === handle);
  const offer = setOffer(set, products);
  const price = product ? formatMoney(defaultVariant(product).price) : null;
  const guides = ['pour-over-coffee-for-beginners', 'is-a-hand-grinder-worth-it-hario-skerton', 'gifts-for-coffee-lovers-ireland'].map(getPost).filter((p) => p !== null);

  const faqs = [
    ...(page.christmasAnswer ? [{ q: 'Will it arrive before Christmas?', a: page.christmasAnswer }] : []),
    {
      q: 'Is pour-over hard to get right?',
      a: 'No. It is a kettle, a grinder and a cone with a paper filter. The set page has the whole method in six steps, and our beginner’s guide in the Journal covers the rest.',
    },
    {
      q: 'They already have a grinder. Can I leave it out?',
      a: 'Every piece is also sold on its own, so you can buy just the pieces they need. The set costs less than buying all five separately.',
    },
    { q: 'Does it come with coffee?', a: 'No. Add a bag of beans from their favourite Irish roaster, ground fresh in the grinder on the morning.' },
    ...COMMON_FAQS,
  ];

  return (
    <div className="lp lp-coffee">
      {/* Split header: ink panel with the date, the pour on the right. */}
      <header className="lp-coffee-hero">
        <div className="lp-coffee-hero__media">
          <Media src="/images/landing/coffee-pour.jpg" alt="A black gooseneck kettle tilted over an amber glass pour-over dripper" ratio="fill" priority sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>
        <div className="lp-coffee-hero__panel world world--ink">
          <span className="lp-coffee-hero__native" lang="ja" aria-hidden="true">
            喫茶店
          </span>
          <p className="lp-kicker">A Christmas gift for a coffee lover</p>
          <h1 className="display-2 lp-coffee-hero__title">Give them the slow way to make coffee.</h1>
          <p className="lp-coffee-hero__lede">
            Everything for pour-over at home in one box: the kettle, the grinder, the dripper, four cups and a board to serve on. No machine, no pods.
          </p>
          {product && (
            <div className="lp-coffee-hero__buy">
              <SetBuy product={product} cta={page.cta} line={page.line} compact />
              <p>{page.line}</p>
            </div>
          )}
        </div>
      </header>

      {/* The brew, in four moments. */}
      <section className="container lp-coffee-moments" aria-labelledby="moments-title">
        <header className="lp-head">
          <h2 id="moments-title" className="display-2">
            Christmas morning, in about five minutes
          </h2>
          <p>Every piece in the box has one job in the brew. This is the whole method; the set page has it step by step.</p>
        </header>
        <ol className="lp-coffee-moments__list">
          {COFFEE_MOMENTS.map((m, i) => {
            const piece = set.pieces.find((p) => p.handle === m.piece);
            return (
              <li key={m.title}>
                <Media src={m.image.src} alt={m.image.alt} ratio="1 / 1" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 80vw" />
                <p className="lp-coffee-moments__step">
                  {i + 1} · {m.title}
                </p>
                <p>{m.text}</p>
                {piece && (
                  <Link href={`/products/${piece.handle}`} className="lp-coffee-moments__piece">
                    {piece.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* What is in the box, as a receipt. */}
      <section className="lp-coffee-box" aria-labelledby="box-title">
        <div className="container lp-coffee-box__inner">
          <div className="lp-coffee-box__media">
            <Media src="/images/sets/kyoto/contents.jpg" alt={set.contents?.alt ?? 'Everything in the Kyoto Kissaten set'} ratio="16 / 10" sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div className="lp-receipt" role="group" aria-labelledby="box-title">
            <h2 id="box-title" className="lp-receipt__title">
              In the box
            </h2>
            <p className="lp-receipt__sub">{set.title} · posted from Ireland</p>
            <ul>
              {set.pieces.map((p) => {
                const single = productOf(p.handle);
                return (
                  <li key={p.handle}>
                    <span>
                      {p.name}
                      {p.qty > 1 ? ` × ${p.qty}` : ''}
                    </span>
                    <span className="lp-receipt__dots" aria-hidden="true" />
                    <span>{single ? formatMoney(defaultVariant(single).price) : '—'}</span>
                  </li>
                );
              })}
            </ul>
            {offer && (
              <>
                <p className="lp-receipt__line">
                  <span>Bought separately</span>
                  <span>{formatMoney(offer.separately)}</span>
                </p>
                <p className="lp-receipt__total">
                  <span>As a set</span>
                  <span>{formatMoney(offer.setPrice)}</span>
                </p>
                {offer.saving > 0 && <p className="lp-receipt__saving">You save {formatMoney(offer.saving)}</p>}
              </>
            )}
            {product && <SetBuy product={product} cta={page.cta} line={page.line} compact />}
            <p className="lp-receipt__note">
              {page.line} Delivery is shown at checkout. <Link href={`/sets/${HANDLE}`}>See every piece in detail</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Add the beans. */}
      <section className="lp-coffee-beans" aria-labelledby="beans-title">
        <div className="container lp-coffee-beans__inner">
          <h2 id="beans-title" className="display-2">
            Add the beans.
          </h2>
          <p>
            The one thing not in the box. Pick up a bag from their favourite Irish roaster, whole beans rather than ground, and the first cup is ready on
            Christmas morning.
          </p>
        </div>
      </section>

      {/* Just one piece. */}
      <section className="container lp-coffee-singles" aria-labelledby="singles-title">
        <header className="lp-head">
          <h2 id="singles-title" className="display-2">
            Or just one piece
          </h2>
          <p>For someone who has half the kit already. Every piece is sold on its own.</p>
        </header>
        <ul className="lp-coffee-singles__list">
          {COFFEE_MOMENTS.map((m) => {
            const single = productOf(m.piece);
            if (!single) return null;
            return (
              <li key={m.piece}>
                <Link href={`/products/${m.piece}`} className="lp-coffee-singles__name">
                  {single.title}
                </Link>
                <span className="lp-coffee-singles__price">{formatMoney(defaultVariant(single).price)}</span>
                <AddToBasket product={single} />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Closing order band. */}
      {product && (
        <section className="lp-close world world--ink" aria-labelledby="coffee-close">
          <div className="container lp-close__inner">
            <h2 id="coffee-close" className="display-2">
              {set.title}, {price}
            </h2>
            <p>{page.line}</p>
            <SetBuy product={product} cta={page.cta} line={page.line} compact />
          </div>
        </section>
      )}
      <LandingFaq id="coffee-faq" faqs={faqs} />

      {guides.length > 0 && (
        <section className="container lp-guides" aria-labelledby="coffee-guides">
          <div className="lp-guides__head">
            <h2 id="coffee-guides" className="display-2">
              From the Journal
            </h2>
            <Link href="/journal" className="arrow-link">
              All guides <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <ul className="journal-grid">
            {guides.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
