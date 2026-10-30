import { NextResponse } from 'next/server';
import { welcomeMember } from '@/lib/members/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

/** Handles Supabase email links (confirmation and password recovery) via the PKCE code exchange. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next') ?? '/account';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/account';
  const supabase = await getSupabaseServerClient();
  if (supabase && code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // First confirmed sign-in: welcome email and any referral offer. Never blocks the sign-in.
      if (data.user) await welcomeMember(data.user).catch((err) => console.error('[auth] welcome failed', err));
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }
  return NextResponse.redirect(new URL('/account/login?error=link', url.origin));
}
