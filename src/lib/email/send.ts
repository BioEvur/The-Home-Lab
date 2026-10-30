import 'server-only';
import type { Email } from './templates';

/**
 * Sends email through Resend's HTTP API (no SDK, so it runs on Cloudflare
 * Workers and adds nothing to the bundle). Without RESEND_API_KEY every call
 * returns { ok: false, reason: 'not-configured' } and nothing is sent.
 */
const API = 'https://api.resend.com';

export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY ?? '',
  from: process.env.EMAIL_FROM || 'The Home Lab <info@thehomelab.ie>',
  replyTo: process.env.EMAIL_REPLY_TO || 'info@thehomelab.ie',
  /** Where contact form messages are delivered. */
  inbox: process.env.CONTACT_INBOX || 'info@thehomelab.ie',
  /** Resend audience that newsletter subscribers are added to. */
  audienceId: process.env.RESEND_AUDIENCE_ID ?? '',
};

export const isEmailConfigured = () => Boolean(emailConfig.apiKey);

export type SendResult = { ok: true; id: string } | { ok: false; reason: 'not-configured' | 'failed' };

async function resend<T>(path: string, init: { method: string; body?: unknown }): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: { Authorization: `Bearer ${emailConfig.apiKey}`, 'Content-Type': 'application/json' },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    console.error(`[email] ${init.method} ${path} failed: ${res.status} ${await res.text().catch(() => '')}`);
    return null;
  }
  return (await res.json().catch(() => ({}))) as T;
}

export async function sendEmail(to: string, email: Email, opts: { replyTo?: string; tag?: string } = {}): Promise<SendResult> {
  if (!isEmailConfigured()) return { ok: false, reason: 'not-configured' };
  try {
    const data = await resend<{ id: string }>('/emails', {
      method: 'POST',
      body: {
        from: emailConfig.from,
        to: [to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        reply_to: opts.replyTo ?? emailConfig.replyTo,
        tags: opts.tag ? [{ name: 'category', value: opts.tag }] : undefined,
      },
    });
    return data?.id ? { ok: true, id: data.id } : { ok: false, reason: 'failed' };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, reason: 'failed' };
  }
}

/** Adds or re-subscribes a contact in the newsletter audience. */
export async function upsertNewsletterContact(email: string, firstName?: string | null) {
  if (!isEmailConfigured() || !emailConfig.audienceId) return false;
  const path = `/audiences/${emailConfig.audienceId}/contacts`;
  const created = await resend(path, { method: 'POST', body: { email, first_name: firstName ?? undefined, unsubscribed: false } }).catch(() => null);
  if (created) return true;
  // Already in the audience: mark them subscribed again.
  return Boolean(await resend(`${path}/${encodeURIComponent(email)}`, { method: 'PATCH', body: { unsubscribed: false } }).catch(() => null));
}

export async function unsubscribeNewsletterContact(email: string) {
  if (!isEmailConfigured() || !emailConfig.audienceId) return false;
  return Boolean(
    await resend(`/audiences/${emailConfig.audienceId}/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', body: { unsubscribed: true } }).catch(() => null),
  );
}
