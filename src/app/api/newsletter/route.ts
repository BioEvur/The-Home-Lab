import { NextResponse } from 'next/server';
import { requestSubscription } from '@/lib/members/newsletter';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { validateEmail } from '@/lib/validation';

/**
 * Newsletter sign-up. Stores the consent wording, then sends a confirmation
 * link (double opt-in) when email sending is connected. Only reports success
 * once the record has actually been stored.
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
  const status = await requestSubscription(email, body.source ?? 'unknown');
  if (status === 'not-configured') return NextResponse.json({ status }, { status: 503 });
  if (status === 'error') return NextResponse.json({ status }, { status: 500 });
  return NextResponse.json({ status });
}
