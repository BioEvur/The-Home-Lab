import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// `npm run build` runs the OpenNext build (see package.json), so Cloudflare
// produces .open-next/worker.js whichever build command a branch uses.
// OpenNext itself must therefore call Next.js directly, not `npm run build`.
export default {
  ...defineCloudflareConfig(),
  buildCommand: 'npx next build',
};
