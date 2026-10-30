import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/config/site';
import { REFERRAL } from '@/lib/content/members';
import { isEmailConfigured, sendEmail } from '@/lib/email/send';
import { referralInviteEmail } from '@/lib/email/templates';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/validation';

/**
 * A member invites a friend by email. The invite is recorded so the friend is
 * linked to the member when they sign up with that address, even without the
 * referral link. Limited per day so the form cannot be used to send spam.
 */
export async function POST(request: Request) {
  if (!REFERRAL.enabled) return NextResponse.json({ status: 'disabled' }, { status: 404 });
  const user = await getCurrentUser();
  if (!user?.email) return NextResponse.json({ status: 'signed-out' }, { status: 401 });
  if (!user.email_confirmed_at) return NextResponse.json({ status: 'unverified', message: 'Confirm your email address before inviting friends.' }, { status: 403 });
  const admin = getSupabaseAdminClient();
  if (!admin || !isEmailConfigured()) return NextResponse.json({ status: 'not-configured' }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { email?: string; note?: string } | null;
  const email = (body?.email ?? '').trim().toLowerCase();
  const note = (body?.note ?? '').trim().slice(0, 280) || null;
  const invalid = validateEmail(email);
  if (invalid) return NextResponse.json({ status: 'error', message: invalid }, { status: 400 });
  if (email === user.email.toLowerCase()) return NextResponse.json({ status: 'error', message: 'That is your own email address.' }, { status: 400 });

  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count } = await admin.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).eq('source', 'email').gte('created_at', since);
  if ((count ?? 0) >= REFERRAL.invitesPerDay) {
    return NextResponse.json({ status: 'error', message: `You can send ${REFERRAL.invitesPerDay} invites a day. Please try again tomorrow.` }, { status: 429 });
  }

  const { data: profile } = await admin.from('profiles').select('first_name,referral_code').eq('id', user.id).single();
  const { error } = await admin.from('referrals').insert({ referrer_id: user.id, invited_email: email, source: 'email', status: 'invited' });
  if (error?.code === '23505') return NextResponse.json({ status: 'already', message: 'You have already invited this person.' });
  if (error || !profile?.referral_code) return NextResponse.json({ status: 'error', message: 'The invite could not be sent. Please try again.' }, { status: 500 });

  const fromName = profile.first_name || 'A friend';
  const sent = await sendEmail(email, referralInviteEmail({ fromName, link: `${SITE_URL}/r/${profile.referral_code}`, note }), { replyTo: user.email, tag: 'referral-invite' });
  if (!sent.ok) {
    await admin.from('referrals').delete().eq('referrer_id', user.id).eq('invited_email', email).eq('status', 'invited');
    return NextResponse.json({ status: 'error', message: 'The invite could not be sent. Please try again.' }, { status: 502 });
  }
  return NextResponse.json({ status: 'sent' });
}
