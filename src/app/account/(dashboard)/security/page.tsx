import type { Metadata } from 'next';
import { loadMember } from '@/lib/members/account';
import { ChangeEmailForm, ChangePasswordForm, DeleteAccountForm, SignOutEverywhereButton } from '@/components/account/SecurityForms';
import { AccountSetupState } from '@/components/account/SetupState';

export const metadata: Metadata = { title: 'Sign-in and security', robots: { index: false } };

export default async function SecurityPage() {
  const { configured, user } = await loadMember();
  if (!configured) return <AccountSetupState feature="Your sign-in settings" />;
  if (!user) return null;
  const lastSignIn = user.last_sign_in_at ? new Intl.DateTimeFormat('en-IE', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Dublin' }).format(new Date(user.last_sign_in_at)) : null;

  return (
    <div className="account-stack">
      <h2 className="h2 account__title">Sign-in and security</h2>
      {lastSignIn && <p className="muted account__intro">Last signed in {lastSignIn}.</p>}

      <section className="settings-block" aria-labelledby="email-title">
        <div className="settings-block__intro">
          <h3 id="email-title" className="h3">
            Email address
          </h3>
          <p className="muted">We send a link to the new address. Your email changes once you press it.</p>
        </div>
        <ChangeEmailForm />
      </section>

      <section className="settings-block" aria-labelledby="password-title">
        <div className="settings-block__intro">
          <h3 id="password-title" className="h3">
            Password
          </h3>
          <p className="muted">At least 10 characters, with letters and numbers.</p>
        </div>
        <ChangePasswordForm />
      </section>

      <section className="settings-block" aria-labelledby="devices-title">
        <div className="settings-block__intro">
          <h3 id="devices-title" className="h3">
            Signed-in devices
          </h3>
          <p className="muted">Lost a phone or used a shared computer? Sign out everywhere, including here.</p>
        </div>
        <div>
          <SignOutEverywhereButton />
        </div>
      </section>

      <section className="settings-block" aria-labelledby="data-title">
        <div className="settings-block__intro">
          <h3 id="data-title" className="h3">
            Your data
          </h3>
          <p className="muted">Download everything we hold about your account as a file.</p>
        </div>
        <div>
          <a href="/api/account/export" className="button button--secondary" download>
            Download my data
          </a>
        </div>
      </section>

      <section className="settings-block settings-block--danger" aria-labelledby="delete-title">
        <div className="settings-block__intro">
          <h3 id="delete-title" className="h3">
            Delete account
          </h3>
          <p className="muted">
            Deletes your account, addresses, wishlist, rewards and preferences straight away. This cannot be undone. Order records are kept for as long as tax law
            requires.
          </p>
        </div>
        <DeleteAccountForm />
      </section>
    </div>
  );
}
