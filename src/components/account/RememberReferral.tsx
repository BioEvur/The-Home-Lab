'use client';
import { useEffect } from 'react';
import { REFERRAL_COOKIE } from '@/lib/content/members';

/** Keeps the referral code for a while, so the friend can browse first and sign up later. */
export function RememberReferral({ code, days }: { code: string; days: number }) {
  useEffect(() => {
    document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(code)}; Max-Age=${days * 86_400}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }, [code, days]);
  return null;
}

export function readReferralCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
