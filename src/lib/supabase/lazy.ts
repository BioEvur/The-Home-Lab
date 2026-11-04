'use client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config';

/**
 * Loads the Supabase browser client on demand, so the SDK (about 70 KB
 * gzipped) is not part of every page's first-load JavaScript. Resolves to null
 * while Supabase is not configured. The client itself is still a singleton.
 */
export async function loadSupabaseBrowserClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const { getSupabaseBrowserClient } = await import('./client');
  return getSupabaseBrowserClient();
}
