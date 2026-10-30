import type { Metadata } from 'next';
import Link from 'next/link';
import { confirmSubscription } from '@/lib/members/newsletter';

export const metadata: Metadata = { title: 'Confirm your email', robots: { index: false } };
export const dynamic = 'force-dynamic';

const COPY = {
  confirmed: { title: 'You are on the list', body: 'Thank you for confirming. We have sent you a short email about what to expect.' },
  invalid: { title: 'That link has already been used', body: 'If you have already confirmed, you are on the list. Otherwise, sign up again at the bottom of any page.' },
  'not-configured': { title: 'Sign-up is not connected yet', body: 'Newsletter sign-up is not connected in this build, so nothing has been confirmed.' },
};

export default async function NewsletterConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const result = await confirmSubscription(token);
  const copy = COPY[result];
  return (
    <div className="container section notice-page">
      <h1 className="h1">{copy.title}</h1>
      <p className="lead">{copy.body}</p>
      <Link href="/" className="button button--primary">
        See the room sets
      </Link>
    </div>
  );
}
