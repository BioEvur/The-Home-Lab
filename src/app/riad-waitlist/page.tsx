import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { SITE_URL } from '@/lib/config/site';
import { RIAD } from '@/lib/content/landings';
import { PRODUCT_PHOTOS, photoUrl } from '@/lib/content/media';
import { getRoomSet, itemCount, ROOM_SETS, setPhoto } from '@/lib/content/sets';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { LandingFaq } from '@/components/landing/LandingFaq';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export const revalidate = 3600;

const HANDLE = 'riad-corner';

export const metadata: Metadata = {
  title: 'Riad Corner: join the list for the Moroccan tea corner set',
  description:
    'A Moroccan riad corner in one box: a hand-knotted rag rug, a wool pouf, a brass tray, a teapot, six painted tea glasses and a pierced lantern. Opening in the new year; join the list to hear first.',
  alternates: { canonical: '/riad-waitlist' },
  openGraph: {
    title: 'Riad Corner, first look',
    url: `${SITE_URL}/riad-waitlist`,
    images: [{ url: '/images/landing/og-riad-waitlist.jpg', width: 1200, height: 630, alt: 'A Moroccan zellige tile pattern around an arch' }],
  },
};

export default async function RiadWaitlistPage() {
  const set = getRoomSet(HANDLE)!;
  const products = await getProducts();
  const open = ROOM_SETS.filter((s) => s.status !== 'coming-soon' && products.find((p) => p.handle === s.handle)?.variants[0]?.availableForSale);
  const faqs = [...(set.seo?.faqs ?? []), { q: 'Will joining the list cost anything?', a: 'No. It is our email list: we tell you when Riad Corner opens, and the last day to order in each batch. You can unsubscribe at any time.' }];

  return (
    <div className="lp lp-riad">
      {/* Header: a drawn zellige wall with an arched window onto the riad. */}
      <header className="lp-riad-hero">
        <div className="container lp-riad-hero__inner">
          <div className="lp-riad-hero__arch">
            <Media src={setPhoto(set.heroTall, 1200)} alt={set.heroTall.alt} ratio="fill" priority sizes="(min-width: 1024px) 34vw, 80vw" />
          </div>
          <div className="lp-riad-hero__card">
            <p className="lp-riad-hero__native" lang={set.native.lang} dir={set.native.dir}>
              {set.native.text}
            </p>
            <p className="lp-kicker">{set.place} · opening in the new year</p>
            <h1 className="display-2 lp-riad-hero__title">A riad corner, coming in the new year.</h1>
            <p className="lp-riad-hero__lede">
              {set.kicker} A rug, a pouf, a tea tray, a teapot, six glasses and a lantern: {itemCount(set)} things, made by hand in Morocco, in one box. Join the list
              and we will tell you the day it opens.
            </p>
            <div className="lp-riad-hero__form">
              <NewsletterForm tone="dark" source="riad-waitlist" />
            </div>
          </div>
        </div>
      </header>

      {/* What will be in the box. */}
      <section className="container lp-riad-box" aria-labelledby="riad-box-title">
        <header className="lp-head">
          <h2 id="riad-box-title" className="display-2">
            What will be in the box
          </h2>
          <p>Everything for a low seating corner, about 150 × 200 cm of floor: push the rug into a corner or under a window and build from there.</p>
        </header>
        <ul className="lp-riad-box__list">
          {set.pieces.map((p) => {
            const photo = PRODUCT_PHOTOS[p.handle]?.[0];
            return (
              <li key={p.handle} className="lp-riad-piece">
                <div className="lp-riad-piece__arch">{photo && <Media src={photoUrl(photo.id, 800)} alt={photo.alt} ratio="fill" sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" />}</div>
                <h3>{p.name}</h3>
                <p>{p.what}</p>
              </li>
            );
          })}
        </ul>
        <p className="lp-riad-box__note">Photos are stand-ins of similar pieces until our own photography of the set is ready.</p>
      </section>

      {/* Why it takes longer. */}
      <section className="lp-riad-made" aria-labelledby="made-title">
        <div className="container lp-riad-made__inner">
          <div>
            <h2 id="made-title" className="display-2">
              Why it takes longer
            </h2>
            <p className="lp-riad-made__lede">
              Every piece is knotted, woven, engraved, painted or pierced by hand in Morocco, so they arrive in small numbers and no two are quite the same. We
              would rather open the set once we have them than promise a date we cannot keep.
            </p>
          </div>
          <ul className="lp-riad-made__list">
            {RIAD.handmade.map((m) => (
              <li key={m.title}>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mint tea. */}
      <section className="container lp-riad-tea" aria-labelledby="tea-title">
        <div className="lp-riad-tea__media">
          <Media src={setPhoto(set.beats[1].photo, 1200)} alt={set.beats[1].photo.alt} ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="lp-riad-tea__body">
          <h2 id="tea-title" className="display-2">
            Mint tea, the riad way
          </h2>
          <p>{set.beats[1].text}</p>
          <ol className="lp-riad-tea__steps">
            {RIAD.tea.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Second sign-up. */}
      <section className="lp-riad-join" aria-labelledby="join-title">
        <div className="container lp-riad-join__inner">
          <h2 id="join-title" className="display-2">
            Be first to hear.
          </h2>
          <NewsletterForm tone="dark" source="riad-waitlist" />
        </div>
      </section>

      <LandingFaq id="riad-faq" faqs={faqs} />

      {open.length > 0 && (
        <section className="container lp-riad-now" aria-labelledby="now-title">
          <h2 id="now-title" className="lp-riad-now__title">
            Open now
          </h2>
          <ul>
            {open.map((s) => (
              <li key={s.handle}>
                <Link href={`/sets/${s.handle}`}>
                  <span>{s.title}</span>
                  <span>{s.moment}</span>
                  <Icon name="arrow-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/preorders" className="arrow-link">
            How pre-orders work <Icon name="arrow-right" size={16} />
          </Link>
        </section>
      )}
    </div>
  );
}
