import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewArrivals, getProductsByHandles } from '@/lib/commerce';
import { getOrdersForUser } from '@/lib/commerce/orders';
import { currentBatch, formatDay } from '@/lib/content/batches';
import { REFERRAL, euros } from '@/lib/content/members';
import { SITE_URL } from '@/lib/config/site';
import { productHref } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { loadMember } from '@/lib/members/account';
import { ensureRewardCodes, type MemberOffer, type MemberReward } from '@/lib/members/server';
import { CopyButton } from '@/components/account/MemberTools';
import { RecentlyViewed } from '@/components/account/RecentlyViewed';
import { AccountSetupState } from '@/components/account/SetupState';
import { OrderStatus, orderDate, orderMoney } from '@/components/account/OrderBits';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export const metadata: Metadata = { title: 'Your account', robots: { index: false } };

const TILES = [
  { href: '/account/orders', title: 'Orders', body: 'Track recent orders and see past purchases.' },
  { href: '/account/addresses', title: 'Addresses', body: 'Save delivery addresses for a faster checkout.' },
  { href: '/account/offers', title: 'Offers and rewards', body: 'Member offers and the codes you have earned.' },
  { href: '/account/wishlist', title: 'Wishlist', body: 'Everything you have saved, on any device.' },
];

function daysUntil(iso: string) {
  const today = new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(new Date()));
  return Math.round((new Date(iso).getTime() - today.getTime()) / 86_400_000);
}

