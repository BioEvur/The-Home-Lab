import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { setOffer } from '@/lib/catalog/offers';
import { ADD_ONS } from '@/lib/content/addons';
import { formatDay, preorderCopy } from '@/lib/content/batches';
import { photoUrl } from '@/lib/content/media';
import { ROOM_SETS, piecePhoto, setPhoto, theTitle } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { LocalTime } from '@/components/sets/LocalTime';
import { PieceCard } from '@/components/shop/PieceCard';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/ui/Reveal';
import { PostCard } from '@/components/journal/PostCard';
import { ALL_POSTS } from '@/lib/content/journal';
import { homeFaqs } from '@/lib/content/home';

// Rebuilt hourly so the batch dates move on by themselves.
export const revalidate = 3600;

export default async function HomePage() {
  const products = await getProducts();
  const priceOf = (handle: string) => {
    const p = products.find((x) => x.handle === handle);
    return p ? formatMoney(p.variants[0].price) : null;
  };
  const copy = preorderCopy();
  const faqs = homeFaqs();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.name,
          url: SITE_URL,
        }}
      />

      {/* Three doors, one for each place. */}
      <section className="home-doors" aria-labelledby="hero-title">
        <div className="container home-doors__head">
          <h1 id="hero-title" className="display home-doors__title">
            Bring a place home.
          </h1>
          <p className="home-doors__lede">Rooms from places around the world, with more on the way. Each set arrives in one box, with every piece it needs. Choose where you would like to be.</p>
        </div>
        <ul className="home-doors__list">
          {ROOM_SETS.map((set, i) => (
            <li key={set.handle} className={`home-door home-door--${set.theme}`}>
              <Link href={`/sets/${set.handle}`} className="home-door__link">
                <Media src={setPhoto(set.heroTall, 1400)} alt={set.heroTall.alt} ratio="fill" priority={i < 2} sizes="(min-width: 900px) 40vw, 100vw" className="home-door__img" />
                <span className="home-door__label">
                  <LocalTime timeZone={set.timeZone} place={set.place} className="home-door__time" />
                  <span className="home-door__native" lang={set.native.lang} dir={set.native.dir}>
                    {set.native.text}
                  </span>
                  <span className="home-door__title">{set.title}</span>
                  <span className="home-door__moment">{set.moment}</span>
                  <span className="home-door__go">
                    {set.status === 'coming-soon' ? 'Opening in the new year' : 'Step inside'} <Icon name="arrow-right" size={16} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* The season. */}
      {copy.batch && (
        <section className="home-season" aria-labelledby="season-title">
          <div className="container home-season__inner">
            <h2 id="season-title" className="display-2">
              Pre-order your Christmas pieces now.
            </h2>
            <div className="home-season__text">
              <p>{copy.line}</p>
              <p className="home-season__small">Christmas sets are packed by hand and sent together, one box for each set.</p>
            </div>
          </div>
        </section>
      )}

      {/* Postcards: each set in its own colours. */}
      {ROOM_SETS.map((set, i) => (
        <section key={set.handle} className={`postcard world world--${set.theme} ${i % 2 ? 'postcard--flip' : ''}`} aria-labelledby={`pc-${set.handle}`}>
          <div className="postcard__media">
            <Media src={setPhoto(set.beats[1].photo, 1600)} alt={set.beats[1].photo.alt} ratio="fill" sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div className="postcard__body">
            <Reveal>
              <p className="postcard__place">
                <LocalTime timeZone={set.timeZone} place={set.place} />
              </p>
              <h2 id={`pc-${set.handle}`} className="display-2 postcard__title">
                {set.title}
              </h2>
              <p className="postcard__story">{set.beats[0].text}</p>
            </Reveal>
            <ul className="postcard__pieces" aria-label={`In ${theTitle(set.title)} box`}>
              {set.pieces.map((p) => {
                const photo = piecePhoto(p);
                return (
                  <li key={p.handle}>
                    {photo && <Media src={photoUrl(photo.id, 300)} alt="" ratio="1 / 1" sizes="72px" />}
                    <span>
                      {p.name}
                      {p.qty > 1 ? ` × ${p.qty}` : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="postcard__foot">
              {set.status === 'coming-soon' ? (
                <p className="postcard__price">Opening in the new year</p>
              ) : (
                priceOf(set.handle) && (
                  <p className="postcard__price">
                    {priceOf(set.handle)} <span>the whole set</span>
                  </p>
                )
              )}
              <Link href={`/sets/${set.handle}`} className="button button--accent">
                {set.status === 'coming-soon' ? 'See what’s in it' : 'Step inside'}
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Every piece on its own, and the add-ons. */}
      <section className="home-shop" aria-labelledby="home-shop-title">
        <div className="container home-shop__head">
          <div>
            <h2 id="home-shop-title" className="display-2">
              Shop every piece
            </h2>
            <p className="home-shop__lede">
              Every piece in the sets is also sold on its own. Buying the whole set is always cheaper:{' '}
              {ROOM_SETS.filter((s) => s.status !== 'coming-soon')
                .map((s) => {
                  const offer = setOffer(s, products);
                  return offer ? `${theTitle(s.title)} set saves you ${formatMoney(offer.saving)}` : null;
                })
                .filter(Boolean)
                .join(' and ')}
              .
            </p>
          </div>
          <Link href="/shop" className="arrow-link">
            See every piece <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <ul className="home-shop__row container">
          {[
            ...ADD_ONS.map((a) => ({ handle: a.handle, soldAs: undefined, line: `${formatMoney(a.withSetPrice)} with a room set` })),
            ...ROOM_SETS.flatMap((s) => s.pieces.map((p) => ({ handle: p.handle, soldAs: p.soldAs, line: `From ${s.title}` }))),
          ].map((item) => {
            const product = products.find((p) => p.handle === item.handle);
            return product ? (
              <li key={item.handle}>
                <PieceCard product={product} soldAs={item.soldAs} line={item.line} sizes="(min-width: 1024px) 20vw, 60vw" />
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {/* How it works. */}
      <section className="home-how" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="display-2 home-how__title">
            How it works
          </h2>
          <ol className="home-how__steps">
            <li>
              <h3>Choose a place</h3>
              <p>Each set recreates one corner of a real place: a Japanese coffee counter, a Milan drinks console, a Moroccan tea corner. The set page lists every piece, its size and what it is for.</p>
            </li>
            <li>
              <h3>We pack it in one box</h3>
              <p>Sets are ordered in batches. When a batch closes, we gather every piece for your set, check it and pack it together, so nothing arrives in bits from different shops.</p>
            </li>
            <li>
              <h3>It arrives ready to use</h3>
              <p>
                {copy.batch
                  ? `Christmas orders placed by ${formatDay(copy.batch.ordersClose)} are posted by ${formatDay(copy.batch.shipsBy)}, anywhere in the Republic of Ireland.`
                  : 'The date your batch ships by is shown before you pay. We deliver anywhere in the Republic of Ireland.'}{' '}
                Unpack it, follow the guide on the set page, and the corner is done.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Gifts. */}
      <section className="home-gifts" aria-labelledby="gifts-title">
        <div className="container home-gifts__inner">
          <div>
            <h2 id="gifts-title" className="display-2">
              A Christmas gift that arrives complete
            </h2>
            <p className="home-gifts__lede">
              A set is a whole gift in one box: a coffee ritual for the person who queues for flat whites, a drinks corner for the one who always hosts. Posted
              from Ireland, so there are no customs charges on delivery.
            </p>
          </div>
          <ul className="home-gifts__list">
            <li>
              <Link href="/gifts#coffee">For coffee lovers</Link>
            </li>
            <li>
              <Link href="/gifts#hosts">For hosts and cocktail fans</Link>
            </li>
            <li>
              <Link href="/gifts#new-home">For a new home</Link>
            </li>
            <li>
              <Link href="/gifts#under-50">Gifts under €50</Link>
            </li>
          </ul>
          <Link href="/gifts" className="button button--accent home-gifts__cta">
            See the Christmas gift guide
          </Link>
        </div>
      </section>

      {/* Journal. */}
      {ALL_POSTS.length > 0 && (
        <section className="home-journal" aria-labelledby="home-journal-title">
          <div className="container">
            <div className="home-journal__head">
              <h2 id="home-journal-title" className="display-2">
                From the Journal
              </h2>
              <Link href="/journal" className="arrow-link">
                All guides <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <ul className="journal-grid">
              {ALL_POSTS.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Questions. */}
      <section className="container home-faq" aria-labelledby="home-faq-title">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }}
        />
        <h2 id="home-faq-title" className="display-2">
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
      </section>

      {/* Why sets, in a sentence. */}
      <section className="container home-why" aria-labelledby="why-title">
        <h2 id="why-title" className="visually-hidden">
          Why room sets
        </h2>
        <p className="home-why__text">
          You could hunt down every piece yourself. A set saves you the hunting: one place, one way of living, and the pieces chosen to work together from the
          first morning.
        </p>
        <Link href="/about" className="arrow-link">
          About The Home Lab <Icon name="arrow-right" size={16} />
        </Link>
      </section>
    </>
  );
}
