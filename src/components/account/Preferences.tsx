'use client';
import { useEffect, useState } from 'react';
import { EMAIL_PREFERENCES, type EmailPreferenceKey } from '@/lib/content/members';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FormStatus } from '@/components/forms/Field';
import { useAuth } from './AuthProvider';

type Prefs = Record<EmailPreferenceKey, boolean>;

function Toggle({ id, label, body, checked, disabled, onChange }: { id: string; label: string; body: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="pref-row" htmlFor={id}>
      <span className="pref-row__text">
        <span className="pref-row__label">{label}</span>
        <span className="muted">{body}</span>
      </span>
      <input id={id} type="checkbox" role="switch" className="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

/**
 * Which emails the member gets. The newsletter goes through the server (it
 * shares records with the sign-up form); the rest are profile columns.
 */
export function EmailPreferencesForm() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [newsletter, setNewsletter] = useState<{ subscribed: boolean; available: boolean }>({ subscribed: false, available: true });
  const [status, setStatus] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    supabase
      .from('profiles')
      .select(EMAIL_PREFERENCES.map((p) => p.key).join(','))
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const row = (data ?? {}) as unknown as Partial<Prefs>;
        setPrefs(Object.fromEntries(EMAIL_PREFERENCES.map((p) => [p.key, Boolean(row[p.key])])) as Prefs);
      });
    fetch('/api/account/newsletter')
      .then((r) => r.json())
      .then((d: { status: string; subscribed?: boolean }) => setNewsletter({ subscribed: Boolean(d.subscribed), available: d.status === 'ok' }))
      .catch(() => setNewsletter({ subscribed: false, available: false }));
  }, [user]);

  const savePref = async (key: EmailPreferenceKey, value: boolean) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user || !prefs) return;
    setBusy(key);
    setPrefs({ ...prefs, [key]: value });
    const { error } = await supabase.from('profiles').update({ [key]: value, updated_at: new Date().toISOString() }).eq('id', user.id);
    setBusy(null);
    if (error) {
      setPrefs({ ...prefs, [key]: !value });
      setStatus({ tone: 'error', text: 'That change could not be saved. Please try again.' });
    } else setStatus({ tone: 'success', text: 'Saved.' });
  };

  const saveNewsletter = async (value: boolean) => {
    setBusy('newsletter');
    setNewsletter((n) => ({ ...n, subscribed: value }));
    const res = await fetch('/api/account/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscribed: value }) }).catch(() => null);
    setBusy(null);
    if (!res?.ok) {
      setNewsletter((n) => ({ ...n, subscribed: !value }));
      setStatus({ tone: 'error', text: res?.status === 403 ? 'Confirm your email address first.' : 'That change could not be saved. Please try again.' });
    } else setStatus({ tone: 'success', text: value ? 'You are subscribed to the newsletter.' : 'You have been unsubscribed from the newsletter.' });
  };

  if (!prefs) return <p className="muted" aria-busy="true">Loading your preferences…</p>;

  return (
    <div className="pref-list">
      <Toggle
        id="pref-newsletter"
        label="Newsletter"
        body="New sets, order deadlines and the odd recipe. A couple of emails a month at most."
        checked={newsletter.subscribed}
        disabled={!newsletter.available || busy === 'newsletter'}
        onChange={saveNewsletter}
      />
      {EMAIL_PREFERENCES.map((p) => (
        <Toggle key={p.key} id={`pref-${p.key}`} label={p.label} body={p.body} checked={prefs[p.key]} disabled={busy === p.key} onChange={(v) => savePref(p.key, v)} />
      ))}
      <p className="field__hint">Emails about your orders, your account and your security are always sent.</p>
      {!newsletter.available && <FormStatus tone="info">Newsletter settings are not connected yet.</FormStatus>}
      <div aria-live="polite">{status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}</div>
    </div>
  );
}

/** "Tell me when it opens" for a coming-soon set, stored in `product_alerts`. */
export function LaunchAlertButton({ handle, title }: { handle: string; title: string }) {
  const { configured, user } = useAuth();
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    supabase
      .from('product_alerts')
      .select('product_handle')
      .eq('product_handle', handle)
      .maybeSingle()
      .then(({ data }) => setOn(Boolean(data)));
  }, [user, handle]);

  if (!configured) return null;
  if (!user) {
    return (
      <a className="button button--secondary button--small" href={`/account/login?next=/account/new`}>
        Sign in for a launch alert
      </a>
    );
  }
  const toggle = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const next = !on;
    setOn(next);
    const { error } = next
      ? await supabase.from('product_alerts').insert({ user_id: user.id, product_handle: handle })
      : await supabase.from('product_alerts').delete().eq('user_id', user.id).eq('product_handle', handle);
    if (error && error.code !== '23505') setOn(!next);
  };
  return (
    <button type="button" className={`button button--small ${on ? 'button--primary' : 'button--secondary'}`} onClick={toggle} disabled={on === null} aria-pressed={Boolean(on)}>
      {on ? `We will email you when ${title} opens` : `Email me when ${title} opens`}
    </button>
  );
}
