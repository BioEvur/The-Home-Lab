'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { validateEmail, validatePassword } from '@/lib/validation';
import { FormStatus, TextField } from '@/components/forms/Field';
import { useAuth } from './AuthProvider';

type Status = { tone: 'success' | 'error' | 'info'; text: string } | null;

export function ChangeEmailForm() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email) ?? (email.trim().toLowerCase() === user?.email?.toLowerCase() ? 'That is already your email address.' : null);
    setError(err);
    setStatus(null);
    const supabase = getSupabaseBrowserClient();
    if (err || !supabase) return;
    setPending(true);
    const { error: apiError } = await supabase.auth.updateUser({ email: email.trim() }, { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account/security` });
    setPending(false);
    if (apiError) return setStatus({ tone: 'error', text: /rate/i.test(apiError.message) ? 'Too many requests. Please wait a few minutes.' : 'The change could not be started. Please try again.' });
    setStatus({ tone: 'success', text: `We have sent a confirmation link to ${email.trim()}. Your email changes once you press it.` });
    setEmail('');
  };

  return (
    <form className="security-form" onSubmit={submit} noValidate>
      <TextField id="current-email" label="Current email" value={user?.email ?? ''} disabled />
      <TextField id="new-email" label="New email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--secondary" disabled={pending} aria-busy={pending}>
        {pending ? 'Sending…' : 'Change email'}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const { user } = useAuth();
  const [values, setValues] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      current: values.current ? null : 'Enter your current password.',
      next: validatePassword(values.next),
      confirm: values.confirm === values.next ? null : 'The passwords do not match.',
    };
    setErrors(next);
    setStatus(null);
    const supabase = getSupabaseBrowserClient();
    if (Object.values(next).some(Boolean) || !supabase || !user?.email) return;
    setPending(true);
    // Check the current password first, so a borrowed signed-in device cannot change it.
    const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password: values.current });
    if (authError) {
      setPending(false);
      return setErrors({ current: 'That password is not correct.' });
    }
    const { error } = await supabase.auth.updateUser({ password: values.next });
    setPending(false);
    if (error) return setStatus({ tone: 'error', text: /different/i.test(error.message) ? 'Choose a password you have not used here before.' : 'Your password could not be changed.' });
    setValues({ current: '', next: '', confirm: '' });
    setStatus({ tone: 'success', text: 'Your password has been changed.' });
  };

  return (
    <form className="security-form" onSubmit={submit} noValidate>
      <TextField id="pw-current" label="Current password" type="password" autoComplete="current-password" value={values.current} onChange={set('current')} error={errors.current} />
      <TextField id="pw-new" label="New password" type="password" autoComplete="new-password" hint="At least 10 characters, with letters and numbers." value={values.next} onChange={set('next')} error={errors.next} />
      <TextField id="pw-confirm" label="Confirm new password" type="password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--secondary" disabled={pending} aria-busy={pending}>
        {pending ? 'Changing…' : 'Change password'}
      </button>
    </form>
  );
}

export function SignOutEverywhereButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className="button button--secondary"
      disabled={pending}
      onClick={async () => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;
        setPending(true);
        await supabase.auth.signOut({ scope: 'global' });
        router.replace('/account/login');
        router.refresh();
      }}
    >
      {pending ? 'Signing out…' : 'Sign out on all devices'}
    </button>
  );
}

export function DeleteAccountForm() {
  const router = useRouter();
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm !== 'DELETE') return setStatus({ tone: 'error', text: 'Type DELETE in capitals to confirm.' });
    setPending(true);
    const res = await fetch('/api/account/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirm }) }).catch(() => null);
    if (res?.ok) {
      await getSupabaseBrowserClient()?.auth.signOut().catch(() => undefined);
      router.replace('/?account=deleted');
      router.refresh();
      return;
    }
    setPending(false);
    setStatus({ tone: 'error', text: 'Your account could not be deleted. Please contact us and we will do it for you.' });
  };

  return (
    <form className="security-form" onSubmit={submit} noValidate>
      <TextField id="delete-confirm" label="Type DELETE to confirm" autoComplete="off" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--danger" disabled={pending} aria-busy={pending}>
        {pending ? 'Deleting…' : 'Delete my account'}
      </button>
    </form>
  );
}
