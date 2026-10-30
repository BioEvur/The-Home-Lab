import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { isShopifyAdminConfigured } from '@/lib/commerce/config';
import { adminFetch } from '@/lib/commerce/shopify/client';
import { REFERRAL, euros } from '@/lib/content/members';
import { sendEmail } from '@/lib/email/send';
import { referralRewardEmail, welcomeEmail } from '@/lib/email/templates';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export interface MemberProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  member_number: number | null;
  birthday_day: number | null;
  birthday_month: number | null;
  favourite_sets: string[];
  email_product_updates: boolean;
  email_batch_reminders: boolean;
  email_launch_alerts: boolean;
  referral_code: string | null;
  referred_by: string | null;
  welcome_sent_at: string | null;
  created_at: string;
}

export interface MemberReward {
  id: string;
  kind: 'referral' | 'referred_welcome' | 'birthday' | 'goodwill';
  title: string;
  amount_cents: number;
  code: string | null;
  status: 'pending' | 'available' | 'used' | 'expired';
  expires_at: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  invited_email: string | null;
  source: 'link' | 'email';
  status: 'invited' | 'joined' | 'ordered' | 'rewarded';
  created_at: string;
  joined_at: string | null;
  ordered_at: string | null;
}

export interface MemberOffer {
  id: string;
  title: string;
  description: string;
  discount_label: string | null;
  code: string | null;
  terms: string | null;
  href: string | null;
  ends_at: string | null;
}

export const PROFILE_COLUMNS =
  'id,first_name,last_name,phone,email,member_number,birthday_day,birthday_month,favourite_sets,email_product_updates,email_batch_reminders,email_launch_alerts,referral_code,referred_by,welcome_sent_at,created_at';

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();
  return (data as MemberProfile | null) ?? null;
}

/**
 * Creates a single-use Shopify discount code worth `cents` for one customer.
 * Returns null while Shopify is not connected or if Shopify rejects it, so the
 * reward stays "pending" and is retried the next time the member looks.
 */
export async function issueDiscountCode({ prefix, title, cents, days = 365 }: { prefix: string; title: string; cents: number; days?: number }) {
  if (!isShopifyAdminConfigured()) return null;
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const random = Array.from(crypto.getRandomValues(new Uint8Array(6)), (n) => alphabet[n % alphabet.length]).join('');
  const code = `${prefix}-${random}`;
  const endsAt = new Date(Date.now() + days * 86_400_000).toISOString();
  try {
    const data = await adminFetch<{ discountCodeBasicCreate: { codeDiscountNode: { id: string } | null; userErrors: { message: string }[] } }>(
      `mutation($d: DiscountCodeBasicInput!) { discountCodeBasicCreate(basicCodeDiscount: $d) { codeDiscountNode { id } userErrors { message } } }`,
      {
        d: {
          title,
          code,
          startsAt: new Date().toISOString(),
          endsAt,
          context: { all: 'ALL' },
          customerGets: { value: { discountAmount: { amount: (cents / 100).toFixed(2), appliesOnEachItem: false } }, items: { all: true } },
          appliesOncePerCustomer: true,
          usageLimit: 1,
        },
      },
    );
    if (!data.discountCodeBasicCreate.codeDiscountNode) {
      console.error('[members] discount code rejected', data.discountCodeBasicCreate.userErrors);
      return null;
    }
    return { code, expiresAt: endsAt };
  } catch (err) {
    console.error('[members] discount code failed', err);
    return null;
  }
}

/** Gives pending rewards a Shopify code once Shopify is connected. */
export async function ensureRewardCodes(userId: string) {
  const admin = getSupabaseAdminClient();
  if (!admin || !isShopifyAdminConfigured()) return;
  const { data } = await admin.from('member_rewards').select('id,kind,title,amount_cents').eq('user_id', userId).eq('status', 'pending').is('code', null);
  // Referral credit rows only exist once the friend's order has shipped, so every pending row is due a code.
  for (const r of data ?? []) {
    const prefix = r.kind === 'referred_welcome' ? 'FRIEND' : r.kind === 'referral' ? 'THANKS' : 'THL';
    const issued = await issueDiscountCode({ prefix, title: r.title, cents: r.amount_cents });
    if (issued) await admin.from('member_rewards').update({ code: issued.code, status: 'available', expires_at: issued.expiresAt }).eq('id', r.id);
  }
}

/**
 * Runs once, after a member confirms their email: sends the welcome email and,
 * for referred members, records their first-order offer.
 */
export async function welcomeMember(user: User) {
  const admin = getSupabaseAdminClient();
  if (!admin || !user.email_confirmed_at || !user.email) return;
  const { data: claimed } = await admin
    .from('profiles')
    .update({ welcome_sent_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('welcome_sent_at', null)
    .select('first_name,referral_code,referred_by')
    .maybeSingle();
  if (!claimed) return; // Already welcomed.

  if (REFERRAL.enabled && claimed.referred_by) {
    const { count } = await admin.from('member_rewards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('kind', 'referred_welcome');
    if (!count) {
      await admin.from('member_rewards').insert({
        user_id: user.id,
        kind: 'referred_welcome',
        title: `${euros(REFERRAL.friendCents)} off your first order`,
        amount_cents: REFERRAL.friendCents,
      });
      await ensureRewardCodes(user.id);
    }
  }
  await sendEmail(user.email, welcomeEmail({ firstName: claimed.first_name, referralCode: claimed.referral_code }), { tag: 'welcome' });
}

/**
 * Shopify webhook (orders/fulfilled): when a referred member's first order
 * ships, the friend who referred them earns their credit.
 */
export async function recordReferralOrder(email: string) {
  const admin = getSupabaseAdminClient();
  if (!admin || !REFERRAL.enabled) return;
  const { data: member } = await admin.from('profiles').select('id,referred_by').eq('email', email.toLowerCase()).maybeSingle();
  if (!member?.referred_by) return;
  const { data: referral } = await admin
    .from('referrals')
    .update({ status: 'ordered', ordered_at: new Date().toISOString() })
    .eq('referred_user_id', member.id)
    .eq('status', 'joined')
    .select('id,referrer_id')
    .maybeSingle();
  if (!referral) return; // Not their first shipped order, or already rewarded.

  const title = `${euros(REFERRAL.memberCents)} credit for referring a friend`;
  const issued = await issueDiscountCode({ prefix: 'THANKS', title, cents: REFERRAL.memberCents });
  await admin.from('member_rewards').insert({
    user_id: referral.referrer_id,
    kind: 'referral',
    title,
    amount_cents: REFERRAL.memberCents,
    referral_id: referral.id,
    code: issued?.code ?? null,
    status: issued ? 'available' : 'pending',
    expires_at: issued?.expiresAt ?? null,
  });
  await admin.from('referrals').update({ status: 'rewarded', rewarded_at: new Date().toISOString() }).eq('id', referral.id);

  if (issued) {
    const { data: referrer } = await admin.from('profiles').select('first_name,email').eq('id', referral.referrer_id).maybeSingle();
    if (referrer?.email) {
      const expires = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(issued.expiresAt));
      await sendEmail(referrer.email, referralRewardEmail({ firstName: referrer.first_name, code: issued.code, expires }), { tag: 'referral-reward' });
    }
  }
}
