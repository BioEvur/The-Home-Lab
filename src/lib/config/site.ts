/**
 * Site-wide configuration. Every business detail that has not been confirmed
 * is `null` and is either hidden or shown as a clearly marked placeholder.
 * Fill these in (or move them to environment variables) before launch.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** 'development' shows placeholders, the development notice and blocks indexing. */
export const SITE_STAGE: 'development' | 'production' =
  process.env.NEXT_PUBLIC_SITE_STAGE === 'production' ? 'production' : 'development';

export const isDevelopmentStage = SITE_STAGE === 'development';

export const siteConfig = {
  name: 'The Home Lab',
  tagline: 'A considered approach to home.',
  description:
    'The Home Lab makes room sets: a Kyoto coffee house, a Milan drinks corner and a Marrakech reading corner, each with every piece it needs in one box.',
  market: { country: 'Ireland', currency: 'EUR' as const, locale: 'en-IE' },
  /** Shown in the announcement strip. Leave null to hide the strip. */
  announcement: (process.env.NEXT_PUBLIC_ANNOUNCEMENT ?? '') || null,
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
    /** Registered business address. Required on several legal pages before launch. */
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || null,
    hours: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_HOURS || null,
    /** Only shown once an actual response time has been agreed. */
    responseTime: process.env.NEXT_PUBLIC_RESPONSE_TIME || null,
  },
  legal: {
    companyName: process.env.NEXT_PUBLIC_LEGAL_COMPANY_NAME || null,
    companyNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER || null,
    vatNumber: process.env.NEXT_PUBLIC_VAT_NUMBER || null,
  },
  /** Only links with a real URL are rendered. */
  social: [
    { label: 'Instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || null },
    { label: 'Pinterest', href: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || null },
    { label: 'TikTok', href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || null },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href)),
};
