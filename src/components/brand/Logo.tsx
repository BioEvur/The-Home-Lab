import { siteConfig } from '@/lib/config/site';

/**
 * The Home Lab mark, redrawn as vector geometry from the brand board:
 * a tall stem, a fine crossbar, a half-disc bowl, and a tall stem with a foot.
 * Proportions are fixed by the viewBox, so it can never be stretched.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 132.5 94"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <rect x="0" y="0" width="25" height="94" />
      <rect x="33" y="31" width="42" height="5" />
      <path d="M75 46 A32 24 0 0 0 75 94 Z" />
      <rect x="85" y="0" width="22.5" height="94" />
      <rect x="107.5" y="89.5" width="25" height="4.5" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={`wordmark ${className ?? ''}`}>The Home Lab</span>;
}

/** Mark + wordmark lockup used in the header and footer. */
export function Logo({ variant = 'horizontal', showTagline = false }: { variant?: 'horizontal' | 'stacked'; showTagline?: boolean }) {
  return (
    <span className={`logo logo--${variant}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__text">
        <Wordmark />
        {showTagline && <span className="logo__tagline">{siteConfig.tagline}</span>}
      </span>
    </span>
  );
}
