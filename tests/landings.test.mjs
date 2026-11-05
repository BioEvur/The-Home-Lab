import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { getLocalProducts } from '@/lib/catalog/local';
import { COCKTAILS, COFFEE_MOMENTS, CONSOLE_SPOTS, HOME_ROOMS, KRIS_KINDLE, LANDING_PAGES } from '@/lib/content/landings';
import { getRoomSet } from '@/lib/content/sets';

const handles = new Set(getLocalProducts().map((p) => p.handle));
const onDisk = (src) => existsSync(new URL(`../public${src}`, import.meta.url));

test('every piece a landing page names is in the catalogue', () => {
  const named = [...COFFEE_MOMENTS.map((m) => m.piece), ...CONSOLE_SPOTS.map((s) => s.handle), ...HOME_ROOMS.flatMap((r) => r.pieces), ...Object.keys(KRIS_KINDLE)];
  for (const h of named) assert.ok(handles.has(h), h);
  // The console spots are pieces of The Milanese, and the moments pieces of Kyoto Kissaten.
  const milanese = getRoomSet('the-milanese').pieces.map((p) => p.handle);
  for (const s of CONSOLE_SPOTS) assert.ok(milanese.includes(s.handle), s.handle);
  const kyoto = getRoomSet('kyoto-kissaten').pieces.map((p) => p.handle);
  for (const m of COFFEE_MOMENTS) assert.ok(kyoto.includes(m.piece), m.piece);
});

test('every landing page image exists in /public', () => {
  const images = [...COFFEE_MOMENTS, ...COCKTAILS, ...HOME_ROOMS, ...Object.values(KRIS_KINDLE)].map((x) => x.image.src);
  for (const src of images) assert.ok(onDisk(src), src);
  for (const page of LANDING_PAGES) assert.ok(onDisk(`/images/landing/og-${page.href.slice(1)}.jpg`), page.href);
  assert.ok(onDisk('/images/landing/zellige.svg'));
});

test('Kris Kindle covers every piece under €50, and only those', () => {
  const under50 = getLocalProducts()
    .filter((p) => p.productType !== 'Room set' && p.variants[0].availableForSale && p.variants[0].price.amount <= 5000)
    .map((p) => p.handle)
    .sort();
  assert.deepEqual(Object.keys(KRIS_KINDLE).sort(), under50);
});
