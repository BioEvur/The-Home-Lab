'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { useCommerceMode } from './CommerceMode';
import { useCart } from './CartProvider';

/**
 * Hands the basket to Shopify's hosted checkout. In development mode there is
 * no checkout: the button is disabled and says so. No order or payment can be
 * created from this storefront directly.
 */
export function CheckoutButton({ discountCode }: { discountCode?: string }) {
  const mode = useCommerceMode();
  const { checkoutableLines, subtotal, count } = useCart();
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  if (mode === 'development') {
    return (
      <div className="checkout-dev">
        <button type="button" className="button button--primary button--block" disabled aria-describedby="checkout-dev-note">
          Checkout not connected
        </button>
        <p id="checkout-dev-note" className="note">
          <Icon name="info" size={16} /> This is a development build. Checkout opens on Shopify once the store is connected; no orders or payments can be made here.
        </p>
      </div>
    );
  }

  const start = async () => {
    setState('loading');
    setError('');
    track({ name: 'begin_checkout', value: subtotal.amount, items: count });
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: checkoutableLines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })), discountCode }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; message?: string };
      if (!res.ok || !data.checkoutUrl) throw new Error(data.message ?? 'Checkout could not be started.');
      window.location.assign(data.checkoutUrl);
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : 'Checkout could not be started.');
    }
  };

  return (
    <div>
      <button
        type="button"
        className="button button--primary button--block"
        onClick={start}
        disabled={state === 'loading' || !checkoutableLines.length}
        aria-busy={state === 'loading'}
      >
        {state === 'loading' ? 'Opening secure checkout…' : 'Checkout'}
      </button>
      {state === 'error' && (
        <p className="form-error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </p>
      )}
    </div>
  );
}
