import type { Metadata } from 'next';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ProfileForm } from '@/components/account/ProfileForm';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Profile', robots: { index: false } };

export default function ProfilePage() {
  return (
    <section aria-labelledby="profile-title">
      <h2 id="profile-title" className="h2 account__title">
        Profile
      </h2>
      {isSupabaseConfigured() ? <ProfileForm /> : <AccountSetupState feature="Your profile" />}
    </section>
  );
}
