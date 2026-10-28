import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="h1">Reset your password</h1>
      <p className="muted auth-layout__intro">Enter the email address you registered with and we will send you a link to choose a new password.</p>
      <ForgotPasswordForm />
      <p className="auth-layout__switch">
        <Link href="/account/login">Back to sign in</Link>
      </p>
    </>
  );
}
