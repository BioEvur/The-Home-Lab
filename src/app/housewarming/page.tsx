import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import type { Product } from '@/lib/catalog/types';
import { setOffer } from '@/lib/catalog/offers';
import { defaultVariant } from '@/lib/catalog/variants';
import { SITE_URL } from '@/lib/config/site';
import { getPost } from '@/lib/content/journal';
import { HOME_ROOMS } from '@/lib/content/landings';
import { PRODUCT_PHOTOS, photoUrl } from '@/lib/content/media';
import { preorderPage } from '@/lib/content/preorders';
import { ROOM_SETS } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { AddToBasket } from '@/components/landing/AddToBasket';
import { COMMON_FAQS, LandingFaq } from '@/components/landing/LandingFaq';
import { SetBuy } from '@/components/sets/SetBuy';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Housewarming gifts in Ireland: lamps, mirrors and first-home pieces',
  description:
    'Housewarming gifts that will still be out on display in a year: a travertine lamp, a wavy mirror, a pour-over coffee set and more, delivered anywhere in the Republic of Ireland.',
  alternates: { canonical: '/housewarming' },
  openGraph: {
    title: 'For a first home',
    url: `${SITE_URL}/housewarming`,
    images: [{ url: '/images/landing/og-housewarming.jpg', width: 1200, height: 630, alt: 'A wavy pine mirror above a marble console' }],
  },
};

