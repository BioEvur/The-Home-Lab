import { NextResponse } from 'next/server';
import { getMemberSubscription } from '@/lib/members/newsletter';
import { getCurrentUser, getSupabaseServerClient } from '@/lib/supabase/server';

/** Everything stored about the signed-in member, as a JSON download (GDPR right of access). */
export async function GET() {
  const user = await getCurrentUser();
  const supabase = await getSupabaseServerClient();
  if (!user || !supabase) return NextResponse.json({ status: 'signed-out' }, { status: 401 });

  const [profile, addresses, wishlist, alerts, referrals, rewards] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('customer_addresses').select('*'),
    supabase.from('wishlist_items').select('product_handle,created_at'),
    supabase.from('product_alerts').select('product_handle,created_at,notified_at'),
    supabase.from('referrals').select('invited_email,source,status,created_at,joined_at,ordered_at'),
    supabase.from('member_rewards').select('title,amount_cents,code,status,expires_at,created_at'),
  ]);
  const newsletter = user.email ? await getMemberSubscription(user.email).catch(() => null) : null;

  const data = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email, created_at: user.created_at, email_confirmed_at: user.email_confirmed_at },
    profile: profile.data,
    addresses: addresses.data,
    wishlist: wishlist.data,
    launch_alerts: alerts.data,
    referrals: referrals.data,
    rewards: rewards.data,
    newsletter,
    note: 'Orders are held by our shop platform (Shopify) and are listed in your account under Orders.',
  };
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="the-home-lab-account.json"',
      'Cache-Control': 'no-store',
    },
  });
}
