import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config/site';
import { ADD_ONS } from '@/lib/content/addons';
import { ROOM_SETS } from '@/lib/content/sets';
import { HELP_PAGES, POLICY_PAGES } from '@/lib/content/policies';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/shop', '/about', '/contact', '/help', '/help/faqs'];
  return [
    ...staticRoutes.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...ROOM_SETS.map((s) => ({ url: `${SITE_URL}/sets/${s.handle}`, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...[...ROOM_SETS.flatMap((s) => s.pieces.map((p) => p.handle)), ...ADD_ONS.map((a) => a.handle)].map((h) => ({
      url: `${SITE_URL}/products/${h}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...HELP_PAGES.map((h) => ({ url: `${SITE_URL}/help/${h.slug}`, changeFrequency: 'monthly' as const, priority: 0.3 })),
    ...POLICY_PAGES.map((h) => ({ url: `${SITE_URL}/policies/${h.slug}`, changeFrequency: 'yearly' as const, priority: 0.2 })),
  ];
}
