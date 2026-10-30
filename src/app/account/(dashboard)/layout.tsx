import { redirect } from 'next/navigation';
import { memberNumber } from '@/lib/content/members';
import { loadMember } from '@/lib/members/account';
import { AccountNav } from '@/components/account/AccountNav';
import { FormStatus } from '@/components/forms/Field';

const since = (iso: string) => new Intl.DateTimeFormat('en-IE', { month: 'long', year: 'numeric' }).format(new Date(iso));

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { configured, user, profile } = await loadMember();
  // The proxy already redirects signed-out visitors; this is a second line of defence.
  if (configured && !user) redirect('/account/login?next=/account');
  const name = profile?.first_name ?? (user?.user_metadata?.first_name as string | undefined) ?? null;
  const number = memberNumber(profile?.member_number);

  return (
    <div className="container account section--sm">
      <header className="account__head">
        <h1 className="h1">{name ? `Hello, ${name}` : 'Your account'}</h1>
        {user && (
          <p className="account__meta">
            {number && <span>Member {number}</span>}
            {profile?.created_at && <span>Since {since(profile.created_at)}</span>}
            <span>{user.email}</span>
          </p>
        )}
      </header>
      {user && !user.email_confirmed_at && (
        <FormStatus tone="info">Please confirm your email address using the link we sent you. Orders and invites unlock once it is confirmed.</FormStatus>
      )}
      <div className="account__layout">
        <AccountNav signedIn={Boolean(user)} />
        <div className="account__content">{children}</div>
      </div>
    </div>
  );
}
