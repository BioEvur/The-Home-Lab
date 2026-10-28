import { NextResponse } from 'next/server';
import { createCheckout, type CheckoutLineInput } from '@/lib/commerce/checkout';
import { clientIp } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/supabase/server';

/**
 * Creates a Shopify cart and returns its hosted checkout URL. Returns 503 with
 * an explicit message while Shopify is not configured; it never simulates an
 * order or a payment.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { lines?: CheckoutLineInput[]; discountCode?: string } | null;
  const lines = Array.isArray(body?.lines) ? body.lines.slice(0, 100) : [];
  const discountCode = typeof body?.discountCode === 'string' ? body.discountCode.trim().slice(0, 40) : undefined;

  // A verified customer email links the order to their account (see lib/commerce/orders.ts).
  const user = await getCurrentUser().catch(() => null);
  const email = user?.email_confirmed_at ? user.email : undefined;

  const result = await createCheckout(lines, { discountCode, email, buyerIp: clientIp(request.headers) });
  if (result.ok) return NextResponse.json({ checkoutUrl: result.checkoutUrl, discountApplied: result.discountApplied });
  const status = result.code === 'COMMERCE_NOT_CONFIGURED' ? 503 : result.code === 'INVALID_LINES' ? 400 : 502;
  return NextResponse.json({ code: result.code, message: result.message }, { status });
}
