import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import type { Product } from '@/lib/catalog/types';
import { setOffer } from '@/lib/catalog/offers';
import { defaultVariant } from '@/lib/catalog/variants';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { GIFT_SECTIONS } from '@/lib/content/gifts';
import { PRODUCT_PHOTOS, SET_SCENES, photoUrl } from '@/lib/content/media';
import { preorderPage } from '@/lib/content/preorders';
import { ROOM_SETS, itemCount, setPhoto, theTitle } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { SetBuy } from '@/components/sets/SetBuy';
import { PieceCard } from '@/components/shop/PieceCard';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { Media } from '@/components/ui/Media';

// Rebuilt hourly so the batch dates, headline and answers move on by themselves.
export const revalidate = 3600;

/** Same breakpoint as `.world-hero__img--tall` in sets.css. */
const HERO_TALL_MEDIA = '(max-width: 767px) and (orientation: portrait)';

/** One plain line per set for the hero and cards; falls back to the set's own line. */
const ROOM_LINE: Record<string, string> = {
  'kyoto-kissaten': 'A Kyoto coffee counter',
  'the-milanese': 'A Milan drinks corner',
  'riad-corner': 'A Moroccan tea corner',
};

export function generateMetadata(): Metadata {
  const page = preorderPage();
  const title =
    page.phase === 'christmas' ? `Pre-order for Christmas: order by ${page.dates.orderBy}` : 'Pre-order a room set, posted from Ireland';
  const description = `${page.lede} Room sets for coffee lovers, hosts and new homes, delivered anywhere in the Republic of Ireland.`;
  return {
    title,
    description,
    alternates: { canonical: '/preorders' },
    openGraph: { title, description, url: `${SITE_URL}/preorders`, images: [{ url: setPhoto(SET_SCENES.milaneseHero, 1200), alt: SET_SCENES.milaneseHero.alt }] },
  };
}

