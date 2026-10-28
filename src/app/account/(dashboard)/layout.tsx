import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCurrentUser } from '@/lib/supabase/server';
import { AccountNav } from '@/components/account/AccountNav';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  // The proxy already redirects signed-out visitors; this is a second line of defence.
  if (configured && !user) redirect('/account/login?next=/account');
  const name = (user?.user_metadata?.first_name as string | undefined) ?? null;

  return (
    <div className="container account section--sm">
      <header className="account__head">
        <h1 className="h1">{name ? `Hello, ${name}` : 'Your account'}</h1>
        {user?.email && <p className="muted">{user.email}</p>}
      </header>
      <div className="account__layout">
        <AccountNav signedIn={Boolean(user)} />
        <div className="account__content">{children}</div>
      </div>
    </div>
  );
}
