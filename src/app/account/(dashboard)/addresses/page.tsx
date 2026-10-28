import type { Metadata } from 'next';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AddressBook } from '@/components/account/AddressBook';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Addresses', robots: { index: false } };

export default function AddressesPage() {
  return (
    <section aria-labelledby="addresses-title">
      <h2 id="addresses-title" className="h2 account__title">
        Addresses
      </h2>
      {isSupabaseConfigured() ? <AddressBook /> : <AccountSetupState feature="Your saved addresses" />}
    </section>
  );
}
