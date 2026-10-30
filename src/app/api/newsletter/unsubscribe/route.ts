import { NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/members/newsletter';

/** Unsubscribe button on /newsletter/unsubscribe, and one-click unsubscribe from mail apps (RFC 8058). */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = await request.formData().catch(() => null);
  const token = String(form?.get('token') ?? url.searchParams.get('token') ?? '');
  const result = await unsubscribeByToken(token);
  return NextResponse.redirect(new URL(`/newsletter/unsubscribe?status=${result}`, url.origin), 303);
}
