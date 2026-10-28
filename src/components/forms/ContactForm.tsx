'use client';
import Script from 'next/script';
import { useRef, useState } from 'react';
import { required, validateEmail } from '@/lib/validation';
import { FormStatus, SelectField, TextArea, TextField } from './Field';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
type Fields = 'name' | 'email' | 'subject' | 'message';

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', orderNumber: '', message: '', website: '' });
  const [errors, setErrors] = useState<Partial<Record<Fields, string | null>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'not-configured' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const next = {
      name: required(values.name, 'your name'),
      email: validateEmail(values.email),
      subject: values.subject ? null : 'Choose a subject.',
      message: values.message.trim().length < 10 ? 'Write a message of at least 10 characters.' : null,
    };
    setErrors(next);
    const firstError = (Object.keys(next) as Fields[]).find((k) => next[k]);
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`#${firstError}`)?.focus();
      return;
    }
    setStatus('sending');
    const turnstileToken = (formRef.current?.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, startedAt: startedAt.current, turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string; errors?: typeof errors };
      if (res.status === 503) return setStatus('not-configured');
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerMessage(data.message ?? '');
        return setStatus('error');
      }
      setStatus('sent');
    } catch {
      setServerMessage('');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <FormStatus tone="success">
        <strong>Thank you, your message has been sent.</strong> We will reply to {values.email}.
      </FormStatus>
    );
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}
      <div className="form-grid form-grid--2">
        <TextField id="name" label="Name" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
        <TextField id="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
        <SelectField id="subject" label="Subject" value={values.subject} onChange={set('subject')} error={errors.subject}>
          <option value="">Choose a subject</option>
          <option value="order">An existing order</option>
          <option value="product">A product question</option>
          <option value="delivery">Delivery</option>
          <option value="returns">Returns</option>
          <option value="trade">Trade and business enquiries</option>
          <option value="other">Something else</option>
        </SelectField>
        <TextField id="orderNumber" label="Order number" optional value={values.orderNumber} onChange={set('orderNumber')} />
        <div className="span-2">
          <TextArea id="message" label="Message" value={values.message} onChange={set('message')} error={errors.message} rows={7} />
        </div>
      </div>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>
      {SITE_KEY && <div className="cf-turnstile" data-sitekey={SITE_KEY} />}
      <p className="note">We use your details only to reply to your message. See our privacy policy.</p>
      {status === 'not-configured' && (
        <FormStatus tone="info">Your message looks good, but the contact form is not connected yet in this development build, so it has not been sent.</FormStatus>
      )}
      {status === 'error' && <FormStatus tone="error">{serverMessage || 'Your message could not be sent. Please try again.'}</FormStatus>}
      <button type="submit" className="button button--primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
