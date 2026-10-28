'use client';
import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

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
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setState({ configured: true, user: data.user ?? null, loading: false }));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ configured: true, user: session?.user ?? null, loading: false });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
