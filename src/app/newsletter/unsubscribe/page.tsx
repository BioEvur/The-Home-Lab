import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false } };

const DONE = {
  unsubscribed: { title: 'You have been unsubscribed', body: 'You will not receive any more newsletters from us. Emails about orders you place will still arrive.' },
  invalid: { title: 'That link is not valid', body: 'It may already have been used. If you are still receiving emails, reply to one and we will remove you by hand.' },
  'not-configured': { title: 'Unsubscribe is not connected yet', body: 'This build does not send newsletters, so there is nothing to unsubscribe from.' },
};

/** A button rather than unsubscribing on page load, so email link scanners cannot unsubscribe people by accident. */
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string; status?: keyof typeof DONE }> }) {
  const { token, status } = await searchParams;
  const done = status && DONE[status];
  return (
    <div className="container section notice-page">
      {done ? (
        <>
          <h1 className="h1">{done.title}</h1>
          <p className="lead">{done.body}</p>
          <Link href="/" className="button button--secondary">
            Back to the shop
          </Link>
        </>
      ) : (
        <>
          <h1 className="h1">Unsubscribe from our emails?</h1>
          <p className="lead">You will stop receiving newsletters from The Home Lab. Emails about orders you place will still arrive.</p>
          <form method="post" action="/api/newsletter/unsubscribe">
            <input type="hidden" name="token" value={token ?? ''} />
            <button type="submit" className="button button--primary">
              Unsubscribe
            </button>
          </form>
          <p className="muted">
            Signed in? You can also choose which emails you get in <Link href="/account/preferences">your email preferences</Link>.
          </p>
        </>
      )}
    </div>
  );
}
