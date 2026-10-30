import type { Metadata } from 'next';
import Link from 'next/link';
import { euros } from '@/lib/content/members';
import { loadMember } from '@/lib/members/account';
import { ensureRewardCodes, type MemberOffer, type MemberReward } from '@/lib/members/server';
import { CopyButton } from '@/components/account/MemberTools';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Offers and rewards', robots: { index: false } };

const day = (iso: string) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
const STATUS: Record<MemberReward['status'], string> = { available: 'Ready to use', pending: 'On its way', used: 'Used', expired: 'Expired' };

export default async function OffersPage() {
  const { configured, user, supabase } = await loadMember();
  if (!configured) return <AccountSetupState feature="Your offers and rewards" />;
  if (!user || !supabase) return null;
  await ensureRewardCodes(user.id).catch(() => undefined);
  const [{ data: rewardRows }, { data: offerRows }] = await Promise.all([
    supabase.from('member_rewards').select('id,kind,title,amount_cents,code,status,expires_at,created_at').order('created_at', { ascending: false }),
    supabase.from('member_offers').select('id,title,description,discount_label,code,terms,href,ends_at').order('sort'),
  ]);
  const rewards = (rewardRows ?? []) as MemberReward[];
  const offers = (offerRows ?? []) as MemberOffer[];
  const open = rewards.filter((r) => r.status === 'available' || r.status === 'pending');
  const past = rewards.filter((r) => r.status === 'used' || r.status === 'expired');

  return (
    <div className="account-stack">
      <section aria-labelledby="rewards-title">
        <h2 id="rewards-title" className="h2 account__title">
          Your rewards
        </h2>
        {open.length ? (
          <ul className="reward-list">
            {open.map((r) => (
              <li key={r.id} className={`reward reward--${r.status}`}>
                <div className="reward__amount">{euros(r.amount_cents)}</div>
                <div className="reward__body">
                  <p className="reward__title">{r.title}</p>
                  <p className="muted">
                    {STATUS[r.status]}
                    {r.expires_at && r.status === 'available' ? ` · use by ${day(r.expires_at)}` : ''}
                    {r.status === 'pending' ? ' · your code appears here when the shop opens for orders' : ''}
                  </p>
                </div>
                {r.code && r.status === 'available' && (
                  <div className="reward__code">
                    <code>{r.code}</code>
                    <CopyButton value={r.code} label="Copy code" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="dash-empty">
            <p>No rewards yet. Refer a friend and you get credit once their first order ships.</p>
            <Link href="/account/referrals" className="button button--secondary button--small">
              Refer a friend
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="offers-title">
        <h2 id="offers-title" className="h2 account__title">
          Member offers
        </h2>
        {offers.length ? (
          <ul className="offer-list">
            {offers.map((o) => (
              <li key={o.id} className="offer">
                {o.discount_label && <p className="offer__label">{o.discount_label}</p>}
                <h3 className="h3">{o.title}</h3>
                <p>{o.description}</p>
                {o.code && (
                  <div className="reward__code">
                    <code>{o.code}</code>
                    <CopyButton value={o.code} label="Copy code" />
                  </div>
                )}
                <p className="muted offer__terms">
                  {o.ends_at ? `Ends ${day(o.ends_at)}. ` : ''}
                  {o.terms}
                </p>
                {o.href && (
                  <Link href={o.href} className="text-button">
                    Shop the offer
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="dash-empty">
            <p>No member offers are running right now. When we run one, it appears here first, and we email members who have opted in.</p>
            <Link href="/account/preferences" className="text-button">
              Check your email preferences
            </Link>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-title">
          <h3 id="past-title" className="h3">
            Used and expired
          </h3>
          <ul className="past-list">
            {past.map((r) => (
              <li key={r.id}>
                <span>{r.title}</span>
                <span className="muted">{STATUS[r.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
