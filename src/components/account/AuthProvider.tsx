'use client';
import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { loadSupabaseBrowserClient } from '@/lib/supabase/lazy';

interface AuthState {
  configured: boolean;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ configured: false, user: null, loading: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [state, setState] = useState<AuthState>({ configured, user: null, loading: configured });

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    loadSupabaseBrowserClient().then((supabase) => {
      if (!supabase || cancelled) return;
      supabase.auth.getUser().then(({ data }) => {
        if (!cancelled) setState({ configured: true, user: data.user ?? null, loading: false });
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setState({ configured: true, user: session?.user ?? null, loading: false });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [configured]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