export default async function PreordersPage() {
  const page = preorderPage();
  const products = await getProducts();
  const productOf = (handle: string) => products.find((p) => p.handle === handle);
  const available = (p?: Product) => Boolean(p?.variants[0]?.availableForSale);

  const openSets = ROOM_SETS.filter((s) => s.status !== 'coming-soon' && available(productOf(s.handle)));
  const soonSets = ROOM_SETS.filter((s) => !openSets.includes(s));
  const savings = openSets
    .map((s) => {
      const offer = setOffer(s, products);
      return offer && offer.saving > 0 ? `${theTitle(s.title)} set saves ${formatMoney(offer.saving)}` : null;
    })
    .filter(Boolean);
  const under50 = products
    .filter((p) => available(p) && p.productType !== 'Room set' && p.variants[0].price.amount <= 5000)
    .sort((a, b) => a.variants[0].price.amount - b.variants[0].price.amount);
  const giftLines = GIFT_SECTIONS.filter((s) => !s.maxPrice);

  const { legal, contact } = siteConfig;
  const business = [legal.companyName, legal.companyNumber && `company number ${legal.companyNumber}`, legal.vatNumber && `VAT ${legal.vatNumber}`]
    .filter(Boolean)
    .join(', ');

  const faqs = [
    page.christmasAnswer && { q: 'Will it arrive before Christmas?', a: page.christmasAnswer },
    { q: 'Do I pay now, and can I change my mind?', a: page.cancelAnswer },
    {
      q: 'What happens if a batch is late?',
      a: 'We email you before the posted-by date passes. You can wait for the new date or cancel for a full refund.',
    },
    {
      q: 'Can you send it straight to the person I am buying for?',
      a: 'Yes. Put their name and address in the delivery address at checkout and the set is posted to them in its box. Use your own email address, so the tracking comes to you and not to them.',
    },
    {
      q: 'How much is delivery, and are there customs charges?',
      a: 'Delivery is charged at our standard rate, shown at checkout before you pay. We deliver anywhere in the Republic of Ireland. Orders are posted from Ireland, so there are no customs or import charges when it arrives.',
    },
    {
      q: 'What if they already own one of the pieces?',
      a: 'After delivery there are 14 days to cancel without giving a reason, and a set can be returned whole or piece by piece. Every piece is also sold on its own, if you would rather build your own set.',
    },
  ].filter((f): f is { q: string; a: string } => Boolean(f));

  return (
    <div className="preorders">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />

      {/* Arrival: the real Milanese set, with the date in the headline. */}
      <header className="world-hero preorders-hero">
        <Media
          src={setPhoto(SET_SCENES.milaneseHero, 2400)}
          alt={SET_SCENES.milaneseHero.alt}
          ratio="fill"
          priority
          sizes={`${HERO_TALL_MEDIA} 1px, 100vw`}
          focus={SET_SCENES.milaneseHero.focus}
          className="world-hero__img world-hero__img--wide"
        />
        <Media
          src={setPhoto(SET_SCENES.milaneseTall, 1200)}
          alt={SET_SCENES.milaneseTall.alt}
          ratio="fill"
          priority
          sizes={`${HERO_TALL_MEDIA} 100vw, 1px`}
          className="world-hero__img world-hero__img--tall"
        />
        <div className="container world-hero__top">
          <span>{page.batch ? `${page.batch.name} pre-orders` : 'Pre-orders'}</span>
        </div>
        <div className="container world-hero__body">
          <h1 className="display-2 preorders-hero__title">{page.title}</h1>
          <p className="world-hero__moment preorders-hero__lede">{page.lede}</p>
          <div className="world-hero__actions">
            <a href="#sets" className="button button--light">
              Choose your set
            </a>
            <a href="#how" className="hero-link">
              How pre-orders work <Icon name="arrow-down" size={16} />
            </a>
          </div>
        </div>
        <dl className="preorders-dates">
          <div>
            <dt>Order by</dt>
            <dd>{page.dates.orderBy}</dd>
          </div>
          <div>
            <dt>Posted by</dt>
            <dd>{page.dates.postedBy}</dd>
          </div>
          <div>
            <dt>Arrives</dt>
            <dd>Usually 1 to 3 working days after</dd>
          </div>
          <div>
            <dt>Customs charges</dt>
            <dd>None, posted from Ireland</dd>
          </div>
        </dl>
      </header>

      {/* The sets on order. */}
      <section id="sets" className="container preorders-sets" aria-labelledby="sets-title">
        <header className="preorders-section__head">
          <h2 id="sets-title" className="display-2">
            {openSets.length === 1 ? 'One room, in one box' : `${openSets.length === 2 ? 'Two' : openSets.length} rooms, each in one box`}
          </h2>
          <p>
            Every piece a corner needs, chosen to work together and packed in one box. {page.line}
          </p>
        </header>
        <ul className="preorders-sets__list">
          {openSets.map((set) => {
            const product = productOf(set.handle)!;
            const offer = setOffer(set, products);
            const photo = PRODUCT_PHOTOS[set.handle]?.[0] ?? set.heroTall;
            return (
              <li key={set.handle} className={`preorder-set world world--${set.theme}`}>
                <Link href={`/sets/${set.handle}`} className="preorder-set__media" tabIndex={-1} aria-hidden="true">
                  <Media src={photoUrl(photo.id, 1400)} alt="" ratio="4 / 3" sizes="(min-width: 900px) 45vw, 100vw" focus={photo.focus} />
                </Link>
                <div className="preorder-set__body">
                  <p className="preorder-set__place">{ROOM_LINE[set.handle] ?? set.moment}</p>
                  <h3 className="preorder-set__title">
                    <Link href={`/sets/${set.handle}`}>{set.title}</Link>
                  </h3>
                  <p className="preorder-set__kicker">{set.kicker}</p>
                  <p className="preorder-set__pieces">
                    <span className="visually-hidden">In the box: </span>
                    {set.pieces.map((p) => `${p.name}${p.qty > 1 ? ` × ${p.qty}` : ''}`).join(' · ')}
                  </p>
                  <p className="preorder-set__price">
                    {formatMoney(defaultVariant(product).price)} <span>the whole set, {itemCount(set)} things in one box</span>
                  </p>
                  {offer && offer.saving > 0 && (
                    <p className="preorder-set__saving">
                      The pieces cost {formatMoney(offer.separately)} bought separately. As a set you save {formatMoney(offer.saving)}.
                    </p>
                  )}
                  <div className="preorder-set__actions">
                    <SetBuy product={product} cta={page.cta} line={page.line} compact />
                    <Link href={`/sets/${set.handle}`} className="arrow-link">
                      See every piece <Icon name="arrow-right" size={16} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {soonSets.map((set) => (
          <p key={set.handle} className="preorders-soon">
            <span>
              <strong>{set.title}</strong>
              {ROOM_LINE[set.handle] ? `, ${ROOM_LINE[set.handle].replace(/^A /, 'a ')},` : ''} {set.status === 'coming-soon' ? 'opens in the new year.' : 'is not on order at the moment.'}
            </span>
            <Link href={`/sets/${set.handle}#order`} className="arrow-link">
              Hear when it opens <Icon name="arrow-right" size={16} />
            </Link>
          </p>
        ))}
      </section>

      {/* Black Friday: said plainly, once. */}
      <section className="preorders-nosale" aria-labelledby="nosale-title">
        <div className="container preorders-nosale__inner">
          <h2 id="nosale-title" className="display-2">
            {page.noSaleSeason ? 'No Black Friday sale.' : 'One price, all year.'}
          </h2>
          <div className="preorders-nosale__text">
            <p>
              We set one price for each set and keep it{page.noSaleSeason ? ', on Black Friday too' : ''}, so there is nothing to wait for. A set already costs
              less than its pieces bought one by one{savings.length ? `: ${savings.join(' and ')}` : ''}.
            </p>
            <p className="preorders-nosale__small">We would rather give you a true date than a big number.</p>
          </div>
        </div>
      </section>

      {/* Who it is for. */}
      <section className="container preorders-gifts" aria-labelledby="gifts-title">
        <header className="preorders-section__head">
          <h2 id="gifts-title" className="display-2">
            Who it is for
          </h2>
          <p>A set is the main present, whole and ready to use. For smaller gifts, every piece is also sold on its own.</p>
        </header>
        <ul className="preorders-gifts__lines">
          {giftLines.map((s) => (
            <li key={s.id}>
              <Link href={`/gifts#${s.id}`}>
                <span className="preorders-gifts__title">{s.title}</span>
                <span className="preorders-gifts__intro">{s.intro.split('. ')[0].replace(/\.$/, '')}.</span>
                <Icon name="arrow-right" size={18} />
              </Link>
            </li>
          ))}
        </ul>
        {under50.length > 0 && (
          <div className="preorders-gifts__small">
            <h3 className="preorders-gifts__subtitle">Gifts under €50</h3>
            <ul className="gifts-pieces">
              {under50.map((p) => (
                <li key={p.handle}>
                  <PieceCard product={p} sizes="(min-width: 1024px) 18vw, 45vw" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* How the batch works. */}
      <section id="how" className="home-how" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="display-2 home-how__title">
            How pre-orders work
          </h2>
          <ol className="home-how__steps preorders-steps">
            <li>
              <h3>You order and pay now</h3>
              <p>
                {page.batch
                  ? `Orders for the ${page.batch.name} batch close on ${page.dates.orderBy}. The posted-by date is in your basket before you pay, and in your order confirmation.`
                  : 'The posted-by date is in your basket before you pay, and in your order confirmation.'}
              </p>
            </li>
            <li>
              <h3>We pack it in one box</h3>
              <p>We gather every piece for your set, check it and pack it together, so nothing arrives in bits from different shops.</p>
            </li>
            <li>
              <h3>Posted by {page.dates.postedBy}</h3>
              <p>
                Sent from Ireland by An Post or courier, with tracking. If a batch is going to be late, we email you before the date passes, and you can wait or
                cancel for a full refund.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Why buy here. */}
      <section className="container preorders-trust" aria-labelledby="trust-title">
        <h2 id="trust-title" className="display-2">
          Posted from Ireland
        </h2>
        <ul className="preorders-trust__list">
          <li>
            <h3>Nothing to pay at the door</h3>
            <p>Orders are posted from within Ireland, so there are no customs charges, import fees or duty when it arrives.</p>
          </li>
          <li>
            <h3>Straight to them, if you like</h3>
            <p>Put the recipient’s address at checkout and keep your own email address, so the tracking comes to you.</p>
          </li>
          <li>
            <h3>14 days to change your mind</h3>
            <p>
              After delivery there are 14 days to cancel without giving a reason. A set can be returned whole or piece by piece.{' '}
              <Link href="/help/returns">How returns work</Link>
            </p>
          </li>
          <li>
            <h3>Secure checkout</h3>
            <p>Pay by debit or credit card, Apple Pay or Google Pay at checkout.</p>
          </li>
        </ul>
        <p className="preorders-trust__who">
          {business ? `${business}. ` : `${siteConfig.name}, based in Ireland. `}
          {contact.address ? `${contact.address}. ` : ''}
          Questions before you order? <Link href="/contact">Contact us</Link>
          {contact.email ? (
            <>
              {' '}
              or email <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </>
          ) : null}
          .
        </p>
      </section>

      {/* Questions. */}
      <section className="container preorders-faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="display-2">
          Questions
        </h2>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Icon name="plus" size={18} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="gifts-faq__more">
          More on <Link href="/help/delivery">delivery</Link>, <Link href="/help/orders">orders</Link> and <Link href="/help/returns">returns</Link>. Not
          ready to order? Join the list below for the last day to order in each batch.
        </p>
      </section>

    </div>
  );
}
