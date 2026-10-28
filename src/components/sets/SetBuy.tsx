'use client';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant } from '@/lib/catalog/variants';
import type { SetOffer } from '@/lib/catalog/offers';
import type { AddOn } from '@/lib/content/addons';
import { formatMoney } from '@/lib/format';
import { useCart } from '@/components/commerce/CartProvider';
import { toCartLine } from '@/components/commerce/toLine';
import { WishlistButton } from '@/components/commerce/WishlistButton';

export interface SetAddOn {
  addOn: AddOn;
  product: Product;
}

/**
 * Price, the batch dates and the pre-order button. Adds the whole set as one
 * basket line, plus any add-on the customer ticks.
 */
export function SetBuy({
  product,
  cta,
  line,
  offer,
  addOns = [],
  devPrice = false,
  compact = false,
}: {
  product: Product;
  cta: string;
  line: string;
  offer?: SetOffer | null;
  addOns?: SetAddOn[];
  devPrice?: boolean;
  compact?: boolean;
}) {
  const { addLine } = useCart();
  const variant = defaultVariant(product);
  const available = variant.availableForSale;
  const [ticked, setTicked] = useState<string[]>([]);

  // "Add it to your order" links elsewhere on the page point at #add-<handle>.
  useEffect(() => {
    if (compact) return;
    const fromHash = () => {
      const handle = window.location.hash.replace(/^#add-/, '');
      if (handle !== window.location.hash && addOns.some((a) => a.addOn.handle === handle)) setTicked((t) => (t.includes(handle) ? t : [...t, handle]));
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [compact, addOns]);

  const chosen = addOns.filter((a) => ticked.includes(a.addOn.handle));
  const order = () => {
    addLine(toCartLine(product, variant), 1, { openDrawer: chosen.length === 0 });
    chosen.forEach((a, i) => addLine(toCartLine(a.product, defaultVariant(a.product)), 1, { openDrawer: i === chosen.length - 1 }));
  };

  if (compact) {
    return (
      <button type="button" className="button button--accent" onClick={order} disabled={!available}>
        {available ? `${cta}, ${formatMoney(variant.price)}` : 'Opening soon'}
      </button>
    );
  }

  const total = variant.price.amount + chosen.reduce((n, a) => n + a.addOn.withSetPrice, 0);

  return (
    <div className="set-buy">
      <p className="set-buy__price">
        <span className="set-buy__amount">{formatMoney(variant.price)}</span>
        <span className="set-buy__count">The whole set{devPrice && ', sample price'}</span>
      </p>
      {offer && offer.saving > 0 && (
        <p className="set-buy__saving">
          The pieces cost {formatMoney(offer.separately)} bought separately. As a set you save {formatMoney(offer.saving)}.
        </p>
      )}
      <p className="set-buy__line">{line}</p>
      {addOns.length > 0 && (
        <fieldset className="set-addons">
          <legend>Optional add-on</legend>
          {addOns.map(({ addOn }) => (
            <label key={addOn.handle} className="set-addons__item">
              <input
                type="checkbox"
                id={`add-${addOn.handle}`}
                checked={ticked.includes(addOn.handle)}
                onChange={(e) => setTicked((t) => (e.target.checked ? [...t, addOn.handle] : t.filter((h) => h !== addOn.handle)))}
                disabled={!available}
              />
              <span>
                <strong>
                  Add the {addOn.title}, {formatMoney(addOn.withSetPrice)}
                </strong>{' '}
                <s>{formatMoney(addOn.price)}</s>
                <span className="set-addons__note">{addOn.delivery}</span>
              </span>
            </label>
          ))}
          {chosen.length > 0 && <p className="set-addons__total">Set and add-on together: {formatMoney(total)}</p>}
        </fieldset>
      )}
      <div className="set-buy__actions">
        <button type="button" className="button button--accent set-buy__add" onClick={order} disabled={!available}>
          {available ? cta : 'Opening soon'}
        </button>
        <WishlistButton handle={product.handle} title={product.title} variant="full" />
      </div>
    </div>
  );
}
