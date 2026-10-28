/**
 * Public Supabase settings. The publishable (anon) key is safe in the browser
 * because every customer table is protected by Row Level Security.
 * The service-role key is read only in `admin.ts`, which is server-only.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
