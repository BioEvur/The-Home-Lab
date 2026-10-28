import Link from 'next/link';
import type { Product } from '@/lib/catalog/types';
import { productHref } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { Media } from '@/components/ui/Media';

/** A piece or add-on in the shop: photo, plain name, price, and one line under it. */
export function PieceCard({ product, soldAs, line, sizes = '(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw' }: { product: Product; soldAs?: string; line?: string; sizes?: string }) {
  const image = product.images[0];
  const variant = product.variants[0];
  const available = variant.availableForSale;
  return (
    <article className="piece-card">
      <Link href={productHref(product.handle)} className="piece-card__link">
        <span className="piece-card__media">
          {image && <Media src={image.src} alt={image.alt} ratio="4 / 5" sizes={sizes} />}
          {image?.sample && <span className="piece-card__sample">Sample photo</span>}
        </span>
        <span className="piece-card__name">{product.title}</span>
        {soldAs && <span className="piece-card__sold">{soldAs}</span>}
        <span className="piece-card__price">{available ? formatMoney(variant.price) : 'Opening in the new year'}</span>
        {line && <span className="piece-card__line">{line}</span>}
      </Link>
    </article>
  );
}
