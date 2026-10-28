import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import { setOffer } from '@/lib/catalog/offers';
import { ADD_ONS } from '@/lib/content/addons';
import { preorderCopy } from '@/lib/content/batches';
import { ROOM_SETS, setPhoto, theTitle } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { PieceCard } from '@/components/shop/PieceCard';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Shop every piece',
  description: 'Every piece from the Kyoto Kissaten, The Milanese and Riad Corner sets, on its own or as a set. Each set costs less than its pieces bought one by one.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const products = await getProducts();
  const byHandle = (h: string) => products.find((p) => p.handle === h);
  const copy = preorderCopy();

  return (
    <div className="shop">
      <header className="container shop-head">
        <h1 className="display-2">Shop every piece</h1>
        <p className="shop-head__lede">
          Every piece from our three room sets, sold on its own. If you want the whole corner, buy it as a set: each set costs less than its pieces bought
          one by one.
        </p>
        {copy.batch && <p className="shop-head__batch">{copy.line}</p>}
      </header>

      {/* The sets, with what they save. */}
      <section className="container shop-sets" aria-labelledby="shop-sets-title">
        <h2 id="shop-sets-title" className="shop-section__title">
          Room sets
        </h2>
        <ul className="shop-sets__list">
          {ROOM_SETS.map((set) => {
            const offer = setOffer(set, products);
            const soon = set.status === 'coming-soon';
            return (
              <li key={set.handle} className={`shop-set world world--${set.theme}`}>
                <Link href={`/sets/${set.handle}`} className="shop-set__link">
                  <span className="shop-set__media">
                    <Media src={setPhoto(set.heroTall, 900)} alt={set.heroTall.alt} ratio="4 / 5" sizes="(min-width: 900px) 30vw, 100vw" />
                  </span>
                  <span className="shop-set__body">
                    <span className="shop-set__place">{set.place}</span>
                    <span className="shop-set__title">{set.title}</span>
                    <span className="shop-set__count">
                      {set.pieces.length} pieces in one box
                    </span>
                    {offer && !soon ? (
                      <span className="shop-set__price">
                        <strong>{formatMoney(offer.setPrice)}</strong>
                        {offer.saving > 0 && (
                          <span>
                            <s>{formatMoney(offer.separately)}</s> bought separately. Save {formatMoney(offer.saving)}.
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="shop-set__price">Opening in the new year</span>
                    )}
                    <span className="shop-set__go">
                      See the set <Icon name="arrow-right" size={16} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Every piece, grouped by the set it comes from. */}
      {ROOM_SETS.map((set) => {
        const offer = setOffer(set, products);
        const soon = set.status === 'coming-soon';
        return (
          <section key={set.handle} id={`from-${set.handle}`} className="container shop-group" aria-labelledby={`group-${set.handle}`}>
            <header className="shop-group__head">
              <h2 id={`group-${set.handle}`} className="shop-section__title">
                From {theTitle(set.title)} set
              </h2>
              <Link href={`/sets/${set.handle}`} className="shop-group__deal">
                {soon || !offer ? (
                  <>Opening in the new year. See the set</>
                ) : (
                  <>
                    Buy all {set.pieces.length} as a set for {formatMoney(offer.setPrice)}
                    {offer.saving > 0 && <> and save {formatMoney(offer.saving)}</>}
                  </>
                )}
                <Icon name="arrow-right" size={16} />
              </Link>
            </header>
            <ul className="shop-grid">
              {set.pieces.map((piece) => {
                const product = byHandle(piece.handle);
                return product ? (
                  <li key={piece.handle}>
                    <PieceCard product={product} soldAs={piece.soldAs} />
                  </li>
                ) : null;
              })}
            </ul>
          </section>
        );
      })}

      {/* Add-ons: bigger pieces, delivered on their own. */}
      {ADD_ONS.length > 0 && (
        <section id="add-ons" className="container shop-group" aria-labelledby="group-add-ons">
          <header className="shop-group__head">
            <h2 id="group-add-ons" className="shop-section__title">
              Add-ons
            </h2>
            <p className="shop-group__note">Larger pieces that go with a set. They are delivered separately, and cost less when you order them with any room set.</p>
          </header>
          <ul className="shop-grid">
            {ADD_ONS.map((a) => {
              const product = byHandle(a.handle);
              return product ? (
                <li key={a.handle}>
                  <PieceCard product={product} line={`${formatMoney(a.withSetPrice)} with a room set`} />
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      <p className="container shop-foot">Photos marked “Sample photo” show similar pieces. They will be replaced with photos of the real pieces.</p>
    </div>
  );
}
