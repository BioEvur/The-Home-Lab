import type { OrderSummary } from '@/lib/commerce/orders';

/** Shared order formatting for the overview, the order list and order details. */
export const orderDate = (iso: string) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

export const orderMoney = (m: { amount: string; currencyCode: string }) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: m.currencyCode, minimumFractionDigits: Number(m.amount) % 1 ? 2 : 0 }).format(Number(m.amount));

type Tone = 'done' | 'active' | 'muted' | 'alert';

/** Plain-English status from Shopify's payment and fulfilment states. */
export function orderState(o: Pick<OrderSummary, 'financialStatus' | 'fulfillmentStatus'> & { cancelledAt?: string | null }): { label: string; tone: Tone; step: number } {
  const pay = o.financialStatus ?? '';
  const ful = o.fulfillmentStatus ?? '';
  if (o.cancelledAt) return { label: 'Cancelled', tone: 'muted', step: -1 };
  if (pay === 'REFUNDED') return { label: 'Refunded', tone: 'muted', step: -1 };
  if (ful === 'FULFILLED') return { label: 'Shipped', tone: 'done', step: 3 };
  if (ful === 'PARTIALLY_FULFILLED') return { label: 'Partly shipped', tone: 'active', step: 3 };
  if (pay === 'PENDING' || pay === 'AUTHORIZED') return { label: 'Awaiting payment', tone: 'alert', step: 0 };
  if (ful === 'ON_HOLD') return { label: 'On hold', tone: 'alert', step: 2 };
  return { label: 'Confirmed, being prepared', tone: 'active', step: 2 };
}

export function OrderStatus({ order }: { order: Pick<OrderSummary, 'financialStatus' | 'fulfillmentStatus'> & { cancelledAt?: string | null } }) {
  const s = orderState(order);
  return <span className={`status-pill status-pill--${s.tone}`}>{s.label}</span>;
}

const STEPS = ['Ordered', 'Payment received', 'Being prepared', 'Shipped'];

export function OrderTimeline({ step }: { step: number }) {
  if (step < 0) return null;
  return (
    <ol className="order-timeline" aria-label="Order progress">
      {STEPS.map((label, i) => (
        <li key={label} className={i <= step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
          <span className="order-timeline__dot" aria-hidden="true" />
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
