/**
 * Single, consistent line-icon set (1.5px strokes on a 24px grid).
 * Icons are decorative by default; pass `label` when an icon stands alone.
 */
const PATHS = {
  search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L21 21',
  user: 'M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM4 20.5c.8-3.7 4-6 8-6s7.2 2.3 8 6',
  heart: 'M12 20s-7.5-4.4-7.5-10A4.5 4.5 0 0 1 12 7.3 4.5 4.5 0 0 1 19.5 10C19.5 15.6 12 20 12 20Z',
  bag: 'M5 8h14l-1 12.5H6L5 8Zm3.5 0V6.5a3.5 3.5 0 0 1 7 0V8',
  menu: 'M3.5 7h17M3.5 12h17M3.5 17h11',
  close: 'M5.5 5.5l13 13M18.5 5.5l-13 13',
  'arrow-right': 'M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5',
  'arrow-left': 'M20 12H4.5M10 6.5 4.5 12l5.5 5.5',
  'arrow-down': 'M12 4v15.5M6.5 14l5.5 5.5 5.5-5.5',
  'chevron-down': 'M6 9.5l6 6 6-6',
  'chevron-right': 'M9.5 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  filter: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M10 14.5v5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13',
  share: 'M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12.5V20h14v-7.5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  truck: 'M3 6.5h11v10H3zM14 10h4l3 3v3.5h-7M7 19a1.75 1.75 0 1 0 0-3.5A1.75 1.75 0 0 0 7 19Zm10.5 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z',
  return: 'M9 7.5 4.5 12 9 16.5M5 12h9.5a5 5 0 0 1 0 10H12',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5.5M12 7.5v.5',
  alert: 'M12 3.5 21.5 20h-19L12 3.5Zm0 6v4.5M12 16.5v.5',
  ruler: 'M3 15.5 15.5 3l5.5 5.5L8.5 21 3 15.5Zm4-1 1.5 1.5M9.5 12l2 2M12 9.5l1.5 1.5M14.5 7l2 2',
  mail: 'M3.5 6h17v12h-17zM3.5 6.5 12 13l8.5-6.5',
  zoom: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L21 21M10.5 7.5v6M7.5 10.5h6',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, label, className }: { name: IconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      className={`icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
