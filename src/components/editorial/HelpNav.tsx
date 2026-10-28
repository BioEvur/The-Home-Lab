'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HELP_LINKS } from '@/lib/content/navigation';

export function HelpNav() {
  const pathname = usePathname();
  return (
    <nav className="side-nav" aria-label="Help topics">
      <p className="eyebrow">Customer service</p>
      <ul>
        {HELP_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={pathname === l.href ? 'is-active' : ''} aria-current={pathname === l.href ? 'page' : undefined}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
