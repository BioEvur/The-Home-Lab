'use client';
/**
 * Small, failure-tolerant wrapper around localStorage. Used for guest basket
 * and wishlist convenience only; never for authentication or orders.
 */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private browsing). The session still works in memory.
  }
}
