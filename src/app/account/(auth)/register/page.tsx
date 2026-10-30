import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false } };

export default function RegisterPage() {
  return (
    <>
      <h1 className="h1">Create an account</h1>
      <p className="muted auth-layout__intro">Free to join. See your orders, save addresses, keep a wishlist on any device and see member offers when we run them.</p>
      <Suspense>
        <RegisterForm />
      </Suspense>
      <p className="auth-layout__switch">
        Already have an account? <Link href="/account/login">Sign in</Link>
      </p>
    </>
  );
}
