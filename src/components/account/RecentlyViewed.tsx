'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/catalog/types';
import { productHref } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { readJSON, writeJSON } from '@/lib/storage';
import { Media } from '@/components/ui/Media';

const KEY = 'thl.recent.v1';
const MAX = 8;

/** Records a product or set view on this device (no server, no cookies). */
export function TrackView({ handle }: { handle: string }) {
  useEffect(() => {
    writeJSON(KEY, [handle, ...readJSON<string[]>(KEY, []).filter((h) => h !== handle)].slice(0, MAX));
  }, [handle]);
  return null;
}

/** Pieces and sets the member looked at recently on this device. */
export function RecentlyViewed({ limit = 4 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const handles = readJSON<string[]>(KEY, []).slice(0, limit);
    if (!handles.length) return setProducts([]);
    fetch(`/api/products?handles=${handles.map(encodeURIComponent).join(',')}`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d: { products: Product[] }) => setProducts(handles.map((h) => d.products.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p))))
      .catch(() => setProducts([]));
  }, [limit]);

  if (!products?.length) return null;
  return (
    <section className="dash-section" aria-labelledby="recent-title">
      <div className="dash-section__head">
        <h2 id="recent-title" className="dash-section__title">
          Recently viewed
        </h2>
      </div>
      <ul className="mini-grid">
        {products.map((p) => (
          <li key={p.handle}>
            <Link href={productHref(p.handle)} className="mini-card">
              <span className="mini-card__media">{p.images[0] && <Media src={p.images[0].src} alt={p.images[0].alt} ratio="1 / 1" sizes="160px" />}</span>
              <span className="mini-card__name">{p.title}</span>
              <span className="muted">{formatMoney(p.variants[0].price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
