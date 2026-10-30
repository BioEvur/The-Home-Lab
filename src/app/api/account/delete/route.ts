import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { accountDeletedEmail } from '@/lib/email/templates';
import { eraseSubscription } from '@/lib/members/newsletter';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser, getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Deletes the signed-in member's account. Removing the Supabase Auth user
 * cascades to their profile, addresses, wishlist, alerts, referrals and
 * rewards. The newsletter record is deleted too. Shopify orders are kept
 * (tax and consumer law), as the confirmation email explains.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ status: 'signed-out' }, { status: 401 });
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ status: 'not-configured' }, { status: 503 });
  const body = (await request.json().catch(() => null)) as { confirm?: string } | null;
  if (body?.confirm !== 'DELETE') return NextResponse.json({ status: 'error', message: 'Type DELETE to confirm.' }, { status: 400 });

  const firstName = (user.user_metadata?.first_name as string | undefined) ?? null;
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ status: 'error', message: 'Your account could not be deleted. Please contact us.' }, { status: 500 });

  if (user.email) {
    await eraseSubscription(user.email);
    await sendEmail(user.email, accountDeletedEmail({ firstName }), { tag: 'account-deleted' });
  }
  const supabase = await getSupabaseServerClient();
  await supabase?.auth.signOut().catch(() => undefined);
  return NextResponse.json({ status: 'deleted' });
}
