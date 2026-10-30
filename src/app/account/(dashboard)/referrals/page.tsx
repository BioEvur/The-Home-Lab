import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/config/site';
import { REFERRAL, euros } from '@/lib/content/members';
import { loadMember } from '@/lib/members/account';
import type { Referral } from '@/lib/members/server';
import { InviteForm, ReferralShare } from '@/components/account/MemberTools';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Refer a friend', robots: { index: false } };

const day = (iso: string) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short' }).format(new Date(iso));
const STATUS: Record<Referral['status'], string> = { invited: 'Invited', joined: 'Joined', ordered: 'Ordered', rewarded: 'You earned credit' };

export default async function ReferralsPage() {
  if (!REFERRAL.enabled) notFound();
  const { configured, user, profile, supabase } = await loadMember();
  if (!configured) return <AccountSetupState feature="Your referral link" />;
  if (!user || !supabase || !profile?.referral_code) return null;
  const { data } = await supabase.from('referrals').select('id,invited_email,source,status,created_at,joined_at,ordered_at').order('created_at', { ascending: false });
  const referrals = (data ?? []) as Referral[];
  const joined = referrals.filter((r) => r.status !== 'invited').length;
  const rewarded = referrals.filter((r) => r.status === 'rewarded').length;
  const link = `${SITE_URL}/r/${profile.referral_code}`;

  return (
    <div className="account-stack">
      <section className="refer-hero" aria-labelledby="refer-title">
        <h2 id="refer-title" className="h2">
          Give {euros(REFERRAL.friendCents)}, get {euros(REFERRAL.memberCents)}
        </h2>
        <p className="lead">
          Share your link. Friends get {euros(REFERRAL.friendCents)} off their first order, and you get {euros(REFERRAL.memberCents)} credit once that order ships.
        </p>
        <ReferralShare link={link} />
      </section>

      <ul className="dash-stats dash-stats--three">
        <li className="dash-stat">
          <span className="dash-stat__value">{referrals.length}</span>
          <span className="dash-stat__label">Friends invited or joined</span>
        </li>
        <li className="dash-stat">
          <span className="dash-stat__value">{joined}</span>
          <span className="dash-stat__label">Joined</span>
        </li>
        <li className="dash-stat">
          <span className="dash-stat__value">{euros(rewarded * REFERRAL.memberCents)}</span>
          <span className="dash-stat__label">Credit earned</span>
        </li>
      </ul>

      <div className="refer-grid">
        <section aria-labelledby="invite-title">
          <h3 id="invite-title" className="h3">
            Invite by email
          </h3>
          <InviteForm />
        </section>
        <section aria-labelledby="how-title">
          <h3 id="how-title" className="h3">
            How it works
          </h3>
          <ol className="steps">
            <li>Your friend opens your link and creates an account.</li>
            <li>Their {euros(REFERRAL.friendCents)} code appears in their account once their email is confirmed.</li>
            <li>When their first order ships, your {euros(REFERRAL.memberCents)} code appears under Offers and rewards, and we email it to you.</li>
          </ol>
          <p className="field__hint">
            One reward per friend, for new customers only. Codes are single use and last a year. You cannot refer yourself.
          </p>
        </section>
      </div>

      <section aria-labelledby="friends-title">
        <h3 id="friends-title" className="h3">
          Your friends
        </h3>
        {referrals.length ? (
          <ul className="past-list">
            {referrals.map((r) => (
              <li key={r.id}>
                <span>{r.invited_email ?? 'A friend who used your link'}</span>
                <span className="muted">
                  {STATUS[r.status]} · {day(r.ordered_at ?? r.joined_at ?? r.created_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nobody yet. Friends appear here as soon as they join with your link or you invite them.</p>
        )}
      </section>
    </div>
  );
}
