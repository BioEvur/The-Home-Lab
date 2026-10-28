'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { formatMoney } from '@/lib/format';
import { Drawer } from '@/components/ui/Drawer';
import { CartLines } from './CartLines';
import { useCart } from './CartProvider';
import { CheckoutButton } from './CheckoutButton';

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, discounts, total, count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title={`Basket${count ? ` (${count})` : ''}`}
      className="cart-drawer"
      footer={
        lines.length ? (
          <div className="cart-drawer__footer">
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
            {discounts.length > 0 && (
              <dl className="summary-row">
                <dt>Total</dt>
                <dd>{formatMoney(total)}</dd>
              </dl>
            )}
            <p className="note">Delivery is calculated at checkout.</p>
            <CheckoutButton />
            <Link href="/cart" className="button button--secondary button--block" onClick={close}>
              View basket
            </Link>
          </div>
        ) : null
      }
    >
      {lines.length ? (
        <CartLines compact onNavigate={close} />
      ) : (
        <div className="empty-state empty-state--drawer">
          <p className="empty-state__title">Your basket is empty.</p>
          <p>Have a look around the shop or start with a room.</p>
          <Link href="/" className="button button--primary" onClick={close}>
            See the room sets
          </Link>
        </div>
      )}
    </Drawer>
  );
}