export default async function AccountPage() {
  const { configured, user, profile, supabase } = await loadMember();
  if (!configured || !user || !supabase) {
    return (
      <>
        <AccountSetupState feature="Your account overview" />
        <ul className="account-tiles">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="account-tile">
                <span className="h3">{t.title}</span>
                <span className="muted">{t.body}</span>
                <Icon name="arrow-right" />
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  await ensureRewardCodes(user.id).catch(() => undefined);
  const [orders, wishlist, rewards, offers, referrals, arrivals] = await Promise.all([
    getOrdersForUser(user),
    supabase.from('wishlist_items').select('product_handle', { count: 'exact' }).order('created_at', { ascending: false }).limit(4),
    supabase.from('member_rewards').select('id,kind,title,amount_cents,code,status,expires_at,created_at').in('status', ['available', 'pending']),
    supabase.from('member_offers').select('id,title,description,discount_label,code,terms,href,ends_at').order('sort').limit(2),
    supabase.from('referrals').select('id', { count: 'exact', head: true }).in('status', ['joined', 'ordered', 'rewarded']),
    getNewArrivals(12),
  ]);

  const orderList = orders.status === 'ok' ? orders.orders : [];
  const latest = orderList[0];
  const saved = await getProductsByHandles((wishlist.data ?? []).map((r) => r.product_handle as string));
  const myRewards = (rewards.data ?? []) as MemberReward[];
  const available = myRewards.filter((r) => r.status === 'available');
  const liveOffers = (offers.data ?? []) as MemberOffer[];
  const newIn = arrivals.filter((p) => p.variants.some((v) => v.availableForSale)).slice(0, 3);
  const batch = currentBatch();
  const left = batch ? daysUntil(batch.ordersClose) : null;

  const todo = [
    !profile?.phone && { href: '/account/profile', label: 'Add a phone number for the courier' },
    !profile?.birthday_month && { href: '/account/profile', label: 'Add your birthday' },
    !(profile?.favourite_sets?.length) && { href: '/account/profile', label: 'Choose the sets you like' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="dashboard">
      {batch && left !== null && left >= 0 && (
        <div className="dash-batch">
          <Icon name="truck" size={22} />
          <p>
            <strong>
              {batch.name} orders close {formatDay(batch.ordersClose)}
              {left <= 14 ? ` (${left === 0 ? 'today' : left === 1 ? '1 day left' : `${left} days left`})` : ''}.
            </strong>{' '}
            Every set in the batch ships by {formatDay(batch.shipsBy)}.
          </p>
          <Link href="/shop" className="text-button">
            Shop the sets
          </Link>
        </div>
      )}

      <ul className="dash-stats">
        <li>
          <Link href="/account/orders" className="dash-stat">
            <span className="dash-stat__value">{orders.status === 'ok' ? orderList.length : '–'}</span>
            <span className="dash-stat__label">{orderList.length === 1 ? 'Order' : 'Orders'}</span>
          </Link>
        </li>
        <li>
          <Link href="/account/wishlist" className="dash-stat">
            <span className="dash-stat__value">{wishlist.count ?? 0}</span>
            <span className="dash-stat__label">Saved</span>
          </Link>
        </li>
        <li>
          <Link href="/account/offers" className="dash-stat">
            <span className="dash-stat__value">{available.length ? euros(available.reduce((n, r) => n + r.amount_cents, 0)) : '€0'}</span>
            <span className="dash-stat__label">Rewards to use</span>
          </Link>
        </li>
        {REFERRAL.enabled && (
          <li>
            <Link href="/account/referrals" className="dash-stat">
              <span className="dash-stat__value">{referrals.count ?? 0}</span>
              <span className="dash-stat__label">Friends joined</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="dash-grid">
        <section className="dash-card" aria-labelledby="latest-order">
          <div className="dash-section__head">
            <h2 id="latest-order" className="dash-section__title">
              Latest order
            </h2>
            {latest && (
              <Link href="/account/orders" className="text-button">
                All orders
              </Link>
            )}
          </div>
          {latest ? (
            <Link href={`/account/orders/${latest.number}`} className="order-peek">
              <span className="order-peek__thumbs">
                {latest.images.slice(0, 3).map((img) => (
                  <img key={img.url} src={img.url} alt={img.alt} width={64} height={64} loading="lazy" />
                ))}
              </span>
              <span className="order-peek__body">
                <span className="order-peek__name">
                  {latest.name} · {orderDate(latest.processedAt)}
                </span>
                <OrderStatus order={latest} />
                <span className="muted">
                  {latest.lineCount} {latest.lineCount === 1 ? 'item' : 'items'} · {orderMoney(latest.total)}
                </span>
              </span>
              <Icon name="chevron-right" />
            </Link>
          ) : (
            <div className="dash-empty">
              <p>{orders.status === 'not-configured' ? 'Your orders will show here once the shop opens for orders.' : 'No orders yet.'}</p>
              <Link href="/shop" className="button button--secondary button--small">
                Shop the sets
              </Link>
            </div>
          )}
        </section>

        <section className="dash-card" aria-labelledby="offers-peek">
          <div className="dash-section__head">
            <h2 id="offers-peek" className="dash-section__title">
              Offers and rewards
            </h2>
            <Link href="/account/offers" className="text-button">
              See all
            </Link>
          </div>
          {available.length || liveOffers.length ? (
            <ul className="offer-peek">
              {available.slice(0, 2).map((r) => (
                <li key={r.id}>
                  <span>
                    <strong>{r.title}</strong>
                    <span className="muted">Your code: {r.code}</span>
                  </span>
                  {r.code && <CopyButton value={r.code} label="Copy" />}
                </li>
              ))}
              {liveOffers.slice(0, 2 - Math.min(2, available.length)).map((o) => (
                <li key={o.id}>
                  <span>
                    <strong>{o.discount_label ? `${o.discount_label}: ${o.title}` : o.title}</strong>
                    <span className="muted">{o.description}</span>
                  </span>
                  {o.code && <CopyButton value={o.code} label="Copy" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="dash-empty">
              <p>No member offers running right now. When we run one, it appears here first.</p>
            </div>
          )}
        </section>
      </div>

      {saved.length > 0 && (
        <section className="dash-section" aria-labelledby="saved-peek">
          <div className="dash-section__head">
            <h2 id="saved-peek" className="dash-section__title">
              Your wishlist
            </h2>
            <Link href="/account/wishlist" className="text-button">
              See all {wishlist.count}
            </Link>
          </div>
          <ul className="mini-grid">
            {saved.map((p) => (
              <li key={p.handle}>
                <Link href={productHref(p.handle)} className="mini-card">
                  <span className="mini-card__media">{p.images[0] && <Media src={p.images[0].src} alt={p.images[0].alt} ratio="1 / 1" sizes="160px" />}</span>
                  <span className="mini-card__name">{p.title}</span>
                  <span className="muted">{formatMoney(p.variants[0].price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {REFERRAL.enabled && profile?.referral_code && (
        <section className="dash-refer" aria-labelledby="refer-peek">
          <div>
            <h2 id="refer-peek" className="dash-section__title">
              Give {euros(REFERRAL.friendCents)}, get {euros(REFERRAL.memberCents)}
            </h2>
            <p className="muted">
              Friends get {euros(REFERRAL.friendCents)} off their first order with your link. You get {euros(REFERRAL.memberCents)} credit once it ships.
            </p>
          </div>
          <div className="dash-refer__actions">
            <span className="dash-refer__code">{profile.referral_code}</span>
            <CopyButton value={`${SITE_URL}/r/${profile.referral_code}`} label="Copy link" className="button button--primary button--small" />
            <Link href="/account/referrals" className="text-button">
              Invite by email
            </Link>
          </div>
        </section>
      )}

      {newIn.length > 0 && (
        <section className="dash-section" aria-labelledby="new-peek">
          <div className="dash-section__head">
            <h2 id="new-peek" className="dash-section__title">
              New in
            </h2>
            <Link href="/account/new" className="text-button">
              See everything new
            </Link>
          </div>
          <ul className="mini-grid mini-grid--three">
            {newIn.map((p) => (
              <li key={p.handle}>
                <Link href={productHref(p.handle)} className="mini-card">
                  <span className="mini-card__media">{p.images[0] && <Media src={p.images[0].src} alt={p.images[0].alt} ratio="4 / 5" sizes="(min-width: 900px) 220px, 33vw" />}</span>
                  <span className="mini-card__name">{p.title}</span>
                  <span className="muted">{formatMoney(p.variants[0].price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RecentlyViewed />

      {todo.length > 0 && (
        <section className="dash-card dash-todo" aria-labelledby="todo-title">
          <h2 id="todo-title" className="dash-section__title">
            Finish your profile
          </h2>
          <ul>
            {todo.map((t) => (
              <li key={t.label}>
                <Link href={t.href}>
                  {t.label} <Icon name="arrow-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
