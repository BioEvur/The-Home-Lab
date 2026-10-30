import { NextResponse } from 'next/server';
import { getMemberSubscription, setMemberSubscription } from '@/lib/members/newsletter';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/supabase/server';

/** Newsletter on/off for the signed-in member, kept in step with the sign-up form's records. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.email) return NextResponse.json({ status: 'signed-out' }, { status: 401 });
  if (!getSupabaseAdminClient()) return NextResponse.json({ status: 'not-configured' }, { status: 503 });
  return NextResponse.json({ status: 'ok', ...(await getMemberSubscription(user.email)) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) return NextResponse.json({ status: 'signed-out' }, { status: 401 });
  if (!user.email_confirmed_at) return NextResponse.json({ status: 'unverified' }, { status: 403 });
  if (!getSupabaseAdminClient()) return NextResponse.json({ status: 'not-configured' }, { status: 503 });
  const body = (await request.json().catch(() => null)) as { subscribed?: boolean } | null;
  if (typeof body?.subscribed !== 'boolean') return NextResponse.json({ status: 'error' }, { status: 400 });
  const ok = await setMemberSubscription({
    email: user.email.toLowerCase(),
    userId: user.id,
    firstName: (user.user_metadata?.first_name as string | undefined) ?? null,
    subscribed: body.subscribed,
  });
  return ok ? NextResponse.json({ status: 'ok', subscribed: body.subscribed }) : NextResponse.json({ status: 'error' }, { status: 500 });
}
