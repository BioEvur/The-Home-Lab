import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { validateEmail } from '@/lib/validation';

const CONSENT_TEXT = 'I would like to receive emails from The Home Lab. I can unsubscribe at any time.';

/**
 * Records a newsletter sign-up with its consent wording. Only reports success
 * once the record has actually been stored. Swap the storage for your email
 * provider (Klaviyo, Mailchimp, Shopify Email via customer marketing consent)
 * when one is chosen.
 */
export async function POST(request: Request) {
  if (!rateLimit(`nl:${clientIp(request.headers)}`, 5)) {
    return NextResponse.json({ status: 'error', message: 'Too many attempts. Please wait a minute.' }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { email?: string; consent?: boolean; source?: string } | null;
  const email = (body?.email ?? '').trim().toLowerCase();
  if (validateEmail(email) || body?.consent !== true) {
    return NextResponse.json({ status: 'error', message: 'A valid email and consent are required.' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ status: 'not-configured' }, { status: 503 });

  const { error } = await admin.from('newsletter_subscribers').insert({
    email,
    consent_text: CONSENT_TEXT,
    source: (body.source ?? 'unknown').slice(0, 40),
  });
  if (error?.code === '23505') return NextResponse.json({ status: 'already' });
  if (error) return NextResponse.json({ status: 'error' }, { status: 500 });
  return NextResponse.json({ status: 'subscribed' });
}
