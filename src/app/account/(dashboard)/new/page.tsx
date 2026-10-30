import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewArrivals } from '@/lib/commerce';
import { formatDay } from '@/lib/content/batches';
import { ROOM_SETS, isRoomSetHandle, setPhoto } from '@/lib/content/sets';
import { LaunchAlertButton } from '@/components/account/Preferences';
import { PieceCard } from '@/components/shop/PieceCard';
import { Media } from '@/components/ui/Media';

export const metadata: Metadata = { title: 'New in', robots: { index: false } };

/** Newest sets and pieces first, plus launch alerts for what is coming. */
export default async function NewInPage() {
  const products = await getNewArrivals(40);
  const live = products.filter((p) => p.variants.some((v) => v.availableForSale));
  const sets = live.filter((p) => isRoomSetHandle(p.handle));
  const pieces = live.filter((p) => !isRoomSetHandle(p.handle));
  const soon = ROOM_SETS.filter((s) => s.status === 'coming-soon');

  return (
    <div className="account-stack">
      <section aria-labelledby="new-title">
        <h2 id="new-title" className="h2 account__title">
          New in
        </h2>
        <p className="muted account__intro">The newest sets and pieces, latest first.</p>
        {sets.length > 0 && (
          <>
            <h3 className="h3 account__subtitle">Room sets</h3>
            <ul className="product-grid">
              {sets.map((p) => (
                <li key={p.handle}>
                  <PieceCard product={p} line={`Added ${formatDay(p.createdAt.slice(0, 10))}`} sizes="(min-width: 900px) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          </>
        )}
        {pieces.length > 0 && (
          <>
            <h3 className="h3 account__subtitle">Pieces</h3>
            <ul className="product-grid">
              {pieces.slice(0, 12).map((p) => (
                <li key={p.handle}>
                  <PieceCard product={p} line={`Added ${formatDay(p.createdAt.slice(0, 10))}`} sizes="(min-width: 900px) 25vw, 50vw" />
                </li>
              ))}
            </ul>
            {pieces.length > 12 && (
              <p>
                <Link href="/shop" className="text-button">
                  See every piece
                </Link>
              </p>
            )}
          </>
        )}
      </section>

      {soon.length > 0 && (
        <section aria-labelledby="soon-title">
          <h2 id="soon-title" className="h2 account__title">
            Coming soon
          </h2>
          <ul className="soon-list">
            {soon.map((s) => (
              <li key={s.handle} className="soon">
                <Link href={`/sets/${s.handle}`} className="soon__media">
                  <Media src={setPhoto(s.heroTall, 700)} alt={s.heroTall.alt} ratio="4 / 5" sizes="(min-width: 900px) 240px, 40vw" />
                </Link>
                <div className="soon__body">
                  <p className="soon__place">{s.place}</p>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted">{s.statusNote ?? s.kicker}</p>
                  <LaunchAlertButton handle={s.handle} title={s.title} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
