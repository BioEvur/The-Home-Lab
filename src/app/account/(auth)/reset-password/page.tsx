import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="h1">Choose a new password</h1>
      <p className="muted auth-layout__intro">You reached this page from a password reset email. Choose a new password below.</p>
      <ResetPasswordForm />
    </>
  );
}
