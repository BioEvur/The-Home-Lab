'use client';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Scroll reveal for selected editorial moments only. Content is visible by
 * default and without JavaScript; the `js` class on <html> opts in to the
 * hidden starting state. One shared IntersectionObserver, no scroll listeners.
 */
let observer: IntersectionObserver | null = null;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', '');
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
  }
  return observer;
}

export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  return (
    <Tag ref={ref} data-reveal="" className={className} style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
