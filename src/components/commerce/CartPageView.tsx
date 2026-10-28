'use client';
import Link from 'next/link';
import { SCENES, photoUrl } from '@/lib/content/media';
import { Media } from '@/components/ui/Media';
import { useEffect, useState } from 'react';
import { formatMoney } from '@/lib/format';
import { FormStatus, TextField } from '@/components/forms/Field';
import { Icon } from '@/components/ui/Icon';
import { CartLines } from './CartLines';
import { useCart } from './CartProvider';
import { CheckoutButton } from './CheckoutButton';
import { useCommerceMode } from './CommerceMode';

export function CartPageView() {
  const { lines, hydrated, subtotal, discounts, total, count, revalidate, checkoutableLines } = useCart();
  const mode = useCommerceMode();
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    revalidate().then((r) => !cancelled && setStatus(r));
    return () => {
      cancelled = true;
    };
    // Re-check once per visit; not on every quantity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="cart-page" aria-busy="true">
        <div>
          {[0, 1].map((i) => (
            <div key={i} className="cart-skeleton">
              <span className="skeleton" />
              <span className="skeleton" />
            </div>
          ))}
        </div>
        <span className="visually-hidden">Loading your basket…</span>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="cart-empty">
        <div className="empty-state">
          <p className="empty-state__title">Your basket is empty.</p>
          <p>Anything you add will be kept on this device until you check out.</p>
          <div className="empty-state__actions">
            <Link href="/" className="button button--primary">
              See the room sets
            </Link>
            <Link href="/wishlist" className="button button--secondary">
              View wishlist
            </Link>
          </div>
        </div>
        <Media src={photoUrl(SCENES.coffeeTable.id, 1400)} alt="" ratio="4 / 3" sizes="(min-width: 1024px) 50vw, 100vw" className="cart-empty__img" />
      </div>
    );
  }

  const applyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return setCodeError('Enter a discount code.');
    if (!/^[A-Za-z0-9_-]{3,40}$/.test(trimmed)) return setCodeError('Discount codes contain letters, numbers, dashes and underscores only.');
    setCodeError(null);
    setAppliedCode(trimmed.toUpperCase());
  };

  return (
    <div className="cart-page">
      <div>
        {status === 'error' && (
          <FormStatus tone="error">We could not re-check prices and availability just now. They will be confirmed at checkout.</FormStatus>
        )}
        <CartLines />
        <Link href="/" className="arrow-link cart-page__continue">
          <Icon name="arrow-left" size={16} /> Back to the room sets
        </Link>
      </div>

      <aside className="cart-summary" aria-labelledby="summary-title">
        <h2 id="summary-title" className="eyebrow">
          Order summary
        </h2>
        <dl className="summary-row">
          <dt>Items</dt>
          <dd>{count}</dd>
        </dl>
        <dl className="summary-row">
          <dt>Subtotal</dt>
          <dd>{formatMoney(subtotal)}</dd>
        </dl>
        {discounts.map((d) => (
          <dl key={d.label} className="summary-row summary-row--saving">
            <dt>{d.label}</dt>
            <dd>−{formatMoney(d.amount)}</dd>
          </dl>
        ))}
        <dl className="summary-row">
          <dt>Delivery</dt>
          <dd className="muted">Calculated at checkout</dd>
        </dl>
        {checkoutableLines.length < lines.length && <p className="note">Unavailable items are not included in the subtotal.</p>}

        <form className="discount-form" onSubmit={applyCode} noValidate>
          <TextField id="discount" label="Discount code" optional value={code} onChange={(e) => setCode(e.target.value)} error={codeError} autoComplete="off" />
          <button type="submit" className="button button--secondary">
            Apply
          </button>
        </form>
        {appliedCode && (
          <p className="note">
            <Icon name="info" size={16} />
            {mode === 'shopify'
              ? `“${appliedCode}” will be checked and applied at checkout if it is valid.`
              : `“${appliedCode}” has been noted, but codes can only be checked once Shopify is connected.`}
          </p>
        )}

        <dl className="summary-row summary-row--total">
          <dt>Estimated total</dt>
          <dd>{formatMoney(total)}</dd>
        </dl>
        <p className="note">Taxes are included where applicable. Final prices, discounts and delivery are confirmed by Shopify at checkout.</p>
        <CheckoutButton discountCode={appliedCode || undefined} />
      </aside>
    </div>
  );
}
