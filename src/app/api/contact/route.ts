import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { required, validateEmail } from '@/lib/validation';

const SUBJECTS = ['order', 'product', 'delivery', 'returns', 'trade', 'other'];

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured: honeypot and timing checks still apply.
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

/**
 * Contact form endpoint. Spam protection: honeypot field, minimum fill time,
 * per-IP rate limit, and optional Cloudflare Turnstile. Messages are forwarded
 * to CONTACT_WEBHOOK_URL (e.g. a helpdesk or email-sending function).
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (!rateLimit(`contact:${ip}`, 3)) {
    return NextResponse.json({ message: 'Too many messages. Please wait a minute and try again.' }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as Record<string, string | number | undefined> | null;
  if (!body) return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });

  // Bots fill hidden fields and submit instantly. Pretend success so they learn nothing.
  const elapsed = Date.now() - Number(body.startedAt ?? 0);
  if (body.website || elapsed < 2500) return NextResponse.json({ status: 'sent' });

  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const subject = String(body.subject ?? '');
  const message = String(body.message ?? '').trim().slice(0, 5000);
  const orderNumber = String(body.orderNumber ?? '').trim().slice(0, 40);
  const errors = {
    name: required(name, 'your name'),
    email: validateEmail(email),
    subject: SUBJECTS.includes(subject) ? null : 'Choose a subject.',
    message: message.length < 10 ? 'Write a message of at least 10 characters.' : null,
  };
  if (Object.values(errors).some(Boolean)) return NextResponse.json({ message: 'Please check the form.', errors }, { status: 400 });

  if (!(await verifyTurnstile(body.turnstileToken as string | undefined, ip))) {
    return NextResponse.json({ message: 'We could not verify the form. Please try again.' }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ status: 'not-configured' }, { status: 503 });

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, orderNumber, message, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error();
    return NextResponse.json({ status: 'sent' });
  } catch {
    return NextResponse.json({ message: 'Your message could not be sent. Please try again.' }, { status: 502 });
  }
}
