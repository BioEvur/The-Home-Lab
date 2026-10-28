'use client';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { required } from '@/lib/validation';
import { Checkbox, FormStatus, TextField } from '@/components/forms/Field';
import { useAuth } from './AuthProvider';

/** Customer profile and preferences in Supabase (`profiles`, RLS: owner only). */
export function ProfileForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [prefs, setPrefs] = useState({ email_product_updates: false });
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    supabase
      .from('profiles')
      .select('first_name,last_name,phone,email_product_updates')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({ first_name: data.first_name ?? '', last_name: data.last_name ?? '', phone: data.phone ?? '' });
          setPrefs({ email_product_updates: Boolean(data.email_product_updates) });
        }
        setLoaded(true);
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = { first_name: required(form.first_name, 'your first name'), last_name: required(form.last_name, 'your last name') };
    setErrors(next);
    if (next.first_name || next.last_name) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    setPending(true);
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...form, ...prefs, updated_at: new Date().toISOString() });
    setPending(false);
    setStatus(error ? { tone: 'error', text: 'Your profile could not be saved.' } : { tone: 'success', text: 'Your profile has been updated.' });
  };

  if (!loaded) return <p className="muted" aria-busy="true">Loading profile…</p>;

  return (
    <form onSubmit={save} noValidate className="form-grid form-grid--2 profile-form">
      <TextField id="first_name" label="First name" autoComplete="given-name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} error={errors.first_name} />
      <TextField id="last_name" label="Last name" autoComplete="family-name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} error={errors.last_name} />
      <div className="span-2">
        <TextField id="email" label="Email address" type="email" value={user?.email ?? ''} disabled hint="Contact us to change the email address on your account." />
      </div>
      <div className="span-2">
        <TextField id="phone" label="Phone" optional type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="span-2">
        <Checkbox
          id="email_product_updates"
          checked={prefs.email_product_updates}
          onChange={(e) => setPrefs({ email_product_updates: e.target.checked })}
          label="Email me about new products and journal pieces. I can change this at any time."
        />
      </div>
      {status && (
        <div className="span-2">
          <FormStatus tone={status.tone}>{status.text}</FormStatus>
        </div>
      )}
      <div className="span-2">
        <button type="submit" className="button button--primary" disabled={pending} aria-busy={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
