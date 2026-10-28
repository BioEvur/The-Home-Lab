import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProductsByHandles } from '@/lib/commerce';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { formatDay, preorderCopy } from '@/lib/content/batches';
import { ROOM_SETS, getRoomSet, itemCount, piecePhotos, setPhoto } from '@/lib/content/sets';
import { photoUrl } from '@/lib/content/media';
import { defaultVariant } from '@/lib/catalog/variants';
import { setOffer } from '@/lib/catalog/offers';
import { addOnsForSet } from '@/lib/content/addons';
import { formatMoney } from '@/lib/format';
import { BoxContents, type BoxPiece } from '@/components/sets/BoxContents';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { LocalTime } from '@/components/sets/LocalTime';
import { SetBuy, type SetAddOn } from '@/components/sets/SetBuy';
import { SetPlan } from '@/components/sets/SetPlan';
import { StickyOrder } from '@/components/sets/StickyOrder';
import { StoryBeats } from '@/components/sets/StoryBeats';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/ui/Reveal';

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

export function generateStaticParams() {
  return ROOM_SETS.map((s) => ({ handle: s.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const set = getRoomSet((await params).handle);
  if (!set) notFound();
  return {
    title: `${set.title}: ${set.moment}`,
    description: set.kicker,
    alternates: { canonical: `/sets/${set.handle}` },
    openGraph: { title: set.title, description: set.kicker, images: [setPhoto(set.hero, 1200)] },
  };
}

const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const inWords = (n: number) => WORDS[n] ?? String(n);

export default async function SetPage({ params }: Props) {
  const set = getRoomSet((await params).handle);
  if (!set) notFound();
  const product = await getProduct(set.handle);
  if (!product) notFound();

  const catalogue = await getProductsByHandles([...set.pieces.map((p) => p.handle), ...addOnsForSet(set.handle).map((a) => a.handle)]);
  const offer = setOffer(set, [product, ...catalogue]);
  const addOns: SetAddOn[] = addOnsForSet(set.handle).flatMap((addOn) => {
    const p = catalogue.find((x) => x.handle === addOn.handle);
    return p ? [{ addOn, product: p }] : [];
  });

  // Each piece's own price and page.
  const singleOf = (handle: string, soldAs?: string) => {
    const v = catalogue.find((x) => x.handle === handle)?.variants[0];
    return v ? { price: v.availableForSale ? formatMoney(v.price) : null, soldAs, href: `/products/${handle}` } : undefined;
  };

  const variant = defaultVariant(product);
  const price = formatMoney(variant.price);
  const copy = preorderCopy();
  const comingSoon = set.status === 'coming-soon' || !variant.availableForSale;
  const devPrice = product.source === 'development';
  const others = ROOM_SETS.filter((s) => s.handle !== set.handle);
  const items = itemCount(set);
  const boxPieces: BoxPiece[] = set.pieces.map((p) => ({
    handle: p.handle,
    name: p.name,
    qty: p.qty,
    what: p.what,
    note: p.note,
    short: p.short,
    details: p.details,
    photos: piecePhotos(p).map((ph, i) => ({ src: photoUrl(ph.id, i === 0 ? 1600 : 900), alt: ph.alt, sample: !ph.id.startsWith('/') })),
    single: singleOf(p.handle, p.soldAs),
  }));

  return (
    <article className={`world world--${set.theme}`}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: set.title,
          description: product.description,
          image: [setPhoto(set.hero, 1600)],
          brand: { '@type': 'Brand', name: siteConfig.name },
          url: `${SITE_URL}/sets/${set.handle}`,
          ...(comingSoon
            ? {}
            : {
                offers: {
                  '@type': 'Offer',
                  price: (variant.price.amount / 100).toFixed(2),
                  priceCurrency: variant.price.currencyCode,
                  availability: 'https://schema.org/PreOrder',
                },
              }),
        }}
      />

      {/* Arrival: the place, full screen. */}
      <header className="world-hero" data-world-hero>
        <Media src={setPhoto(set.hero, 2400)} alt={set.hero.alt} ratio="fill" priority sizes="100vw" focus={set.hero.focus} className="world-hero__img world-hero__img--wide" />
        <Media src={setPhoto(set.heroTall, 1200)} alt={set.heroTall.alt} ratio="fill" priority sizes="100vw" className="world-hero__img world-hero__img--tall" />
        <div className="container world-hero__top">
          <LocalTime timeZone={set.timeZone} place={set.place} className="world-hero__time" />
          <span className="world-hero__native" lang={set.native.lang} dir={set.native.dir}>
            {set.native.text}
          </span>
        </div>
        <div className="container world-hero__body">
          <p className="world-hero__kicker">A room set from {set.place}</p>
          <h1 className="display world-hero__title">{set.title}</h1>
          <p className="world-hero__moment">{set.moment}</p>
          <div className="world-hero__actions">
            <a href="#order" className="button button--light">
              {comingSoon ? 'Hear when it opens' : `${copy.cta}, ${price}`}
            </a>
            <a href="#box" className="hero-link">
              See what’s in the box <Icon name="arrow-down" size={16} />
            </a>
          </div>
        </div>
        {!comingSoon && <p className="world-hero__season">{copy.line}</p>}
      </header>

      {/* What arrives: every piece, large. */}
      <section id="box" className="world-box" aria-labelledby="box-title">
        <div className="container">
          <header className="world-box__head">
            <h2 id="box-title" className="display-2">
              What’s in the box
            </h2>
            <p className="world-box__sum">
              {inWords(set.pieces.length).replace(/^./, (c) => c.toUpperCase())} pieces, {inWords(items)} things in all, packed together in one box.
            </p>
          </header>
          {set.boxHero && (
            <figure className="world-box__hero">
              <Media src={setPhoto(set.boxHero, 2400)} alt={set.boxHero.alt} ratio="16 / 9" sizes="(min-width: 1280px) 1200px, 100vw" />
            </figure>
          )}
          <BoxContents
            pieces={boxPieces}
            listTitle={`One box, ${inWords(items)} things`}
            footer={
              <>
                {comingSoon ? (
                  <strong>Opening in the new year</strong>
                ) : (
                  <strong>{price}</strong>
                )}
                The whole set: every piece above, packed together in one box.
                {offer && offer.saving > 0 && !comingSoon && (
                  <span className="box-list__saving">
                    {formatMoney(offer.separately)} bought separately. You save {formatMoney(offer.saving)}.
                  </span>
                )}
                <a href="#order">{comingSoon ? 'Hear when it opens' : copy.cta}</a>
                <Link href="/shop" className="box-list__alt">
                  Or buy single pieces
                </Link>
              </>
            }
          />
          {set.contents && (
            <figure className="world-box__all">
              <Media src={setPhoto(set.contents, 2400)} alt={set.contents.alt} ratio="16 / 9" sizes="(min-width: 1280px) 1200px, 100vw" />
              <figcaption>Everything in the set, together.</figcaption>
            </figure>
          )}
          <div className="world-box__palette">
            <p>The colours of the set</p>
            <ul>
              {set.palette.map((s) => (
                <li key={s.name}>
                  <span className="world-box__chip" style={{ background: s.hex }} aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Add-ons: bigger pieces that go with the set, delivered on their own. */}
      {!comingSoon &&
        addOns.map(({ addOn, product: p }) => (
          <section key={addOn.handle} id={`addon-${addOn.handle}`} className="world-addon" aria-labelledby={`addon-title-${addOn.handle}`}>
            <div className="container world-addon__inner">
              <div className="world-addon__media">
                <Media src={addOn.photo.src} alt={addOn.photo.alt} ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
              <div className="world-addon__body">
                <p className="world-addon__kicker">Optional add-on</p>
                <h2 id={`addon-title-${addOn.handle}`} className="display-2">
                  {addOn.title}
                </h2>
                <p className="world-addon__what">{addOn.what}</p>
                <p className="world-addon__note">{addOn.note}</p>
                <p className="world-addon__price">
                  <strong>{formatMoney(addOn.withSetPrice)}</strong> with the set <span>({formatMoney(addOn.price)} on its own)</span>
                </p>
                <dl className="world-addon__details">
                  {addOn.details.map((d) => (
                    <div key={d.label}>
                      <dt>{d.label}</dt>
                      <dd>{d.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="world-addon__delivery">{addOn.delivery}</p>
                <div className="world-addon__actions">
                  <a href={`#add-${addOn.handle}`} className="button button--accent">
                    Add it to the set order
                  </a>
                  <Link href={`/products/${p.handle}`} className="arrow-link">
                    More about the {addOn.title} <Icon name="arrow-right" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* Where the idea comes from. */}
      <section className="container world-story" aria-labelledby="story-title">
        <h2 id="story-title" className="display-2 world-story__title">
          Where it comes from
        </h2>
        <StoryBeats beats={set.beats} />
      </section>

      {/* The ritual: how to use it, and how it sits. */}
      <section id="guide" className="container world-ritual" aria-labelledby="guide-title">
        <div className="world-ritual__steps">
          <h2 id="guide-title" className="display-2">
            {set.guide.heading}
          </h2>
          <ol>
            {set.guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="world-ritual__plan">
          <p className="world-ritual__label">Laid out</p>
          <SetPlan set={set} />
        </div>
      </section>

      {/* Order. */}
      <section id="order" className="world-order" aria-labelledby="order-title">
        <div className="container world-order__inner">
          <div className="world-order__media">
            <Media src={setPhoto(set.hero, 1600)} alt={set.hero.alt} ratio="4 / 5" sizes="(min-width: 1024px) 45vw, 100vw" focus={set.hero.focus} />
          </div>
          <div className="world-order__body">
            <p className="world-order__kicker">{comingSoon ? 'Opening soon' : copy.short}</p>
            <h2 id="order-title" className="display-2">
              {set.title}
            </h2>
            <p className="world-order__moment">{set.kicker}</p>
            {comingSoon ? (
              <div className="world-order__soon">
                <p>{set.statusNote}</p>
                <NewsletterForm source={`set-${set.handle}`} />
              </div>
            ) : (
              <>
                <SetBuy product={product} cta={copy.cta} line={copy.line} offer={offer} addOns={addOns} devPrice={devPrice} />
                {copy.batch && (
                  <p className="world-order__how">
                    Every set in the {copy.batch.name} batch is packed in one box and posted by {formatDay(copy.batch.shipsBy)}.{' '}
                    <Link href="/help/faqs">How pre-orders work</Link>
                  </p>
                )}
              </>
            )}
            <dl className="world-order__facts">
              {set.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Elsewhere: the other places. */}
      <nav className="world-others" aria-label="Other room sets">
        {others.map((o) => (
          <Link key={o.handle} href={`/sets/${o.handle}`} className={`door door--${o.theme}`}>
            <Media src={setPhoto(o.heroTall, 1200)} alt="" ratio="fill" sizes="(min-width: 900px) 50vw, 100vw" className="door__img" />
            <span className="door__label">
              <span className="door__place">{o.place}</span>
              <span className="door__title">{o.title}</span>
              <span className="door__moment">{o.moment}</span>
              <span className="door__go">
                {o.status === 'coming-soon' ? 'Opening soon' : 'Step inside'} <Icon name="arrow-right" size={16} />
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <StickyOrder title={set.title}>
        {comingSoon ? (
          <a href="#order" className="button button--accent">
            Hear when it opens
          </a>
        ) : (
          <SetBuy product={product} cta={copy.cta} line={copy.line} compact />
        )}
      </StickyOrder>
    </article>
  );
}
