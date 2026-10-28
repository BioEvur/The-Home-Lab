import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl } from './config';

/**
 * Service-role client. Bypasses Row Level Security, so it is only used in
 * server code for tasks no customer should be able to perform themselves:
 * recording newsletter consent and linking a verified account to Shopify.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
