'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/**
 * Accessible drawer / modal built on the native <dialog> element: focus is
 * trapped by the browser, Escape closes it, and the page behind is inert.
 * Entrance and exit are CSS transitions on transform and opacity only.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  children,
  footer,
  className,
  labelledBy,
  hideTitle,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'right' | 'left' | 'top' | 'bottom';
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  labelledBy?: string;
  hideTitle?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const titleId = useRef(`drawer-${Math.random().toString(36).slice(2, 8)}`).current;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('has-modal');
      requestAnimationFrame(() => setVisible(true));
    } else if (!open && dialog.open) {
      setVisible(false);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t = window.setTimeout(() => {
        dialog.close();
        document.documentElement.classList.remove('has-modal');
      }, reduce ? 0 : 280);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove('has-modal'), []);

  const onCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={ref}
      className={`drawer drawer--${side} ${visible ? 'is-visible' : ''} ${className ?? ''}`}
      aria-labelledby={labelledBy ?? titleId}
      onCancel={onCancel}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="drawer__panel">
        <header className="drawer__header">
          <h2 id={titleId} className={hideTitle ? 'visually-hidden' : 'drawer__title'}>
            {title}
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
