'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { required, validateEmail, validatePassword } from '@/lib/validation';
import { Checkbox, FormStatus, TextField } from '@/components/forms/Field';

const NOT_CONNECTED = 'Customer accounts are not connected in this development build, so nothing has been submitted. Your details were valid.';

function safeNext(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/account';
}

/** Supabase messages are reworded so they never reveal whether an account exists. */
function friendlyAuthError(message: string) {
  if (/invalid login credentials/i.test(message)) return 'That email and password combination is not recognised.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email address using the link we sent you, then sign in.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a moment and try again.';
  return 'Something went wrong. Please try again.';
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'info'; text: string } | null>(
    params.get('error') === 'link' ? { tone: 'error', text: 'That link has expired or has already been used. Please request a new one.' } : null,
  );
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = { email: validateEmail(email), password: password ? null : 'Enter your password.' };
    setErrors(next);
    setStatus(null);
    if (next.email || next.password) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setStatus({ tone: 'info', text: NOT_CONNECTED });
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);
    if (error) return setStatus({ tone: 'error', text: friendlyAuthError(error.message) });
    router.replace(safeNext(params.get('next')));
    router.refresh();
  };

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      <TextField id="email" label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <TextField id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <p className="auth-form__aside">
        <Link href="/account/forgot-password">Forgotten your password?</Link>
      </p>
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--primary button--block" disabled={pending} aria-busy={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'info' | 'success'; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      firstName: required(values.firstName, 'your first name'),
      lastName: required(values.lastName, 'your last name'),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: values.confirm === values.password ? null : 'The passwords do not match.',
      terms: terms ? null : 'Please confirm you have read the terms and privacy policy.',
    };
    setErrors(next);
    setStatus(null);
    if (Object.values(next).some(Boolean)) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setStatus({ tone: 'info', text: NOT_CONNECTED });
    setPending(true);
    const { error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: { first_name: values.firstName.trim(), last_name: values.lastName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    setPending(false);
    if (error) return setStatus({ tone: 'error', text: friendlyAuthError(error.message) });
    // Same message whether or not the address was already registered.
    setStatus({ tone: 'success', text: `Check your inbox. If ${values.email.trim()} can be registered, we have sent a link to confirm it.` });
  };

  if (status?.tone === 'success') return <FormStatus tone="success">{status.text}</FormStatus>;

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      <div className="form-grid form-grid--2">
        <TextField id="firstName" label="First name" autoComplete="given-name" value={values.firstName} onChange={set('firstName')} error={errors.firstName} />
        <TextField id="lastName" label="Last name" autoComplete="family-name" value={values.lastName} onChange={set('lastName')} error={errors.lastName} />
      </div>
      <TextField id="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
      <TextField id="password" label="Password" type="password" autoComplete="new-password" hint="At least 10 characters, with letters and numbers." value={values.password} onChange={set('password')} error={errors.password} />
      <TextField id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
      <Checkbox
        id="terms"
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
        error={errors.terms}
        label={
          <>
            I have read the <Link href="/policies/terms">terms</Link> and <Link href="/policies/privacy">privacy policy</Link>.
          </>
        }
      />
      {status && <FormStatus tone={status.tone === 'error' ? 'error' : 'info'}>{status.text}</FormStatus>}
      <button type="submit" className="button button--primary button--block" disabled={pending} aria-busy={pending}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'sent' | 'not-configured' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setStatus('not-configured');
    setStatus('pending');
    const { error: apiError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    });
    setStatus(apiError && /rate/i.test(apiError.message) ? 'error' : 'sent');
  };

  if (status === 'sent') {
    return <FormStatus tone="success">If an account exists for {email.trim()}, we have sent a link to reset the password. The link expires after a short time.</FormStatus>;
  }
  return (
    <form onSubmit={submit} noValidate className="auth-form">
      <TextField id="email" label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
      {status === 'not-configured' && <FormStatus tone="info">{NOT_CONNECTED}</FormStatus>}
      {status === 'error' && <FormStatus tone="error">Too many requests. Please wait a few minutes and try again.</FormStatus>}
      <button type="submit" className="button button--primary button--block" disabled={status === 'pending'} aria-busy={status === 'pending'}>
        {status === 'pending' ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string | null; confirm?: string | null }>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'info' | 'success'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = { password: validatePassword(password), confirm: confirm === password ? null : 'The passwords do not match.' };
    setErrors(next);
    if (next.password || next.confirm) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setStatus({ tone: 'info', text: NOT_CONNECTED });
    setPending(true);
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setPending(false);
      return setStatus({ tone: 'error', text: 'Your reset link has expired. Please request a new one.' });
    }
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) return setStatus({ tone: 'error', text: 'Your password could not be updated. Please try again.' });
    setStatus({ tone: 'success', text: 'Your password has been updated.' });
    window.setTimeout(() => router.replace('/account'), 1200);
  };

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      <TextField id="password" label="New password" type="password" autoComplete="new-password" hint="At least 10 characters, with letters and numbers." value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <TextField id="confirm" label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--primary button--block" disabled={pending} aria-busy={pending}>
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className="text-button"
      disabled={pending}
      onClick={async () => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;
        setPending(true);
        await supabase.auth.signOut();
        router.replace('/');
        router.refresh();
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
