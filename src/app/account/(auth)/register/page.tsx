import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false } };

export default function RegisterPage() {
  return (
    <>
      <h1 className="h1">Create an account</h1>
      <p className="muted auth-layout__intro">Keep your wishlist across devices, save addresses and see your order history.</p>
      <RegisterForm />
      <p className="auth-layout__switch">
        Already have an account? <Link href="/account/login">Sign in</Link>
      </p>
    </>
  );
}