export default async function HousewarmingPage() {
  const page = preorderPage();
  const products = await getProducts();
  const productOf = (handle: string) => products.find((p) => p.handle === handle);
  const available = (p?: Product): p is Product => Boolean(p?.variants[0]?.availableForSale);
  const openSets = ROOM_SETS.filter((s) => s.status !== 'coming-soon' && available(productOf(s.handle)));
  const guide = getPost('housewarming-gifts-ireland');

  const faqs = [
    ...(page.christmasAnswer ? [{ q: 'Will it arrive before Christmas?', a: page.christmasAnswer }] : []),
    {
      q: 'I do not know their style. Is that a problem?',
      a: 'The pieces are in warm, quiet colours that sit well in most homes: travertine, pine, amber glass and acacia. If it is not right, there are 14 days after delivery to send it back.',
    },
    ...COMMON_FAQS,
  ];

  return (
    <div className="lp lp-home">
      {/* Header: the words on the left, the photo cut into a house on the right. */}
      <header className="container lp-home-hero">
        <div className="lp-home-hero__text">
          <p className="lp-kicker lp-kicker--clay">Housewarming gifts, delivered in Ireland</p>
          <h1 className="display-2 lp-home-hero__title">Their first home needs a few first things.</h1>
          <p className="lp-home-hero__lede">
            The lamp for the corner with no light. The mirror for the bare wall in the hall. The first proper coffee on the first Saturday morning. Gifts that
            will still be out on display in a year.
          </p>
          <div className="lp-home-hero__actions">
            <a href="#rooms" className="button button--accent">
              Gifts room by room
            </a>
            <a href="#sets" className="arrow-link">
              Or the whole corner <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <p className="lp-home-hero__date">{page.line}</p>
        </div>
        <div className="lp-home-hero__house">
          <div className="lp-home-hero__shape">
            <Media src="/images/sets/milanese/mirror.jpg" alt="A wavy pine mirror above a marble console with a glass vase and a candle holder" ratio="fill" priority sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
          <span className="lp-home-hero__tag" aria-hidden="true">
            New home
          </span>
        </div>
      </header>

      {/* Room by room. */}
      <section id="rooms" className="lp-home-rooms" aria-labelledby="rooms-title">
        <div className="container">
          <header className="lp-head">
            <h2 id="rooms-title" className="display-2">
              Room by room
            </h2>
            <p>Three corners every new home has, and the pieces that finish them. Each one is sold on its own.</p>
          </header>
        </div>
        {HOME_ROOMS.map((room, i) => (
          <article key={room.id} id={room.id} className={`container lp-room ${i % 2 ? 'lp-room--flip' : ''}`} aria-labelledby={`room-${room.id}`}>
            <div className="lp-room__media">
              <Media src={room.image.src} alt={room.image.alt} ratio="4 / 3" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="lp-room__body">
              <p className="lp-room__count">Room {i + 1} of {HOME_ROOMS.length}</p>
              <h3 id={`room-${room.id}`} className="lp-room__title">
                {room.title}
              </h3>
              <p className="lp-room__text">{room.text}</p>
              <ul className="lp-room__pieces">
                {room.pieces.map((h) => {
                  const p = productOf(h);
                  if (!available(p)) return null;
                  const photo = PRODUCT_PHOTOS[h]?.[0];
                  return (
                    <li key={h}>
                      <Link href={`/products/${h}`} className="lp-room__thumb" tabIndex={-1} aria-hidden="true">
                        {photo && <Media src={photoUrl(photo.id, 300)} alt="" ratio="1 / 1" sizes="72px" />}
                      </Link>
                      <span className="lp-room__name">
                        <Link href={`/products/${h}`}>{p.title}</Link>
                        <span>{formatMoney(defaultVariant(p).price)}</span>
                      </span>
                      <AddToBasket product={p} label="Add" />
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* The whole corner. */}
      <section id="sets" className="container lp-home-sets" aria-labelledby="sets-title">
        <header className="lp-head">
          <h2 id="sets-title" className="display-2">
            Or the whole corner
          </h2>
          <p>For a bigger gift from a few of you together: every piece a corner needs, in one box, for less than the pieces cost one by one.</p>
        </header>
        <ul className="lp-home-sets__list">
          {openSets.map((set) => {
            const product = productOf(set.handle)!;
            const offer = setOffer(set, products);
            const photo = PRODUCT_PHOTOS[set.handle]?.[0] ?? set.heroTall;
            return (
              <li key={set.handle} className="lp-home-set">
                <Media src={photoUrl(photo.id, 1200)} alt={photo.alt} ratio="3 / 2" sizes="(min-width: 900px) 45vw, 100vw" />
                <div className="lp-home-set__body">
                  <h3>
                    <Link href={`/sets/${set.handle}`}>{set.title}</Link>
                  </h3>
                  <p>{set.kicker}</p>
                  <p className="lp-home-set__price">
                    {formatMoney(defaultVariant(product).price)}
                    {offer && offer.saving > 0 && <span> · saves {formatMoney(offer.saving)} on the pieces</span>}
                  </p>
                  <SetBuy product={product} cta={page.cta} line={page.line} compact />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Sending it. */}
      <section className="lp-home-send" aria-labelledby="send-title">
        <div className="container">
          <h2 id="send-title" className="display-2">
            Sending it to their new address
          </h2>
          <ol className="lp-home-send__steps">
            <li>
              <span className="lp-home-send__icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="48" height="48">
                  <path d="M6 22 24 8l18 14v18H6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M19 40V28h10v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <h3>Their address at checkout</h3>
              <p>Put their name and new address in the delivery address. Anywhere in the Republic of Ireland.</p>
            </li>
            <li>
              <span className="lp-home-send__icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="48" height="48">
                  <path d="M8 16 24 8l16 8v18l-16 8-16-8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 16l16 8 16-8M24 24v18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <h3>Your email for tracking</h3>
              <p>Keep your own email address at checkout, so the tracking and updates come to you and the surprise stays a surprise.</p>
            </li>
            <li>
              <span className="lp-home-send__icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="48" height="48">
                  <circle cx="16" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 24h18M36 24v6M41 24v4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <h3>Posted by {page.dates.postedBy}</h3>
              <p>Sent from Ireland, so there is nothing for them to pay at the door. It usually arrives 1 to 3 working days after posting.</p>
            </li>
          </ol>
        </div>
      </section>

      <LandingFaq id="home-faq" faqs={faqs} />

      {guide && (
        <section className="container lp-home-guide" aria-labelledby="home-guide">
          <h2 id="home-guide" className="visually-hidden">
            From the Journal
          </h2>
          <Link href={`/journal/${guide.slug}`} className="lp-home-guide__link">
            <span className="lp-kicker lp-kicker--clay">From the Journal</span>
            <span className="lp-home-guide__title">{guide.title}</span>
            <Icon name="arrow-right" size={20} />
          </Link>
        </section>
      )}
    </div>
  );
}
