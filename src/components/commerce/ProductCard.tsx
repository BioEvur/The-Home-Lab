import { productHref } from '@/lib/content/sets';
import Link from 'next/link';
import type { Product } from '@/lib/catalog/types';
import { isAvailable, isOnSale } from '@/lib/format';
import { Media } from '@/components/ui/Media';
import { ProductPrice } from './Price';
import { QuickAdd } from './QuickAdd';
import { WishlistButton } from './WishlistButton';

export function ProductCard({
  product,
  priority = false,
  sizes = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw',
  ratio = '4 / 5',
  showQuickAdd = true,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  ratio?: string;
  showQuickAdd?: boolean;
}) {
  const [first, ...rest] = product.images;
  // The hover image is a genuinely different image of the same product (never invented).
  const second = rest.find((img) => img.id !== first?.id && img.id.startsWith(first?.id ?? '')) ?? rest[0];
  const available = isAvailable(product);
  const sale = product.variants.some(isOnSale);
  const colourCount = product.colours.length;

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link href={productHref(product.handle)} className="product-card__image-link" tabIndex={-1} aria-hidden="true">
          {first && <Media src={first.src} alt="" ratio={ratio} sizes={sizes} priority={priority} className="product-card__img" />}
          {second && <Media src={second.src} alt="" ratio={ratio} sizes={sizes} className="product-card__img product-card__img--alt" />}
        </Link>
        <div className="product-card__badges">
          {product.productType === 'Room set' && <span className="badge badge--olive">Room set</span>}
          {!available && <span className="badge">{product.productType === 'Room set' ? 'Coming soon' : 'Unavailable'}</span>}
          {available && sale && <span className="badge badge--clay">Reduced</span>}
          {available && !sale && product.isNew && <span className="badge badge--light">New</span>}
        </div>
        <div className="product-card__wish">
          <WishlistButton handle={product.handle} title={product.title} />
        </div>
        {showQuickAdd && (
          <div className="product-card__quick">
            <QuickAdd product={product} />
          </div>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">
          <Link href={productHref(product.handle)}>{product.title}</Link>
        </h3>
        <p className="product-card__meta">
          <ProductPrice product={product} />
          {colourCount > 1 && (
            <span className="product-card__swatches" aria-label={`${colourCount} colours or finishes`}>
              {product.colours.slice(0, 4).map((c) => (
                <span key={c.value} className="swatch-dot" style={{ background: c.swatch }} title={c.value} />
              ))}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
