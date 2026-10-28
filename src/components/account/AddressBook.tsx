'use client';
import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { required } from '@/lib/validation';
import { FormStatus, SelectField, TextField } from '@/components/forms/Field';
import { useAuth } from './AuthProvider';

interface Address {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string | null;
  country_code: string;
  phone: string | null;
  is_default: boolean;
}

const EMPTY = { label: '', first_name: '', last_name: '', line1: '', line2: '', city: '', county: '', postcode: '', country_code: 'IE', phone: '' };

/**
 * Saved delivery addresses in Supabase (`customer_addresses`, RLS: owner only).
 * At checkout the default address can be passed to Shopify as the buyer's
 * delivery preference; Shopify remains the record for addresses on orders.
 */
export function AddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [editing, setEditing] = useState<Partial<Address> | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data, error } = await supabase.from('customer_addresses').select('*').order('is_default', { ascending: false }).order('created_at');
    if (error) setStatus({ tone: 'error', text: 'Your addresses could not be loaded.' });
    setAddresses((data as Address[]) ?? []);
  }, []);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  const startEdit = (a?: Address) => {
    setEditing(a ?? {});
    setForm(a ? { ...EMPTY, ...Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v ?? ''])) } as typeof EMPTY : EMPTY);
    setErrors({});
    setStatus(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      first_name: required(form.first_name, 'a first name'),
      last_name: required(form.last_name, 'a last name'),
      line1: required(form.line1, 'the first line of the address'),
      city: required(form.city, 'a town or city'),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    setPending(true);
    const payload = { ...form, user_id: user.id, is_default: addresses?.length === 0 || Boolean(editing?.is_default) };
    const { error } = editing?.id
      ? await supabase.from('customer_addresses').update(payload).eq('id', editing.id)
      : await supabase.from('customer_addresses').insert(payload);
    setPending(false);
    if (error) return setStatus({ tone: 'error', text: 'The address could not be saved. Please try again.' });
    setEditing(null);
    setStatus({ tone: 'success', text: 'Address saved.' });
    void load();
  };

  const remove = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from('customer_addresses').delete().eq('id', id);
    setStatus(error ? { tone: 'error', text: 'The address could not be removed.' } : { tone: 'success', text: 'Address removed.' });
    void load();
  };

  const makeDefault = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.rpc('set_default_address', { address_id: id });
    setStatus(error ? { tone: 'error', text: 'The default address could not be changed.' } : { tone: 'success', text: 'Default address updated.' });
    void load();
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (addresses === null) return <p className="muted" aria-busy="true">Loading addresses…</p>;

  return (
    <div className="address-book">
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      {!editing && (
        <>
          {addresses.length === 0 ? (
            <p className="muted">You have not saved any addresses yet.</p>
          ) : (
            <ul className="address-list">
              {addresses.map((a) => (
                <li key={a.id} className="address-card">
                  {a.is_default && <span className="badge badge--light">Default</span>}
                  <address>
                    {a.first_name} {a.last_name}
                    <br />
                    {a.line1}
                    {a.line2 && (
                      <>
                        <br />
                        {a.line2}
                      </>
                    )}
                    <br />
                    {a.city}
                    {a.county ? `, ${a.county}` : ''}
                    {a.postcode && (
                      <>
                        <br />
                        {a.postcode}
                      </>
                    )}
                    <br />
                    {a.country_code === 'IE' ? 'Ireland' : a.country_code}
                  </address>
                  <div className="address-card__actions">
                    <button type="button" className="text-button" onClick={() => startEdit(a)}>
                      Edit
                    </button>
                    {!a.is_default && (
                      <button type="button" className="text-button" onClick={() => makeDefault(a.id)}>
                        Make default
                      </button>
                    )}
                    <button type="button" className="text-button" onClick={() => remove(a.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="button button--secondary" onClick={() => startEdit()}>
            Add an address
          </button>
        </>
      )}
      {editing && (
        <form onSubmit={save} noValidate className="form-grid form-grid--2 address-form">
          <TextField id="first_name" label="First name" autoComplete="given-name" value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
          <TextField id="last_name" label="Last name" autoComplete="family-name" value={form.last_name} onChange={set('last_name')} error={errors.last_name} />
          <div className="span-2">
            <TextField id="line1" label="Address line 1" autoComplete="address-line1" value={form.line1} onChange={set('line1')} error={errors.line1} />
          </div>
          <div className="span-2">
            <TextField id="line2" label="Address line 2" optional autoComplete="address-line2" value={form.line2} onChange={set('line2')} />
          </div>
          <TextField id="city" label="Town or city" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
          <TextField id="county" label="County" optional autoComplete="address-level1" value={form.county} onChange={set('county')} />
          <TextField id="postcode" label="Eircode" optional autoComplete="postal-code" value={form.postcode} onChange={set('postcode')} />
          <SelectField id="country_code" label="Country" value={form.country_code} onChange={set('country_code')}>
            <option value="IE">Ireland</option>
          </SelectField>
          <div className="span-2">
            <TextField id="phone" label="Phone" optional type="tel" autoComplete="tel" hint="Used only for delivery updates." value={form.phone} onChange={set('phone')} />
          </div>
          <div className="span-2 address-form__actions">
            <button type="submit" className="button button--primary" disabled={pending} aria-busy={pending}>
              {pending ? 'Saving…' : 'Save address'}
            </button>
            <button type="button" className="button button--secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
