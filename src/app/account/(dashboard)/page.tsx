import type { Metadata } from 'next';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AccountSetupState } from '@/components/account/SetupState';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Your account', robots: { index: false } };

const TILES = [
  { href: '/account/orders', title: 'Orders', body: 'Track recent orders and see past purchases.' },
  { href: '/account/addresses', title: 'Addresses', body: 'Save delivery addresses for a faster checkout.' },
  { href: '/account/profile', title: 'Profile', body: 'Update your name, phone number and email preferences.' },
  { href: '/account/wishlist', title: 'Wishlist', body: 'Everything you have saved, on any device.' },
];

export default function AccountPage() {
  return (
    <>
      {!isSupabaseConfigured() && <AccountSetupState feature="Your account overview" />}
      <ul className="account-tiles">
        {TILES.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="account-tile">
              <span className="h3">{t.title}</span>
              <span className="muted">{t.body}</span>
              <Icon name="arrow-right" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
