'use client';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { validateEmail } from '@/lib/validation';
import { Checkbox, FormStatus, TextField } from './Field';

type Status = 'idle' | 'submitting' | 'subscribed' | 'already' | 'not-configured' | 'error';

export function NewsletterForm({ tone = 'light', source }: { tone?: 'light' | 'dark'; source: string }) {
  const uid = useId().replace(/:/g, '');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | null; consent?: string | null }>({});
  const [status, setStatus] = useState<Status>('idle');
  const inFlight = useRef(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return; // Guard against double submission.
    const next = { email: validateEmail(email), consent: consent ? null : 'Tick the box to confirm you want to receive emails.' };
    setErrors(next);
    if (next.email || next.consent) return;
    inFlight.current = true;
    setStatus('submitting');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent, source }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: Status };
      if (res.status === 503) setStatus('not-configured');
      else if (res.ok && (data.status === 'subscribed' || data.status === 'already')) {
        setStatus(data.status);
        if (data.status === 'subscribed') track({ name: 'newsletter_signup' });
      } else setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  };

  if (status === 'subscribed' || status === 'already') {
    return (
      <FormStatus tone="success">
        {status === 'subscribed' ? 'Thank you. You are on the list.' : 'You are already subscribed with this address.'}
      </FormStatus>
    );
  }

  return (
    <form className={`newsletter-form newsletter-form--${tone}`} onSubmit={submit} noValidate>
      <div className="newsletter-form__row">
        <TextField
          id={`nl-email-${uid}`}
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <button type="submit" className={`button ${tone === 'dark' ? 'button--light' : 'button--primary'}`} disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? 'Signing up…' : 'Sign up'}
        </button>
      </div>
      <Checkbox
        id={`nl-consent-${uid}`}
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        error={errors.consent}
        label={
          <>
            I would like to receive emails from The Home Lab. I can unsubscribe at any time. See the <Link href="/policies/privacy">privacy policy</Link>.
          </>
        }
      />
      {status === 'not-configured' && (
        <FormStatus tone="info">Sign-up is not connected yet in this development build, so your address has not been saved.</FormStatus>
      )}
      {status === 'error' && <FormStatus tone="error">Something went wrong and you have not been subscribed. Please try again.</FormStatus>}
    </form>
  );
}
