'use client';
import { useEffect, useState } from 'react';
import { REFERRAL, euros } from '@/lib/content/members';
import { validateEmail } from '@/lib/validation';
import { FormStatus, TextArea, TextField } from '@/components/forms/Field';
import { Icon } from '@/components/ui/Icon';

/** Copies text and says so, for codes and links. */
export function CopyButton({ value, label = 'Copy', className = 'button button--secondary button--small' }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt('Copy this:', value);
        }
      }}
    >
      <Icon name={copied ? 'check' : 'link'} size={16} />
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}

/** The member's referral link with copy, the phone share sheet, WhatsApp and email. */
export function ReferralShare({ link }: { link: string }) {
  const message = `I thought you'd like The Home Lab. This link takes ${euros(REFERRAL.friendCents)} off your first room set:`;
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare('share' in navigator), []);
  return (
    <div className="referral-share">
      <div className="referral-share__link">
        <span className="referral-share__url">{link.replace(/^https?:\/\//, '')}</span>
        <CopyButton value={link} label="Copy link" className="button button--primary button--small" />
      </div>
      <div className="referral-share__more">
        {canShare && (
          <button type="button" className="text-button" onClick={() => navigator.share({ title: 'The Home Lab', text: message, url: link }).catch(() => undefined)}>
            <Icon name="share" size={16} /> Share
          </button>
        )}
        <a className="text-button" href={`https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a className="text-button" href={`mailto:?subject=${encodeURIComponent(`${euros(REFERRAL.friendCents)} off at The Home Lab`)}&body=${encodeURIComponent(`${message}\n\n${link}`)}`}>
          <Icon name="mail" size={16} /> Email
        </a>
      </div>
    </div>
  );
}

/** Sends a friend an invite email from the site (rate-limited on the server). */
export function InviteForm() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    setStatus(null);
    if (err) return;
    setPending(true);
    try {
      const res = await fetch('/api/account/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), note }) });
      const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
      if (data.status === 'sent') {
        setStatus({ tone: 'success', text: `Invite sent to ${email.trim()}.` });
        setEmail('');
        setNote('');
      } else if (data.status === 'already') setStatus({ tone: 'info', text: data.message ?? 'You have already invited this person.' });
      else if (data.status === 'not-configured') setStatus({ tone: 'info', text: 'Email invites are not connected yet. Share your link instead.' });
      else setStatus({ tone: 'error', text: data.message ?? 'The invite could not be sent. Please try again.' });
    } catch {
      setStatus({ tone: 'error', text: 'The invite could not be sent. Please try again.' });
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="invite-form" onSubmit={submit} noValidate>
      <TextField id="invite-email" label="Friend's email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
      <TextArea id="invite-note" label="Add a note" optional rows={2} maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} />
      {status && <FormStatus tone={status.tone}>{status.text}</FormStatus>}
      <button type="submit" className="button button--secondary" disabled={pending} aria-busy={pending}>
        {pending ? 'Sending…' : 'Send invite'}
      </button>
      <p className="field__hint">We send one email in your name and do not add your friend to any list.</p>
    </form>
  );
}
