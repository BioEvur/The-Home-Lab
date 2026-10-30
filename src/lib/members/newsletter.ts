import 'server-only';
import { SITE_URL } from '@/lib/config/site';
import { isEmailConfigured, sendEmail, unsubscribeNewsletterContact, upsertNewsletterContact } from '@/lib/email/send';
import { newsletterConfirmEmail, newsletterWelcomeEmail } from '@/lib/email/templates';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Newsletter with double opt-in. A sign-up is stored with its consent wording,
 * then confirmed from a link in an email. Only confirmed, subscribed addresses
 * are added to the Resend audience that newsletters are sent to.
 * Members subscribing from their account have a verified email, so they are
 * confirmed straight away.
 */
export const CONSENT_TEXT = 'I would like to receive emails from The Home Lab. I can unsubscribe at any time.';

export type SubscribeStatus = 'check-email' | 'subscribed' | 'already' | 'not-configured' | 'error';

interface Row {
  id: string;
  email: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  unsubscribe_token: string;
}

const unsubscribeUrl = (token: string) => `${SITE_URL}/newsletter/unsubscribe?token=${token}`;

async function findByEmail(email: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const { data } = await admin.from('newsletter_subscribers').select('id,email,confirmed_at,unsubscribed_at,unsubscribe_token').eq('email', email.toLowerCase()).maybeSingle();
  return (data as Row | null) ?? null;
}

async function activate(row: Pick<Row, 'email' | 'unsubscribe_token'>, firstName?: string | null, welcome = true) {
  await upsertNewsletterContact(row.email, firstName);
  if (welcome) await sendEmail(row.email, newsletterWelcomeEmail({ unsubscribeUrl: unsubscribeUrl(row.unsubscribe_token) }), { tag: 'newsletter-welcome' });
}

export async function requestSubscription(email: string, source: string): Promise<SubscribeStatus> {
  const admin = getSupabaseAdminClient();
  if (!admin) return 'not-configured';
  const existing = await findByEmail(email);
  if (existing?.confirmed_at && !existing.unsubscribed_at) return 'already';

  // Without an email provider there is no way to confirm, so the consent given in the form is recorded as is.
  const doubleOptIn = isEmailConfigured();
  const fields = {
    email,
    consent_text: CONSENT_TEXT,
    source: source.slice(0, 40),
    unsubscribed_at: null,
    confirm_token: doubleOptIn ? crypto.randomUUID() : null,
    confirm_sent_at: doubleOptIn ? new Date().toISOString() : null,
    confirmed_at: doubleOptIn ? null : new Date().toISOString(),
  };
  const { data, error } = existing
    ? await admin.from('newsletter_subscribers').update(fields).eq('id', existing.id).select('confirm_token,unsubscribe_token,email').single()
    : await admin.from('newsletter_subscribers').insert(fields).select('confirm_token,unsubscribe_token,email').single();
  if (error || !data) return 'error';
  if (!doubleOptIn) return 'subscribed';

  const sent = await sendEmail(email, newsletterConfirmEmail({ confirmUrl: `${SITE_URL}/newsletter/confirm?token=${data.confirm_token}` }), { tag: 'newsletter-confirm' });
  return sent.ok ? 'check-email' : 'error';
}

export async function confirmSubscription(token: string): Promise<'confirmed' | 'invalid' | 'not-configured'> {
  const admin = getSupabaseAdminClient();
  if (!admin) return 'not-configured';
  if (!/^[0-9a-f-]{36}$/i.test(token)) return 'invalid';
  const { data } = await admin
    .from('newsletter_subscribers')
    .update({ confirmed_at: new Date().toISOString(), confirm_token: null })
    .eq('confirm_token', token)
    .select('email,unsubscribe_token')
    .maybeSingle();
  if (!data) return 'invalid';
  await activate(data as Row);
  return 'confirmed';
}

export async function unsubscribeByToken(token: string): Promise<'unsubscribed' | 'invalid' | 'not-configured'> {
  const admin = getSupabaseAdminClient();
  if (!admin) return 'not-configured';
  if (!/^[0-9a-f-]{36}$/i.test(token)) return 'invalid';
  const { data } = await admin
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('email')
    .maybeSingle();
  if (!data) return 'invalid';
  await unsubscribeNewsletterContact(data.email as string);
  return 'unsubscribed';
}

/** Newsletter state for a signed-in member, by their verified email. */
export async function getMemberSubscription(email: string) {
  const row = await findByEmail(email);
  return { subscribed: Boolean(row?.confirmed_at && !row.unsubscribed_at), pending: Boolean(row && !row.confirmed_at && !row.unsubscribed_at) };
}

export async function setMemberSubscription({ email, userId, firstName, subscribed }: { email: string; userId: string; firstName?: string | null; subscribed: boolean }) {
  const admin = getSupabaseAdminClient();
  if (!admin) return false;
  const existing = await findByEmail(email);
  if (!subscribed) {
    if (!existing) return true;
    await admin.from('newsletter_subscribers').update({ unsubscribed_at: new Date().toISOString() }).eq('id', existing.id);
    await unsubscribeNewsletterContact(existing.email);
    return true;
  }
  if (existing?.confirmed_at && !existing.unsubscribed_at) return true;
  const fields = { email, user_id: userId, consent_text: CONSENT_TEXT, source: 'account', confirmed_at: new Date().toISOString(), confirm_token: null, unsubscribed_at: null };
  const { data, error } = existing
    ? await admin.from('newsletter_subscribers').update(fields).eq('id', existing.id).select('email,unsubscribe_token').single()
    : await admin.from('newsletter_subscribers').insert(fields).select('email,unsubscribe_token').single();
  if (error || !data) return false;
  // Someone switching the newsletter back on has already had the welcome email.
  await activate(data as Row, firstName, !existing?.confirmed_at);
  return true;
}

/** Account deletion: removes the newsletter record entirely. */
export async function eraseSubscription(email: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) return;
  await unsubscribeNewsletterContact(email);
  await admin.from('newsletter_subscribers').delete().eq('email', email.toLowerCase());
}
