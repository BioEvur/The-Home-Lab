'use client';
import { createContext, useContext, type ReactNode } from 'react';

type Mode = 'development' | 'shopify';
const Ctx = createContext<Mode>('development');

/** The server decides the mode from environment variables and passes it down. */
export function CommerceModeProvider({ mode, children }: { mode: Mode; children: ReactNode }) {
  return <Ctx.Provider value={mode}>{children}</Ctx.Provider>;
}

export const useCommerceMode = () => useContext(Ctx);
