'use client';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * A slim bar with the price and the pre-order button. It slides up once the
 * hero has scrolled away and hides again while the full order section is on
 * screen, so it never doubles up.
 */
export function StickyOrder({ title, children }: { title: string; children: ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[data-world-hero]');
    const order = document.getElementById('order');
    let pastHero = false;
    let atOrder = false;
    const update = () => setShow(pastHero && !atOrder);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === order) atOrder = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (order) io.observe(order);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-order ${show ? 'is-shown' : ''}`} aria-hidden={!show} inert={!show}>
      <div className="container sticky-order__inner">
        <p className="sticky-order__title">{title}</p>
        {children}
      </div>
    </div>
  );
}
