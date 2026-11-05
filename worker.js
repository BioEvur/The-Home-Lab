// Cloudflare Worker entry (see `main` in wrangler.jsonc).
//
// It wraps the worker that `opennextjs-cloudflare build` generates and adds one
// thing: caching for optimised images. OpenNext answers /_next/image by
// fetching the original photo and resizing it with the Images binding on every
// request, and it sends no Cache-Control header for photos in /public. So
// without this, every visitor waits for every photo to be resized again and
// browsers cannot reuse them between pages.
//
// Here each resized image is kept in Cloudflare's edge cache (per data centre)
// and browsers may keep it for four hours, the same as Next.js's default
// `images.minimumCacheTTL`. The cache key includes the deployed version, so a
// new deploy never serves a photo from the previous one.

// @ts-nocheck: `.open-next/worker.js` only exists after `npm run build`.
import openNext from './.open-next/worker.js';

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

const IMAGE_PATH = '/_next/image';
// Same order as `images.formats` in next.config.ts. OpenNext picks the first
// one the browser accepts, so the cache key must record which one it was.
const FORMATS = ['image/avif', 'image/webp'];
const BROWSER_TTL = 4 * 60 * 60; // 4 hours
const EDGE_TTL = 30 * 24 * 60 * 60; // 30 days; a new deploy starts a new cache anyway

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.pathname !== IMAGE_PATH || typeof caches === 'undefined') {
      return openNext.fetch(request, env, ctx);
    }

    const accept = request.headers.get('Accept') ?? '';
    const format = FORMATS.find((f) => accept.includes(f)) ?? 'original';
    const key = new URL(url);
    key.searchParams.set('__format', format);
    key.searchParams.set('__version', env.CF_VERSION_METADATA?.id ?? 'unversioned');
    const cacheKey = new Request(key.toString(), { method: 'GET' });
    const cache = caches.default;

    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    const response = await openNext.fetch(request, env, ctx);
    if (response.status !== 200) return response;

    const cached = new Response(response.body, response);
    // Statically imported images already come back as immutable; keep that.
    if (!cached.headers.has('Cache-Control')) {
      cached.headers.set('Cache-Control', `public, max-age=${BROWSER_TTL}, s-maxage=${EDGE_TTL}`);
    }
    ctx.waitUntil(cache.put(cacheKey, cached.clone()));
    return cached;
  },
};
