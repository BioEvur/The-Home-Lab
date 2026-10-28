'use client';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant } from '@/lib/catalog/variants';
import { useCart } from '@/components/commerce/CartProvider';
import { toCartLine } from '@/components/commerce/toLine';
import { WishlistButton } from '@/components/commerce/WishlistButton';

/** The basket button on a piece or add-on page. */
export function PieceBuy({ product, cta }: { product: Product; cta: string }) {
  const { addLine } = useCart();
  const variant = defaultVariant(product);
  const available = variant.availableForSale;
  return (
    <div className="set-buy__actions">
      <button type="button" className="button button--accent set-buy__add" onClick={() => addLine(toCartLine(product, variant), 1)} disabled={!available}>
        {available ? cta : 'Opening in the new year'}
      </button>
      <WishlistButton handle={product.handle} title={product.title} variant="full" />
    </div>
  );
}
