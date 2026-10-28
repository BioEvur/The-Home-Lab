import type { Money, Product } from '@/lib/catalog/types';
import { formatMoney, priceRange } from '@/lib/format';

export function Price({ price, compareAt, size = 'md' }: { price: Money; compareAt?: Money | null; size?: 'md' | 'lg' }) {
  const sale = compareAt && compareAt.amount > price.amount;
  return (
    <span className={`price price--${size}`}>
      {sale ? (
        <>
          <span className="visually-hidden">Sale price</span>
          <span className="price__current price__current--sale">{formatMoney(price)}</span>
          <span className="visually-hidden">Was</span>
          <s className="price__compare">{formatMoney(compareAt)}</s>
        </>
      ) : (
        <span className="price__current">{formatMoney(price)}</span>
      )}
    </span>
  );
}

/** Card pricing: shows "From" when variants are priced differently. */
export function ProductPrice({ product }: { product: Product }) {
  const { min, max } = priceRange(product);
  const cheapest = product.variants.find((v) => v.price.amount === min)!;
  return (
    <span className="price">
      {min !== max && <span className="price__from">From </span>}
      <Price price={cheapest.price} compareAt={cheapest.compareAtPrice} />
    </span>
  );
}
