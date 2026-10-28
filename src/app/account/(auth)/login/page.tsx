import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <h1 className="h1">Sign in</h1>
      <p className="muted auth-layout__intro">See your orders, saved addresses and wishlist on any device.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <div className="auth-layout__switch">
        <p>New to The Home Lab?</p>
        <Link href="/account/register" className="button button--secondary button--block">
          Create an account
        </Link>
      </div>
    </>
  );
}
