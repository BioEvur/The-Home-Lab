import type { MetadataRoute } from 'next';
import { isDevelopmentStage, SITE_URL } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  if (isDevelopmentStage) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/account', '/cart', '/wishlist', '/api/', '/auth/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
