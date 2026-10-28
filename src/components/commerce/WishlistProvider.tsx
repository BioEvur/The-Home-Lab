'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { readJSON, writeJSON } from '@/lib/storage';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/account/AuthProvider';
import { useAnnounce } from '@/components/ui/Announcer';

const STORAGE_KEY = 'thl.wishlist.v1';

interface WishlistValue {
  handles: string[];
  hydrated: boolean;
  /** 'guest' = this browser only; 'account' = synced to the signed-in customer. */
  scope: 'guest' | 'account';
  has: (handle: string) => boolean;
  toggle: (handle: string, title: string) => void;
  remove: (handle: string, title?: string) => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

/**
 * Guests: saved to this browser. Signed-in customers: stored in Supabase
 * (`wishlist_items`, protected by RLS). On sign-in, guest items are merged
 * into the account so nothing saved before signing in is lost.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const announce = useAnnounce();
  const [handles, setHandles] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const mergedFor = useRef<string | null>(null);

  useEffect(() => {
    setHandles(readJSON<string[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  // Merge guest items into the account on sign-in, then load the account list.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user || mergedFor.current === user.id) return;
    mergedFor.current = user.id;
    (async () => {
      const guest = readJSON<string[]>(STORAGE_KEY, []);
      if (guest.length) {
        await supabase
          .from('wishlist_items')
          .upsert(guest.map((product_handle) => ({ user_id: user.id, product_handle })), { onConflict: 'user_id,product_handle', ignoreDuplicates: true });
        writeJSON(STORAGE_KEY, []);
      }
      const { data } = await supabase.from('wishlist_items').select('product_handle').order('created_at', { ascending: false });
      if (data) setHandles(data.map((row) => row.product_handle as string));
    })();
  }, [user]);

  useEffect(() => {
    if (!user) mergedFor.current = null;
  }, [user]);

  useEffect(() => {
    if (hydrated && !user) writeJSON(STORAGE_KEY, handles);
  }, [handles, hydrated, user]);

  const persist = useCallback(
    async (handle: string, add: boolean) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase || !user) return;
      const { error } = add
        ? await supabase.from('wishlist_items').upsert({ user_id: user.id, product_handle: handle }, { onConflict: 'user_id,product_handle' })
        : await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_handle', handle);
      if (error) {
        announce('We could not update your saved items. Please try again.', { toast: true, tone: 'error' });
        setHandles((h) => (add ? h.filter((x) => x !== handle) : [handle, ...h]));
      }
    },
    [user, announce],
  );

  const remove = useCallback(
    (handle: string, title?: string) => {
      setHandles((h) => h.filter((x) => x !== handle));
      announce(`${title ?? 'Item'} removed from your wishlist.`);
      void persist(handle, false);
    },
    [announce, persist],
  );

  const toggle = useCallback(
    (handle: string, title: string) => {
      const saved = handles.includes(handle);
      if (saved) return remove(handle, title);
      setHandles((h) => [handle, ...h.filter((x) => x !== handle)]);
      announce(`${title} saved to your wishlist.`, { toast: true });
      track({ name: 'add_to_wishlist', handle });
      void persist(handle, true);
    },
    [handles, remove, announce, persist],
  );

  const value = useMemo<WishlistValue>(
    () => ({ handles, hydrated, scope: user ? 'account' : 'guest', has: (h) => handles.includes(h), toggle, remove }),
    [handles, hydrated, user, toggle, remove],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
