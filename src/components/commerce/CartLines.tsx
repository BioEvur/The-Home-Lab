'use client';
import { preorderCopy } from '@/lib/content/batches';
import { getGiftBox, giftBoxCopy } from '@/lib/content/boxes';
import { productHref } from '@/lib/content/sets';
import Link from 'next/link';
import { formatMoney } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { MAX_QUANTITY, useCart, type CartLine } from './CartProvider';

const ISSUE_TEXT: Record<NonNullable<CartLine['issue']>, string> = {
  unavailable: 'No longer available. It will not be included at checkout.',
  removed: 'This item is no longer sold. Please remove it.',
  'price-changed': 'The price has changed since you added this item.',
};

/** When the line is posted: a gift box has its own date, everything else follows the batch. */
const basketLine = (handle: string) => {
  const box = getGiftBox(handle);
  return box ? giftBoxCopy(box).basket : preorderCopy().basket;
};

export function CartLines({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { lines, setQuantity, removeLine } = useCart();
  return (
    <ul className={`cart-lines ${compact ? 'cart-lines--compact' : ''}`}>
      {lines.map((line) => (
        <li key={line.variantId} className={`cart-line ${line.issue === 'unavailable' || line.issue === 'removed' ? 'is-blocked' : ''}`}>
          <Link href={productHref(line.handle)} className="cart-line__image" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
            {line.image && <Media src={line.image.src} alt="" ratio="4 / 5" sizes="120px" />}
          </Link>
          <div className="cart-line__info">
            <div className="cart-line__top">
              <div>
                <h3 className="cart-line__title">
                  <Link href={productHref(line.handle)} onClick={onNavigate}>
                    {line.title}
                  </Link>
                </h3>
                {line.variantTitle && <p className="cart-line__variant">{line.variantTitle}</p>}
                <p className="cart-line__variant">{basketLine(line.handle)}</p>
                {!compact && <p className="cart-line__unit">{formatMoney(line.price)} each</p>}
              </div>
              <p className="cart-line__total">
                <span className="visually-hidden">Line total </span>
                {formatMoney(line.price.amount * line.quantity, line.price.currencyCode)}
              </p>
            </div>
            {line.issue && (
              <p className="cart-line__issue" role="note">
                <Icon name="alert" size={16} /> {ISSUE_TEXT[line.issue]}
              </p>
            )}
            <div className="cart-line__actions">
              <QuantityStepper
                size="sm"
                value={line.quantity}
                max={MAX_QUANTITY}
                label={`Quantity for ${line.title}`}
                onChange={(q) => setQuantity(line.variantId, q)}
              />
              <button type="button" className="text-button" onClick={() => removeLine(line.variantId)}>
                Remove<span className="visually-hidden"> {line.title}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
