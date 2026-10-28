'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from './AuthForms';

const LINKS = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/wishlist', label: 'Wishlist' },
];

export function AccountNav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="account-nav" aria-label="Account">
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} aria-current={pathname === l.href ? 'page' : undefined} className={pathname === l.href ? 'is-active' : ''}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {signedIn && <SignOutButton />}
    </nav>
  );
}
