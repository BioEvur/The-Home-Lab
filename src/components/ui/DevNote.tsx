import { isDevelopmentStage } from '@/lib/config/site';
import type { ReactNode } from 'react';

/**
 * Visible placeholder for information that has not been confirmed.
 * Shown during development; hidden entirely in production so no unsupported
 * field reaches customers.
 */
export function DevPlaceholder({ children, block = false }: { children: ReactNode; block?: boolean }) {
  if (!isDevelopmentStage) return null;
  const Tag = block ? 'div' : 'span';
  return <Tag className={`dev-placeholder ${block ? 'dev-placeholder--block' : ''}`}>{children}</Tag>;
}

/** Marks business or legal content that must be confirmed before launch. Always visible on draft pages. */
export function ToConfirm({ children }: { children: ReactNode }) {
  return (
    <span className="to-confirm">
      <span className="to-confirm__label">To confirm</span> {children}
    </span>
  );
}
