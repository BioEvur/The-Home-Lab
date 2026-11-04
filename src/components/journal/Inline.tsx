import Link from 'next/link';
import { Fragment } from 'react';

/** Renders **bold** and [text](href) inside journal copy. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith('/') ? (
            <Link key={i} href={href}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} rel="noopener noreferrer" target="_blank">
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
