/**
 * Cookie consent state. Only strictly necessary storage is used until the
 * visitor opts in. Analytics and marketing scripts check this before loading.
 */
export const CONSENT_COOKIE = 'thl_consent';
export const CONSENT_VERSION = 1;

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('='))) as ConsentState;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = { version: CONSENT_VERSION, necessary: true, ...choice, updatedAt: new Date().toISOString() };
  const maxAge = 60 * 60 * 24 * 180; // Ask again after six months.
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; Path=/; Max-Age=${maxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  window.dispatchEvent(new CustomEvent('thl:consent', { detail: state }));
  return state;
}
