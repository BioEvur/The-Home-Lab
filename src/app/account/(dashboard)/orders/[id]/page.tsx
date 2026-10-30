import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderForUser } from '@/lib/commerce/orders';
import { loadMember } from '@/lib/members/account';
import { AccountSetupState } from '@/components/account/SetupState';
import { OrderStatus, OrderTimeline, orderDate, orderMoney, orderState } from '@/components/account/OrderBits';
import { FormStatus } from '@/components/forms/Field';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Order details', robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { configured, user } = await loadMember();
  if (!configured) return <AccountSetupState feature="Your order details" />;
  if (!user) return null;
  const result = await getOrderForUser(user, id);
  if (result.status === 'not-found') notFound();

  const back = (
    <Link href="/account/orders" className="text-button order-detail__back">
      <Icon name="arrow-left" size={16} /> All orders
    </Link>
  );
  if (result.status !== 'ok') {
    return (
      <section>
        {back}
        <FormStatus tone={result.status === 'error' ? 'error' : 'info'}>
          {result.status === 'error' ? 'We could not load this order just now. Please try again later.' : 'Order details appear here once the shop opens for orders.'}
        </FormStatus>
      </section>
    );
  }

  const o = result.order;
  const state = orderState(o);
  const totals = [
    o.subtotal && { label: 'Subtotal', value: orderMoney(o.subtotal) },
    o.discounts && Number(o.discounts.amount) > 0 && { label: 'Discounts', value: `−${orderMoney(o.discounts)}` },
    o.shipping && { label: 'Delivery', value: Number(o.shipping.amount) ? orderMoney(o.shipping) : 'Free' },
    o.tax && Number(o.tax.amount) > 0 && { label: 'Includes VAT', value: orderMoney(o.tax) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="order-detail" aria-labelledby="order-title">
      {back}
      <header className="order-detail__head">
        <div>
          <h2 id="order-title" className="h2">
            Order {o.name}
          </h2>
          <p className="muted">Placed on {orderDate(o.processedAt)}</p>
        </div>
        <OrderStatus order={o} />
      </header>

      <OrderTimeline step={state.step} />

      {o.tracking.length > 0 && (
        <div className="order-detail__tracking">
          <h3 className="h3">Tracking</h3>
          <ul>
            {o.tracking.map((t, i) => (
              <li key={`${t.number}-${i}`}>
                <span>
                  {t.company ?? 'Courier'}
                  {t.number ? ` · ${t.number}` : ''}
                </span>
                {t.url && (
                  <a href={t.url} target="_blank" rel="noreferrer" className="button button--secondary button--small">
                    Track parcel
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="order-detail__grid">
        <div>
          <h3 className="h3">Items</h3>
          <ul className="order-lines">
            {o.lines.map((l, i) => (
              <li key={`${l.title}-${i}`}>
                {l.image ? <img src={l.image.url} alt={l.image.alt} width={72} height={72} loading="lazy" /> : <span className="order-lines__ph" />}
                <span className="order-lines__text">
                  <span>{l.title}</span>
                  {l.variant && l.variant !== 'Default Title' && <span className="muted">{l.variant}</span>}
                  <span className="muted">Quantity {l.quantity}</span>
                </span>
                <span>{orderMoney(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="order-totals">
            {totals.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>{t.value}</dd>
              </div>
            ))}
            <div className="order-totals__total">
              <dt>Total</dt>
              <dd>{orderMoney(o.total)}</dd>
            </div>
          </dl>
        </div>
        <aside className="order-detail__aside">
          {o.shippingAddress && (
            <div>
              <h3 className="h3">Delivering to</h3>
              <address>
                {o.shippingAddress.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
          )}
          <div>
            <h3 className="h3">Need help?</h3>
            <p className="muted">Questions about this order, delivery or a return.</p>
            <Link href={`/contact?subject=order&order=${encodeURIComponent(o.name)}`} className="button button--secondary button--small">
              Contact us about {o.name}
            </Link>
          </div>
          {o.statusUrl && (
            <a href={o.statusUrl} target="_blank" rel="noreferrer" className="text-button">
              Shopify order status page
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
