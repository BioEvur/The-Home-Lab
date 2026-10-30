import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { REFERRAL, euros } from '@/lib/content/members';
import { ROOM_SETS } from '@/lib/content/sets';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { RememberReferral } from '@/components/account/RememberReferral';

export const metadata: Metadata = { title: 'An offer from a friend', robots: { index: false } };
export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-Z0-9-]{4,20}$/;

/** Landing page for a member's referral link: remembers the code and explains the offer. */
export default async function ReferralLanding({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase();
  if (!REFERRAL.enabled || !CODE_RE.test(code)) redirect('/');

  const admin = getSupabaseAdminClient();
  const { data } = admin ? await admin.from('profiles').select('first_name').eq('referral_code', code).maybeSingle() : { data: null };
  if (admin && !data) redirect('/');
  const name = (data?.first_name as string | null) ?? 'A friend';
  const sets = ROOM_SETS.filter((s) => s.status === 'available');

  return (
    <div className="container section referral-landing">
      <RememberReferral code={code} days={REFERRAL.cookieDays} />
      <p className="referral-landing__from">{name} sent you an offer</p>
      <h1 className="h1">{euros(REFERRAL.friendCents)} off your first room set</h1>
      <p className="lead">
        Create a free account through this link and {euros(REFERRAL.friendCents)} comes off your first order. Your code appears in your account once your email is
        confirmed.
      </p>
      <div className="referral-landing__actions">
        <Link href={`/account/register?ref=${code}`} className="button button--primary">
          Create an account
        </Link>
        <Link href="/" className="button button--secondary">
          See the room sets first
        </Link>
      </div>
      <ul className="referral-landing__sets">
        {sets.map((s) => (
          <li key={s.handle}>
            <Link href={`/sets/${s.handle}`}>
              <span className="h3">{s.title}</span>
              <span className="muted">{s.kicker}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
