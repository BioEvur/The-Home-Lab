'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './config';

let client: SupabaseClient | null = null;

/** Returns null while Supabase is not configured, so callers can show a setup state. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) client = createBrowserClient(supabaseUrl, supabasePublishableKey);
  return client;
}
