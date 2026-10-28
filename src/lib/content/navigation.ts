import { ROOM_SETS } from './sets';

export const PRIMARY_NAV = [...ROOM_SETS.map((s) => ({ label: s.title, href: `/sets/${s.handle}` })), { label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }];

export const HELP_LINKS = [
  { label: 'Help centre', href: '/help' },
  { label: 'Delivery', href: '/help/delivery' },
  { label: 'Returns', href: '/help/returns' },
  { label: 'Orders', href: '/help/orders' },
  { label: 'Payments', href: '/help/payments' },
  { label: 'FAQs', href: '/help/faqs' },
  { label: 'Contact', href: '/contact' },
];

export const POLICY_LINKS = [
  { label: 'Privacy', href: '/policies/privacy' },
  { label: 'Cookies', href: '/policies/cookies' },
  { label: 'Terms', href: '/policies/terms' },
  { label: 'Returns policy', href: '/policies/returns' },
  { label: 'Delivery policy', href: '/policies/delivery' },
];
