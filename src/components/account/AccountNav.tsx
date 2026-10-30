'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { REFERRAL } from '@/lib/content/members';
import { SignOutButton } from './AuthForms';

const GROUPS = [
  {
    label: 'Shopping',
    links: [
      { href: '/account', label: 'Overview' },
      { href: '/account/orders', label: 'Orders' },
      { href: '/account/wishlist', label: 'Wishlist' },
      { href: '/account/new', label: 'New in' },
    ],
  },
  {
    label: 'Member',
    links: [
      { href: '/account/offers', label: 'Offers and rewards' },
      ...(REFERRAL.enabled ? [{ href: '/account/referrals', label: 'Refer a friend' }] : []),
    ],
  },
  {
    label: 'Settings',
    links: [
      { href: '/account/addresses', label: 'Addresses' },
      { href: '/account/profile', label: 'Profile' },
      { href: '/account/preferences', label: 'Email preferences' },
      { href: '/account/security', label: 'Sign-in and security' },
    ],
  },
];

export function AccountNav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/account' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <nav className="account-nav" aria-label="Account">
      {GROUPS.map((g) => (
        <div key={g.label} className="account-nav__group">
          <p className="account-nav__label">{g.label}</p>
          <ul>
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} className={isActive(l.href) ? 'is-active' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {signedIn && <SignOutButton />}
    </nav>
  );
}
