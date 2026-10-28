import type { Metadata } from 'next';
import Link from 'next/link';
import { getOrdersForUser } from '@/lib/commerce/orders';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCurrentUser } from '@/lib/supabase/server';
import { AccountSetupState } from '@/components/account/SetupState';
import { FormStatus } from '@/components/forms/Field';

export const metadata: Metadata = { title: 'Orders', robots: { index: false } };

const fmtDate = (iso: string) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
const fmtMoney = (m: { amount: string; currencyCode: string }) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: m.currencyCode }).format(Number(m.amount));
const humanise = (s: string | null) => (s ? s.toLowerCase().replace(/_/g, ' ') : '—');

export default async function OrdersPage() {
  if (!isSupabaseConfigured()) return <AccountSetupState feature="Your order history" />;
  const user = await getCurrentUser();
  if (!user) return null;
  const result = await getOrdersForUser(user);

  return (
    <section aria-labelledby="orders-title">
      <h2 id="orders-title" className="h2 account__title">
        Orders
      </h2>
      {result.status === 'not-configured' && (
        <FormStatus tone="info">Order history will appear here once the store is connected to Shopify. No orders can be placed in this development build.</FormStatus>
      )}
      {result.status === 'unverified' && <FormStatus tone="info">Please confirm your email address to see orders linked to it.</FormStatus>}
      {result.status === 'error' && <FormStatus tone="error">We could not load your orders just now. Please try again later.</FormStatus>}
      {result.status === 'ok' && result.orders.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">No orders yet.</p>
          <p>Orders placed with {user.email} will appear here.</p>
          <Link href="/" className="button button--primary">
            See the room sets
          </Link>
        </div>
      )}
      {result.status === 'ok' && result.orders.length > 0 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Date</th>
              <th scope="col">Payment</th>
              <th scope="col">Fulfilment</th>
              <th scope="col">Total</th>
              <th scope="col">
                <span className="visually-hidden">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {result.orders.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{fmtDate(o.processedAt)}</td>
                <td>{humanise(o.financialStatus)}</td>
                <td>{humanise(o.fulfillmentStatus)}</td>
                <td>{fmtMoney(o.total)}</td>
                <td>{o.statusUrl && <a href={o.statusUrl}>Track</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
