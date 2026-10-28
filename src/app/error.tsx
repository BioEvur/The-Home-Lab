'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container status-page">
      <h1 className="h1">Something went wrong.</h1>
      <p className="lead">This page could not be loaded. Please try again; your basket and wishlist are safe.</p>
      <div className="status-page__actions">
        <button type="button" className="button button--primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="button button--secondary">
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
