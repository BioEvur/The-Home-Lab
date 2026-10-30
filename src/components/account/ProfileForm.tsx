'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ROOM_SETS } from '@/lib/content/sets';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { required } from '@/lib/validation';
import { FormStatus, SelectField, TextField } from '@/components/forms/Field';
import { useAuth } from './AuthProvider';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_IN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Customer details in Supabase (`profiles`, RLS: owner only; only these columns are writable). */
export function ProfileForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', birthday_day: '', birthday_month: '' });
  const [sets, setSets] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    supabase
      .from('profiles')
      .select('first_name,last_name,phone,birthday_day,birthday_month,favourite_sets')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            phone: data.phone ?? '',
            birthday_day: data.birthday_day ? String(data.birthday_day) : '',
            birthday_month: data.birthday_month ? String(data.birthday_month) : '',
          });
          setSets((data.favourite_sets as string[] | null) ?? []);
        }
        setLoaded(true);
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const day = Number(form.birthday_day) || null;
    const month = Number(form.birthday_month) || null;
    const next = {
      first_name: required(form.first_name, 'your first name'),
      last_name: required(form.last_name, 'your last name'),
      birthday: (day && !month) || (!day && month) ? 'Choose both a day and a month, or neither.' : day && month && day > DAYS_IN[month - 1] ? 'That date does not exist.' : null,
    };
    setErrors(next);
    setStatus(null);
    if (Object.values(next).some(Boolean)) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    setPending(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim() || null,
        birthday_day: day,
        birthday_month: month,
        favourite_sets: sets,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    if (!error) await supabase.auth.updateUser({ data: { first_name: form.first_name.trim(), last_name: form.last_name.trim() } });
    setPending(false);
    setStatus(error ? { tone: 'error', text: 'Your profile could not be saved.' } : { tone: 'success', text: 'Your profile has been updated.' });
  };

  if (!loaded) return <p className="muted" aria-busy="true">Loading profile…</p>;

  return (
    <form onSubmit={save} noValidate className="form-grid form-grid--2 profile-form">
      <TextField id="first_name" label="First name" autoComplete="given-name" value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
      <TextField id="last_name" label="Last name" autoComplete="family-name" value={form.last_name} onChange={set('last_name')} error={errors.last_name} />
      <div className="span-2">
        <TextField
          id="email"
          label="Email address"
          type="email"
          value={user?.email ?? ''}
          disabled
          hint={
            <>
              Change it in <Link href="/account/security">sign-in and security</Link>.
            </>
          }
        />
      </div>
      <div className="span-2">
        <TextField id="phone" label="Phone" optional type="tel" autoComplete="tel" hint="Only used by the courier if they cannot find you." value={form.phone} onChange={set('phone')} />
      </div>
      <fieldset className="span-2 profile-form__birthday">
        <legend className="field__label">
          Birthday <span className="field__optional">(optional)</span>
        </legend>
        <div className="form-grid form-grid--2">
          <SelectField id="birthday_day" label="Day" value={form.birthday_day} onChange={set('birthday_day')}>
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </SelectField>
          <SelectField id="birthday_month" label="Month" value={form.birthday_month} onChange={set('birthday_month')}>
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </SelectField>
        </div>
        {errors.birthday && <p className="field__error">{errors.birthday}</p>}
        <p className="field__hint">Day and month only, never the year. Used for a birthday offer if we run one.</p>
      </fieldset>
      <fieldset className="span-2">
        <legend className="field__label">
          Sets you like <span className="field__optional">(optional)</span>
        </legend>
        <p className="field__hint">So we can tell you about the ones you care about first.</p>
        <div className="chip-list profile-form__sets">
          {ROOM_SETS.map((s) => {
            const on = sets.includes(s.handle);
            return (
              <button
                key={s.handle}
                type="button"
                className={`chip ${on ? 'is-active' : ''}`}
                aria-pressed={on}
                onClick={() => setSets((list) => (on ? list.filter((h) => h !== s.handle) : [...list, s.handle]))}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </fieldset>
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
