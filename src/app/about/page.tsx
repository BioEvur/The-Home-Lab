import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { setOffer } from '@/lib/catalog/offers';
import { ADD_ONS } from '@/lib/content/addons';
import { formatDay, preorderCopy } from '@/lib/content/batches';
import { ROOM_SETS, itemCount, setPhoto } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { LocalTime } from '@/components/sets/LocalTime';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About',
  description: 'The Home Lab makes room sets: a corner of a real place, with every piece it needs, packed in one box. Every piece is also sold on its own.',
  alternates: { canonical: '/about' },
};

const PRINCIPLES = [
  ['One place, one moment', 'Each set starts somewhere real and recreates one part of the day there: a morning coffee in Kyoto, an evening drink in a Milan apartment, mint tea in Marrakech.'],
  ['Every piece has a job', 'Nothing goes in the box for decoration alone. Each set page says what every piece is, what it is for and how big it is.'],
  ['Chosen for style', 'Hand-painted ceramics, mouth-blown glass, brass and wood: pieces with some character, chosen to look right together.'],
  ['Plain information', 'Sizes, materials and care are written out in full. Where we do not know something yet, the page says so.'],
] as const;

export default async function AboutPage() {
  const products = await getProducts();
  const copy = preorderCopy();
  const pieceCount = ROOM_SETS.reduce((n, s) => n + s.pieces.length, 0);

  return (
    <div className="about">
      {/* What we do, in one look. */}
      <header className="container about-head">
        <p className="about-head__kicker">About The Home Lab</p>
        <h1 className="display about-head__title">We bring places home.</h1>
        <div className="about-head__body">
          <p className="about-head__lede">
            The Home Lab makes room sets. Each set recreates a corner of a real place, a coffee house in Kyoto, a drinks corner in a Milan apartment, a tea
            corner in Marrakech, and puts every piece it needs into one box.
          </p>
          <dl className="about-facts">
            <div>
              <dt>Room sets</dt>
              <dd>{ROOM_SETS.length}</dd>
            </div>
            <div>
              <dt>Pieces, each also sold on its own</dt>
              <dd>{pieceCount}</dd>
            </div>
            <div>
              <dt>Boxes per set</dt>
              <dd>1</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* The three places, each in its own colours. */}
      <section className="about-sets" aria-labelledby="about-sets-title">
        <h2 id="about-sets-title" className="visually-hidden">
          The three room sets
        </h2>
        <ul className="about-sets__list">
          {ROOM_SETS.map((set) => {
            const offer = setOffer(set, products);
            const soon = set.status === 'coming-soon';
            return (
              <li key={set.handle} className={`about-set world world--${set.theme}`}>
                <div className="about-set__media">
                  <Media src={setPhoto(set.heroTall, 1000)} alt={set.heroTall.alt} ratio="fill" sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
                <div className="about-set__body">
                  <LocalTime timeZone={set.timeZone} place={set.place} className="about-set__time" />
                  <h3 className="about-set__title">{set.title}</h3>
                  <p className="about-set__moment">{set.moment}</p>
                  <ul className="about-set__pieces">
                    {set.pieces.map((p) => (
                      <li key={p.handle}>
                        <Link href={`/products/${p.handle}`}>
                          {p.qty > 1 ? `${p.qty} × ` : ''}
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="about-set__price">
                    {soon || !offer ? (
                      'Opening in the new year'
                    ) : (
                      <>
                        <strong>{formatMoney(offer.setPrice)}</strong> for {itemCount(set)} things in one box
                        {offer.saving > 0 && <span>Save {formatMoney(offer.saving)} against buying the pieces separately</span>}
                      </>
                    )}
                  </p>
                  <Link href={`/sets/${set.handle}`} className="about-set__go">
                    Step inside <Icon name="arrow-right" size={16} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Why sets. */}
      <section className="container about-why" aria-labelledby="why-title">
        <h2 id="why-title" className="display-2">
          Why sets
        </h2>
        <div className="about-why__text">
          <p>
            Most of us have sat in a room somewhere and wished we could take it home. Buying the pieces one by one rarely gets you there: they come from
            different shops, in different sizes, and never quite go together.
          </p>
          <p>
            A set is that corner, already worked out: the pieces, how they sit together and how to use them. Each set page shows every piece, explains what
            it is, and shows how the set is laid out.
          </p>
          <p>
            If you only want one piece, every piece is also sold on its own in the <Link href="/shop">shop</Link>. Buying the whole set always costs less.
          </p>
        </div>
      </section>

      {/* How ordering works: facts only. */}
      <section className="about-how" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="display-2">
            How ordering works
          </h2>
          <dl className="about-how__list">
            <div>
              <dt>Pre-orders in batches</dt>
              <dd>
                {copy.batch
                  ? `Sets are packed by hand in batches. Christmas orders close on ${formatDay(copy.batch.ordersClose)} and the batch ships by ${formatDay(copy.batch.shipsBy)}.`
                  : 'Sets are packed by hand in batches. The date each batch ships by is shown before you order.'}
              </dd>
            </div>
            <div>
              <dt>One box per set</dt>
              <dd>Every piece in a set is packed together and arrives in one box.</dd>
            </div>
            <div>
              <dt>Single pieces</dt>
              <dd>Pieces bought on their own go out with the same batch as the sets.</dd>
            </div>
            {ADD_ONS.length > 0 && (
              <div>
                <dt>Add-ons</dt>
                <dd>
                  Larger pieces, such as the {ADD_ONS[0].title}, are delivered separately by courier and cost less when ordered with a set. They arrive by the same
                  ship-by date as the rest of your order.
                </dd>
              </div>
            )}
          </dl>
          <Link href="/help/faqs" className="arrow-link">
            Questions about pre-orders <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      {/* What we look for. */}
      <section className="container about-principles" aria-labelledby="principles-title">
        <h2 id="principles-title" className="display-2">
          What we look for
        </h2>
        <dl>
          {PRINCIPLES.map(([t, b]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{b}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container about-contact" aria-labelledby="contact-title">
        <h2 id="contact-title" className="about-contact__title">
          Something we have not answered?
        </h2>
        <Link href="/contact" className="button button--accent">
          Send us a message
        </Link>
      </section>
    </div>
  );
}
