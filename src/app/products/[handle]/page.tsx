import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/commerce';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { setOffer } from '@/lib/catalog/offers';
import { defaultVariant } from '@/lib/catalog/variants';
import { ADD_ONS, getAddOn } from '@/lib/content/addons';
import { preorderCopy } from '@/lib/content/batches';
import { ROOM_SETS, getPiece, getRoomSet, setPhoto, theTitle } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { PieceBuy } from '@/components/shop/PieceBuy';
import { PieceCard } from '@/components/shop/PieceCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { Media } from '@/components/ui/Media';

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return [...ROOM_SETS.flatMap((s) => s.pieces.map((p) => ({ handle: p.handle }))), ...ADD_ONS.map((a) => ({ handle: a.handle }))];
}

/** A piece from a set, or an add-on, in the same shape. */
function lookup(handle: string) {
  const found = getPiece(handle);
  if (found) {
    const { set, piece } = found;
    return { kind: 'piece' as const, set, title: piece.name, soldAs: piece.soldAs, what: piece.what, note: piece.note, details: piece.details, addOn: null };
  }
  const addOn = getAddOn(handle);
  const set = addOn && getRoomSet(addOn.sets[0]);
  if (!addOn || !set) return null;
  return { kind: 'add-on' as const, set, title: addOn.title, soldAs: undefined, what: addOn.what, note: addOn.note, details: addOn.details, addOn };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = lookup((await params).handle);
  if (!item) notFound();
  return {
    title: item.title,
    description: item.what,
    alternates: { canonical: `/products/${(await params).handle}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const item = lookup(handle);
  const product = await getProduct(handle);
  if (!item || !product) notFound();

  const { set } = item;
  const products = await getProducts();
  const offer = setOffer(set, products);
  const variant = defaultVariant(product);
  const copy = preorderCopy();
  const soon = set.status === 'coming-soon' || !variant.availableForSale;
  const siblings = set.pieces.filter((p) => p.handle !== handle);

  return (
    <article className={`product world world--${set.theme}`}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: item.title,
          description: item.what,
          image: product.images.map((i) => (i.src.startsWith('/') ? `${SITE_URL}${i.src}` : i.src)),
          brand: { '@type': 'Brand', name: siteConfig.name },
          url: `${SITE_URL}/products/${handle}`,
          ...(soon
            ? {}
            : {
                offers: {
                  '@type': 'Offer',
                  price: (variant.price.amount / 100).toFixed(2),
                  priceCurrency: variant.price.currencyCode,
                  availability: 'https://schema.org/PreOrder',
                },
              }),
        }}
      />
      <div className="container product__crumbs">
        <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: set.title, href: `/sets/${set.handle}` }, { label: item.title }]} />
      </div>

      <div className="container product__main">
        <div className={`product__gallery product__gallery--${Math.min(product.images.length, 2)}`}>
          {product.images.map((img, i) => (
            <figure key={img.id}>
              <Media src={img.src} alt={img.alt} ratio={i === 0 ? '4 / 5' : '1 / 1'} priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" />
              {img.sample && <figcaption>Sample photo of a similar piece</figcaption>}
            </figure>
          ))}
        </div>

        <div className="product__info">
          <p className="product__kicker">{item.kind === 'add-on' ? `Add-on for ${theTitle(set.title)} set` : `From ${theTitle(set.title)} set`}</p>
          <h1 className="product__title">{item.title}</h1>
          {item.soldAs && <p className="product__sold">{item.soldAs}</p>}
          <p className="product__price">{soon ? 'Opening in the new year' : formatMoney(variant.price)}</p>
          {item.addOn && !soon && (
            <p className="product__with-set">
              {formatMoney(item.addOn.withSetPrice)} when you order it with any room set. The {formatMoney(item.addOn.price - item.addOn.withSetPrice)} comes off in the basket.
            </p>
          )}
          <p className="product__what">{item.what}</p>
          <p className="product__note">{item.note}</p>

          <PieceBuy product={product} cta={item.addOn ? 'Pre-order' : copy.cta} />
          {!soon &&
            (item.addOn ? (
              <p className="product__ships">{item.addOn.delivery}</p>
            ) : (
              copy.batch && <p className="product__ships">{copy.line}</p>
            ))}

          {/* Buy as a set. */}
          <aside className="product-set" aria-labelledby="product-set-title">
            <Link href={item.addOn ? `/sets/${set.handle}#addon-${handle}` : `/sets/${set.handle}`} className="product-set__link">
              <span className="product-set__media">
                <Media src={setPhoto(set.heroTall, 400)} alt="" ratio="1 / 1" sizes="96px" />
              </span>
              <span className="product-set__body">
                <span id="product-set-title" className="product-set__title">
                  Buy as a set
                </span>
                {item.addOn ? (
                  <span>
                    Order {theTitle(set.title)} set with the {item.title} and pay{' '}
                    {formatMoney(item.addOn.withSetPrice)} for it instead of {formatMoney(item.addOn.price)}.
                  </span>
                ) : soon || !offer ? (
                  <span>
                    This piece is part of {theTitle(set.title)} set, with {siblings.length} other pieces. The set opens in the new year.
                  </span>
                ) : (
                  <span>
                    This piece comes in {theTitle(set.title)} set with {siblings.length} other pieces: {formatMoney(offer.setPrice)} for the whole set,
                    instead of {formatMoney(offer.separately)} bought separately. You save {formatMoney(offer.saving)}.
                  </span>
                )}
                <span className="product-set__go">
                  See {theTitle(set.title)} set <Icon name="arrow-right" size={16} />
                </span>
              </span>
            </Link>
          </aside>

          <dl className="product__details">
            {item.details.map((d) => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The rest of the set. */}
      <section className="container product__more" aria-labelledby="more-title">
        <h2 id="more-title" className="shop-section__title">
          {item.addOn ? `In ${theTitle(set.title)} set` : `Also in ${theTitle(set.title)} set`}
        </h2>
        <ul className="shop-grid">
          {(item.addOn ? set.pieces : siblings).map((p) => {
            const sibling = products.find((x) => x.handle === p.handle);
            return sibling ? (
              <li key={p.handle}>
                <PieceCard product={sibling} soldAs={p.soldAs} />
              </li>
            ) : null;
          })}
        </ul>
      </section>
    </article>
  );
}
