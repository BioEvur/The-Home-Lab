'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export interface BoxPiece {
  handle: string;
  name: string;
  what: string;
  qty: number;
  note: string;
  details: { label: string; value: string }[];
  /** Short size for the packing list, e.g. "600 ml". */
  short: string;
  /** sample: a stock photo of a similar piece, not the real one. */
  photos: { src: string; alt: string; sample?: boolean }[];
  /** Bought on its own: the price (null until it is on sale) and its product page. */
  single?: { price: string | null; soldAs?: string; href: string };
}

/**
 * "What's in the box": a packing list that stays in view on wide screens and
 * marks the piece you are looking at, beside a large spread for each piece.
 */
export function BoxContents({ pieces, listTitle, footer }: { pieces: BoxPiece[]; listTitle: string; footer?: ReactNode }) {
  const [active, setActive] = useState<string | undefined>(pieces[0]?.handle);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>('[data-piece]');
    if (!els?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute('data-piece') ?? undefined);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Everything in the box, in one picture: a tile for every piece. */}
      <figure className="box-all">
        <ul className={`box-all__grid box-all__grid--${pieces.length}`}>
          {pieces.map((p, i) => (
            <li key={p.handle} className={i === 0 ? 'box-all__lead' : undefined}>
              <a href={`#piece-${p.handle}`}>
                {p.photos[0] && <Media src={p.photos[0].src} alt={p.photos[0].alt} ratio="fill" sizes={i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw'} />}
                <span className="box-all__label">
                  {p.qty > 1 ? `${p.qty} × ` : ''}
                  {p.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {pieces.some((p) => p.photos[0]?.sample) && <figcaption>Sample photos of similar pieces. They will be replaced with photos of the real set.</figcaption>}
      </figure>

    <div className="box" ref={root}>
      <aside className="box-list" aria-label="Packing list">
        <p className="box-list__title">{listTitle}</p>
        <ol>
          {pieces.map((p) => (
            <li key={p.handle}>
              <a href={`#piece-${p.handle}`} className={p.handle === active ? 'is-active' : undefined} aria-current={p.handle === active ? 'true' : undefined}>
                <span className="box-list__qty">{p.qty} ×</span>
                <span className="box-list__name">{p.name}</span>
                <span className="box-list__size">{p.short}</span>
              </a>
            </li>
          ))}
        </ol>
        {footer && <div className="box-list__foot">{footer}</div>}
      </aside>

      <div className="box-pieces">
        {pieces.map((p, i) => (
          <article key={p.handle} id={`piece-${p.handle}`} data-piece={p.handle} className={`box-piece ${i === 0 ? 'box-piece--lead' : ''}`} aria-labelledby={`pn-${p.handle}`}>
            <div className={`box-piece__media ${p.photos.length > 1 ? 'box-piece__media--pair' : ''}`}>
              {p.photos.map((ph, j) => (
                <figure key={ph.src}>
                  <Media src={ph.src} alt={ph.alt} ratio={j === 0 ? (i === 0 ? '4 / 5' : '5 / 4') : '3 / 4'} sizes="(min-width: 1024px) 55vw, 100vw" />
                  {ph.sample && <figcaption>Sample photo</figcaption>}
                </figure>
              ))}
            </div>
            <div className="box-piece__body">
              <div className="box-piece__words">
                <h3 id={`pn-${p.handle}`} className="box-piece__name">
                  {p.name}
                  {p.qty > 1 && <span className="box-piece__qty"> × {p.qty}</span>}
                </h3>
                <p className="box-piece__what">{p.what}</p>
                <p className="box-piece__note">{p.note}</p>
              </div>
              <dl className="box-piece__details">
                {p.details.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
              {p.single && (
                <Link href={p.single.href} className="box-piece__single">
                  {p.single.price ? (
                    <span>
                      Buy separately{p.single.soldAs ? ` (${p.single.soldAs.toLowerCase()})` : ''}, <strong>{p.single.price}</strong>
                    </span>
                  ) : (
                    <span>Sold separately from the new year</span>
                  )}
                  <span className="box-piece__single-go">
                    See this piece <Icon name="arrow-right" size={16} />
                  </span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
    </>
  );
}
