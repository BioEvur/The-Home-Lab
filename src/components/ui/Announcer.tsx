'use client';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

interface Toast {
  id: number;
  message: string;
  tone: 'neutral' | 'error';
}

const AnnouncerContext = createContext<(message: string, opts?: { toast?: boolean; tone?: Toast['tone'] }) => void>(() => {});

/**
 * One polite live region for status messages (basket updates, filters,
 * form results) plus an optional visual toast for actions without another
 * visible response.
 */
export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const announce = useCallback((text: string, opts?: { toast?: boolean; tone?: Toast['tone'] }) => {
    setMessage('');
    requestAnimationFrame(() => setMessage(text));
    if (opts?.toast) {
      const id = ++counter.current;
      setToasts((t) => [...t.slice(-2), { id, message: text, tone: opts.tone ?? 'neutral' }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
      <div className="toasts" aria-hidden="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <Icon name={t.tone === 'error' ? 'alert' : 'check'} size={18} />
            {t.message}
          </div>
        ))}
      </div>
    </AnnouncerContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnouncerContext);
