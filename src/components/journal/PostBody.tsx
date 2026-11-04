import Link from 'next/link';
import type { Product } from '@/lib/catalog/types';
import type { Block } from '@/lib/content/journal';
import { photoUrl } from '@/lib/content/media';
import { getRoomSet, setPhoto, theTitle, itemCount } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { PieceCard } from '@/components/shop/PieceCard';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { Inline } from './Inline';

export function SetCard({ handle, text, products }: { handle: string; text: string; products: Product[] }) {
  const set = getRoomSet(handle);
  if (!set) return null;
  const product = products.find((p) => p.handle === handle);
  const soon = set.status === 'coming-soon' || !product?.variants[0]?.availableForSale;
  return (
    <aside className={`post-set world world--${set.theme}`} aria-label={`The ${set.title} room set`}>
      <div className="post-set__media">
        <Media src={setPhoto(set.heroTall, 900)} alt={set.heroTall.alt} ratio="fill" sizes="(min-width: 900px) 320px, 100vw" />
      </div>
      <div className="post-set__body">
        <p className="post-set__kicker">A room set from {set.place}</p>
        <p className="post-set__title">{set.title}</p>
        <p className="post-set__text">
          <Inline text={text} />
        </p>
        <p className="post-set__meta">
          {soon ? 'Opening in the new year' : product ? `${formatMoney(product.variants[0].price)} · ${itemCount(set)} things in one box` : null}
        </p>
        <Link href={`/sets/${set.handle}`} className="button button--accent">
          {soon ? `See what’s in ${theTitle(set.title)}` : `See ${theTitle(set.title)} set`} <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </aside>
  );
}

export function PostBody({ blocks, products }: { blocks: Block[]; products: Product[] }) {
  return (
    <div className="post-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'lead':
            return (
              <p key={i} className="post-body__lead">
                <Inline text={b.text} />
              </p>
            );
          case 'p':
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case 'h2':
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i}>{b.text}</h3>;
          case 'image':
            return (
              <figure key={i} className={`post-figure ${b.wide ? 'post-figure--wide' : ''}`}>
                <Media src={photoUrl(b.photo.id, b.wide ? 2000 : 1400)} alt={b.photo.alt} ratio={b.wide ? '16 / 9' : '3 / 2'} focus={b.photo.focus} sizes={b.wide ? '(min-width: 1200px) 1100px, 100vw' : '(min-width: 800px) 720px, 100vw'} />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case 'pair':
            return (
              <figure key={i} className="post-figure post-figure--pair">
                <div>
                  {b.photos.map((ph) => (
                    <Media key={ph.id} src={photoUrl(ph.id, 1000)} alt={ph.alt} ratio="4 / 5" focus={ph.focus} sizes="(min-width: 800px) 360px, 50vw" />
                  ))}
                </div>
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={i} className={b.ordered ? 'post-steps' : undefined}>
                {b.items.map((item) => (
                  <li key={item}>
                    <Inline text={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case 'tip':
            return (
              <aside key={i} className="post-tip">
                <p className="post-tip__title">{b.title}</p>
                <p>
                  <Inline text={b.text} />
                </p>
              </aside>
            );
          case 'quote':
            return (
              <blockquote key={i} className="post-quote">
                <p>{b.text}</p>
                {b.cite && <cite>{b.cite}</cite>}
              </blockquote>
            );
          case 'set':
            return <SetCard key={i} handle={b.handle} text={b.text} products={products} />;
          case 'pieces': {
            const items = b.handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
            if (!items.length) return null;
            return (
              <section key={i} className="post-pieces" aria-label={b.title ?? 'Pieces mentioned'}>
                {b.title && <p className="post-pieces__title">{b.title}</p>}
                <ul>
                  {items.map((p) => (
                    <li key={p.handle}>
                      <PieceCard product={p} sizes="(min-width: 800px) 200px, 45vw" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'table':
            return (
              <div key={i} className="post-table">
                <table>
                  {b.caption && <caption>{b.caption}</caption>}
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.join('|')}>
                        {r.map((c, j) =>
                          j === 0 ? (
                            <th key={j} scope="row">
                              <Inline text={c} />
                            </th>
                          ) : (
                            <td key={j}>
                              <Inline text={c} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'faq':
            return (
              <div key={i} className="faq post-faq">
                {b.items.map((f) => (
                  <details key={f.q}>
                    <summary>
                      {f.q}
                      <Icon name="plus" size={18} />
                    </summary>
                    <p>
                      <Inline text={f.a} />
                    </p>
                  </details>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
