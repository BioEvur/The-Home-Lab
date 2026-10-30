import 'server-only';
import { cache } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCurrentUser, getSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from './server';

/** The signed-in member and their profile, loaded once per request (layout and page share it). */
export const loadMember = cache(async () => {
  if (!isSupabaseConfigured()) return { configured: false as const, user: null, profile: null, supabase: null };
  const [user, supabase] = await Promise.all([getCurrentUser(), getSupabaseServerClient()]);
  const profile = user && supabase ? await getProfile(supabase, user.id) : null;
  return { configured: true as const, user, profile, supabase };
});
