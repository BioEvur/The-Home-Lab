import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * Form controls with labels, hints and error messages wired up for assistive
 * technology. Errors are announced with text and an icon, never colour alone.
 */
interface BaseProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
}

function describedBy(id: string, hint?: ReactNode, error?: string | null) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
}

function Meta({ id, hint, error }: { id: string; hint?: ReactNode; error?: string | null }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          <Icon name="alert" size={16} /> {error}
        </p>
      )}
    </>
  );
}

export function TextField({ id, label, hint, error, optional, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label} {optional && <span className="field__optional">(optional)</span>}
      </label>
      <input id={id} name={id} className="field__input" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} {...rest} />
      <Meta id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextArea({ id, label, hint, error, optional, ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label} {optional && <span className="field__optional">(optional)</span>}
      </label>
      <textarea id={id} name={id} className="field__input field__input--area" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} {...rest} />
      <Meta id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="field__select">
        <select id={id} name={id} className="field__input" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} {...rest}>
          {children}
        </select>
        <Icon name="chevron-down" size={16} />
      </div>
      <Meta id={id} hint={hint} error={error} />
    </div>
  );
}

export function Checkbox({ id, label, error, hint, ...rest }: Omit<BaseProps, 'label'> & { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`field field--check ${error ? 'has-error' : ''}`}>
      <input id={id} name={id} type="checkbox" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} {...rest} />
      <label htmlFor={id}>{label}</label>
      <Meta id={id} hint={hint} error={error} />
    </div>
  );
}

export function FormStatus({ tone, children }: { tone: 'success' | 'error' | 'info'; children: ReactNode }) {
  return (
    <div className={`form-status form-status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'success' ? 'check' : tone === 'error' ? 'alert' : 'info'} size={18} />
      <div>{children}</div>
    </div>
  );
}
