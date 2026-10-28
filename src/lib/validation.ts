/** Shared validation used by both the browser forms and the API routes. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string) {
  if (!value.trim()) return 'Enter your email address.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter an email address in the format name@example.com.';
  return null;
}

export function validatePassword(value: string) {
  if (value.length < 10) return 'Use at least 10 characters.';
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return 'Use a mix of letters and numbers.';
  return null;
}

export function required(value: string, label: string) {
  return value.trim() ? null : `Enter ${label}.`;
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>;
