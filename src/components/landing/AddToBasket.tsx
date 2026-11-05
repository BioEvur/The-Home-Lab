'use client';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant } from '@/lib/catalog/variants';
import { formatMoney } from '@/lib/format';
import { useCart } from '@/components/commerce/CartProvider';
import { toCartLine } from '@/components/commerce/toLine';

/** A plain add-to-basket button for a single piece on a landing page. */
export function AddToBasket({ product, label = 'Add to basket', withPrice = false, className = 'button button--secondary button--small' }: { product: Product; label?: string; withPrice?: boolean; className?: string }) {
  const { addLine } = useCart();
  const variant = defaultVariant(product);
  const available = variant.availableForSale;
  return (
    <button type="button" className={className} onClick={() => addLine(toCartLine(product, variant))} disabled={!available}>
      {available ? `${label}${withPrice ? `, ${formatMoney(variant.price)}` : ''}` : 'Opening soon'}
    </button>
  );
}
