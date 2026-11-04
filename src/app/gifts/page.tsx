import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/commerce';
import type { Product } from '@/lib/catalog/types';
import { formatDay, preorderCopy } from '@/lib/content/batches';
import { GIFT_FAQS, GIFT_SECTIONS } from '@/lib/content/gifts';
import { ALL_POSTS } from '@/lib/content/journal';
import { SetCard } from '@/components/journal/PostBody';
import { PostCard } from '@/components/journal/PostCard';
import { PieceCard } from '@/components/shop/PieceCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Christmas gift ideas in Ireland: coffee, cocktail and home gifts',
  description:
    'Christmas gifts delivered in Ireland: a complete pour-over coffee set, a Milan-style drinks corner, housewarming pieces and gifts under €50. Posted from Ireland, no customs charges.',
  alternates: { canonical: '/gifts' },
};

export default async function GiftsPage() {
  const products = await getProducts();
  const copy = preorderCopy();
  const available = (p?: Product) => Boolean(p?.variants[0]?.availableForSale);
  const pick = (handles: string[]) => handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => available(p));
  const guides = ALL_POSTS.filter((p) => p.category === 'Gift guides').slice(0, 3);

  return (
    <div className="gifts">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: GIFT_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <header className="container gifts-head">
        <Breadcrumbs items={[{ label: 'Christmas gifts' }]} />
        <h1 className="display-2 gifts-head__title">Christmas gifts that arrive complete</h1>
        <div className="gifts-head__body">
          <p className="gifts-head__lede">
            Gifts for the coffee lover, the host and the new home, delivered anywhere in the Republic of Ireland. Each room set is a whole gift in one box,
            and every piece is also sold on its own.
          </p>
          {copy.batch && (
            <dl className="gifts-dates">
              <div>
                <dt>Order by</dt>
                <dd>{formatDay(copy.batch.ordersClose)}</dd>
              </div>
              <div>
                <dt>Posted by</dt>
                <dd>{formatDay(copy.batch.shipsBy)}</dd>
              </div>
              <div>
                <dt>Customs charges</dt>
                <dd>None, posted from Ireland</dd>
              </div>
            </dl>
          )}
        </div>
        <nav className="journal-head__topics" aria-label="Gift guide sections">
          {GIFT_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
      </header>

      {GIFT_SECTIONS.map((section) => {
        const items = section.maxPrice
          ? products
              .filter((p) => available(p) && p.productType !== 'Room set' && p.variants[0].price.amount <= section.maxPrice!)
              .sort((a, b) => a.variants[0].price.amount - b.variants[0].price.amount)
          : pick(section.pieces);
        return (
          <section key={section.id} id={section.id} className="container gifts-section" aria-labelledby={`gs-${section.id}`}>
            <div className="gifts-section__head">
              <h2 id={`gs-${section.id}`} className="journal-group__title">
                {section.title}
              </h2>
              <p>{section.intro}</p>
            </div>
            {section.set && <SetCard handle={section.set.handle} text={section.set.text} products={products} />}
            {items.length > 0 && (
              <ul className="gifts-pieces">
                {items.map((p) => (
                  <li key={p.handle}>
                    <PieceCard product={p} sizes="(min-width: 1024px) 22vw, 45vw" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <section className="container gifts-faq" aria-labelledby="gifts-faq-title">
        <h2 id="gifts-faq-title" className="journal-group__title">
          Buying a gift: questions
        </h2>
        <div className="faq">
          {GIFT_FAQS.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Icon name="plus" size={18} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="gifts-faq__more">
          More on <Link href="/help/delivery">delivery</Link> and <Link href="/help/returns">returns</Link>.
        </p>
      </section>

      {guides.length > 0 && (
        <section className="container post-related" aria-labelledby="gift-guides-title">
          <h2 id="gift-guides-title" className="journal-group__title">
            Gift guides from the Journal
          </h2>
          <ul className="journal-grid">
            {guides.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
