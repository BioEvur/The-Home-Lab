import type { Metadata } from 'next';
import Link from 'next/link';
import { getOrdersForUser } from '@/lib/commerce/orders';
import { loadMember } from '@/lib/members/account';
import { AccountSetupState } from '@/components/account/SetupState';
import { OrderStatus, orderDate, orderMoney } from '@/components/account/OrderBits';
import { FormStatus } from '@/components/forms/Field';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Orders', robots: { index: false } };

export default async function OrdersPage() {
  const { configured, user } = await loadMember();
  if (!configured) return <AccountSetupState feature="Your order history" />;
  if (!user) return null;
  const result = await getOrdersForUser(user);

  return (
    <section aria-labelledby="orders-title">
      <h2 id="orders-title" className="h2 account__title">
        Orders
      </h2>
      {result.status === 'not-configured' && (
        <FormStatus tone="info">Your orders will appear here once the shop opens for orders. Every order placed with {user.email} will be listed.</FormStatus>
      )}
      {result.status === 'unverified' && <FormStatus tone="info">Please confirm your email address to see orders linked to it.</FormStatus>}
      {result.status === 'error' && <FormStatus tone="error">We could not load your orders just now. Please try again later.</FormStatus>}
      {result.status === 'ok' && result.orders.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">No orders yet.</p>
          <p>Orders placed with {user.email} will appear here, with their status and tracking.</p>
          <Link href="/shop" className="button button--primary">
            Shop the sets
          </Link>
        </div>
      )}
      {result.status === 'ok' && result.orders.length > 0 && (
        <ul className="order-list">
          {result.orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.number}`} className="order-row">
                <span className="order-row__thumbs">
                  {o.images.slice(0, 3).map((img) => (
                    <img key={img.url} src={img.url} alt={img.alt} width={56} height={56} loading="lazy" />
                  ))}
                </span>
                <span className="order-row__main">
                  <span className="order-row__name">{o.name}</span>
                  <span className="muted">
                    {orderDate(o.processedAt)} · {o.lineCount} {o.lineCount === 1 ? 'item' : 'items'}
                  </span>
                </span>
                <OrderStatus order={o} />
                <span className="order-row__total">{orderMoney(o.total)}</span>
                <Icon name="chevron-right" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
