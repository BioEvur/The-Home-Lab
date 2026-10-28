'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import type { Money } from '@/lib/catalog/types';
import { formatMoney } from '@/lib/format';
import { addOnDiscounts } from '@/lib/content/addons';
import { readJSON, writeJSON } from '@/lib/storage';
import { useAnnounce } from '@/components/ui/Announcer';

export const MAX_QUANTITY = 20;
const STORAGE_KEY = 'thl.basket.v1';

export interface CartLine {
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string | null;
  price: Money;
  compareAtPrice: Money | null;
  image: { src: string; alt: string } | null;
  quantity: number;
  /** Set after re-validating against the catalogue. */
  issue?: 'unavailable' | 'removed' | 'price-changed' | null;
}

type Action =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; line: Omit<CartLine, 'quantity'>; quantity: number }
  | { type: 'set'; variantId: string; quantity: number }
  | { type: 'remove'; variantId: string }
  | { type: 'revalidate'; updates: Record<string, Partial<CartLine>> }
  | { type: 'clear' };

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines;
    case 'add': {
      const existing = lines.find((l) => l.variantId === action.line.variantId);
      if (existing) {
        return lines.map((l) =>
          l.variantId === action.line.variantId ? { ...l, ...action.line, quantity: Math.min(MAX_QUANTITY, l.quantity + action.quantity) } : l,
        );
      }
      return [...lines, { ...action.line, quantity: Math.min(MAX_QUANTITY, action.quantity) }];
    }
    case 'set':
      return lines.map((l) => (l.variantId === action.variantId ? { ...l, quantity: Math.max(1, Math.min(MAX_QUANTITY, action.quantity)) } : l));
    case 'remove':
      return lines.filter((l) => l.variantId !== action.variantId);
    case 'revalidate':
      return lines.map((l) => (action.updates[l.variantId] ? { ...l, ...action.updates[l.variantId] } : l));
    case 'clear':
      return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: Money;
  /** Add-on discounts that apply because a room set is in the basket. */
  discounts: { label: string; amount: Money }[];
  /** Subtotal less discounts. */
  total: Money;
  checkoutableLines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number, opts?: { openDrawer?: boolean }) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  revalidate: () => Promise<'ok' | 'error'>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const announce = useAnnounce();

  useEffect(() => {
    dispatch({ type: 'hydrate', lines: readJSON<CartLine[]>(STORAGE_KEY, []).filter((l) => l && l.variantId && l.quantity > 0) });
    setHydrated(true);
    // Keep baskets in sync across tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'hydrate', lines: readJSON<CartLine[]>(STORAGE_KEY, []) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, lines);
  }, [lines, hydrated]);

  const addLine = useCallback<CartContextValue['addLine']>(
    (line, quantity = 1, opts) => {
      dispatch({ type: 'add', line: { ...line, issue: null }, quantity });
      track({ name: 'add_to_cart', variantId: line.variantId, quantity, price: line.price.amount });
      announce(`Added ${quantity} × ${line.title}${line.variantTitle ? `, ${line.variantTitle}` : ''} to your basket.`);
      if (opts?.openDrawer !== false) setOpen(true);
    },
    [announce],
  );

  const setQuantity = useCallback(
    (variantId: string, quantity: number) => {
      dispatch({ type: 'set', variantId, quantity });
      announce(`Quantity updated to ${Math.max(1, Math.min(MAX_QUANTITY, quantity))}.`);
    },
    [announce],
  );

  const removeLine = useCallback(
    (variantId: string) => {
      const line = lines.find((l) => l.variantId === variantId);
      dispatch({ type: 'remove', variantId });
      if (line) {
        track({ name: 'remove_from_cart', variantId, quantity: line.quantity });
        announce(`Removed ${line.title} from your basket.`, { toast: true });
      }
    },
    [lines, announce],
  );

  const revalidate = useCallback(async () => {
    if (!lines.length) return 'ok' as const;
    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds: lines.map((l) => l.variantId) }),
      });
      if (!res.ok) return 'error' as const;
      const { variants } = (await res.json()) as {
        variants: { variantId: string; exists: boolean; available: boolean; price: Money | null; compareAtPrice: Money | null }[];
      };
      const updates: Record<string, Partial<CartLine>> = {};
      for (const v of variants) {
        const line = lines.find((l) => l.variantId === v.variantId);
        if (!line) continue;
        if (!v.exists) updates[v.variantId] = { issue: 'removed' };
        else if (!v.available) updates[v.variantId] = { issue: 'unavailable' };
        else if (v.price && v.price.amount !== line.price.amount)
          updates[v.variantId] = { issue: 'price-changed', price: v.price, compareAtPrice: v.compareAtPrice };
        else updates[v.variantId] = { issue: null };
      }
      dispatch({ type: 'revalidate', updates });
      return 'ok' as const;
    } catch {
      return 'error' as const;
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const checkoutableLines = lines.filter((l) => l.issue !== 'unavailable' && l.issue !== 'removed');
    const subtotal = {
      amount: checkoutableLines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0),
      currencyCode: lines[0]?.price.currencyCode ?? 'EUR',
    } as Money;
    const discounts = addOnDiscounts(checkoutableLines).map((d) => ({
      label: `${d.addOn.title} with a room set`,
      amount: { amount: d.amount, currencyCode: subtotal.currencyCode } as Money,
    }));
    const total = { amount: subtotal.amount - discounts.reduce((n, d) => n + d.amount.amount, 0), currencyCode: subtotal.currencyCode } as Money;
    return {
      lines,
      hydrated,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      discounts,
      total,
      checkoutableLines,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addLine,
      setQuantity,
      removeLine,
      clear: () => dispatch({ type: 'clear' }),
      revalidate,
    };
  }, [lines, hydrated, isOpen, addLine, setQuantity, removeLine, revalidate]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export const describeSubtotal = (m: Money) => formatMoney(m);
