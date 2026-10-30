import type { Metadata } from 'next';
import { loadMember } from '@/lib/members/account';
import { EmailPreferencesForm } from '@/components/account/Preferences';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Email preferences', robots: { index: false } };

export default async function PreferencesPage() {
  const { configured } = await loadMember();
  return (
    <section aria-labelledby="prefs-title">
      <h2 id="prefs-title" className="h2 account__title">
        Email preferences
      </h2>
      <p className="muted account__intro">Choose what we email you about. Changes save straight away.</p>
      {configured ? <EmailPreferencesForm /> : <AccountSetupState feature="Your email preferences" />}
    </section>
  );
}
