'use client';
import { productHref } from '@/lib/content/sets';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant } from '@/lib/catalog/variants';
import { useAuth } from '@/components/account/AuthProvider';
import { FormStatus } from '@/components/forms/Field';
import { Icon } from '@/components/ui/Icon';
import { useCart } from './CartProvider';
import { ProductCard } from './ProductCard';
import { toCartLine } from './toLine';
import { useWishlist } from './WishlistProvider';

export function WishlistView() {
  const { handles, hydrated, remove, scope } = useWishlist();
  const { configured, user } = useAuth();
  const { addLine } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const key = handles.join(',');

  useEffect(() => {
    if (!hydrated) return;
    if (!handles.length) return setProducts([]);
    let cancelled = false;
    setError(false);
    fetch(`/api/products?handles=${handles.map(encodeURIComponent).join(',')}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: { products: Product[] }) => !cancelled && setProducts(d.products))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, hydrated]);

  const signInPrompt =
    !user &&
    (configured ? (
      <p className="note">
        <Icon name="info" size={16} />
        <span>
          Saved on this device only. <Link href="/account/login?next=/wishlist">Sign in</Link> or <Link href="/account/register">create an account</Link> to keep your wishlist across devices. Items saved now will be added to your account.
        </span>
      </p>
    ) : (
      <p className="note">
        <Icon name="info" size={16} /> Saved on this device. Accounts are not connected in this development build yet.
      </p>
    ));

  if (!hydrated || (products === null && !error)) {
    return (
      <ul className="product-grid product-grid--four" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="skeleton" style={{ aspectRatio: '4 / 5' }} />
        ))}
      </ul>
    );
  }

  if (error) return <FormStatus tone="error">Your saved items could not be loaded. Please refresh the page.</FormStatus>;

  if (!products?.length) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Nothing saved yet.</p>
        <p>Tap the heart on any product to keep it here while you decide.</p>
        <Link href="/" className="button button--primary">
          See the room sets
        </Link>
        {signInPrompt}
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist__bar">
        <p className="muted">
          {products.length} saved {products.length === 1 ? 'item' : 'items'}
          {scope === 'account' ? ' in your account' : ''}
        </p>
        {signInPrompt}
      </div>
      <ul className="product-grid product-grid--four">
        {products.map((p) => {
          const v = defaultVariant(p);
          const simple = p.variants.length === 1;
          return (
            <li key={p.id} className="wishlist__item">
              <ProductCard product={p} showQuickAdd={false} />
              <div className="wishlist__actions">
                {v.availableForSale ? (
                  simple ? (
                    <button
                      type="button"
                      className="button button--primary button--small"
                      onClick={() => {
                        addLine(toCartLine(p, v));
                        remove(p.handle, p.title);
                      }}
                    >
                      Move to basket
                    </button>
                  ) : (
                    <Link href={productHref(p.handle)} className="button button--primary button--small">
                      Choose options
                    </Link>
                  )
                ) : (
                  <span className="muted">Currently unavailable</span>
                )}
                <button type="button" className="text-button" onClick={() => remove(p.handle, p.title)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
