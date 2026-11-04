import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLocalProducts } from '@/lib/catalog/local';
import { ALL_POSTS, readMinutes } from '@/lib/content/journal';
import { ROOM_SETS } from '@/lib/content/sets';
import { GIFT_SECTIONS } from '@/lib/content/gifts';

const handles = new Set(getLocalProducts().map((p) => p.handle));
const sets = new Set(ROOM_SETS.map((s) => s.handle));
const slugs = new Set(ALL_POSTS.map((p) => p.slug));
const staticRoutes = new Set(['/', '/shop', '/gifts', '/journal', '/about', '/contact', '/help', '/help/faqs', '/help/delivery', '/help/returns']);

function texts(block) {
  if ('text' in block) return [block.text];
  if (block.type === 'list') return block.items;
  if (block.type === 'table') return block.rows.flat();
  if (block.type === 'faq') return block.items.map((i) => i.a);
  return [];
}

test('ten journal posts with unique slugs and search-sized titles', () => {
  assert.equal(ALL_POSTS.length, 10);
  assert.equal(slugs.size, ALL_POSTS.length);
  for (const p of ALL_POSTS) {
    assert.ok(p.metaTitle.length <= 60, `${p.slug} metaTitle is ${p.metaTitle.length} characters`);
    assert.ok(p.description.length >= 110 && p.description.length <= 170, `${p.slug} description is ${p.description.length} characters`);
    assert.ok(readMinutes(p) >= 4, `${p.slug} is too short`);
  }
});

test('every product, set and internal link in the journal exists', () => {
  for (const p of ALL_POSTS) {
    if (p.set) assert.ok(sets.has(p.set), p.slug);
    const ids = new Set();
    for (const b of p.blocks) {
      if (b.type === 'set') assert.ok(sets.has(b.handle), `${p.slug}: set ${b.handle}`);
      if (b.type === 'pieces') b.handles.forEach((h) => assert.ok(handles.has(h), `${p.slug}: piece ${h}`));
      if (b.type === 'h2') {
        assert.ok(!ids.has(b.id), `${p.slug}: duplicate heading id ${b.id}`);
        ids.add(b.id);
      }
      for (const t of texts(b)) {
        for (const [, href] of t.matchAll(/\]\((\/[^)#]*)/g)) {
          const ok = staticRoutes.has(href) || (href.startsWith('/journal/') && slugs.has(href.slice(9))) || (href.startsWith('/sets/') && sets.has(href.slice(6)));
          assert.ok(ok, `${p.slug}: broken link ${href}`);
        }
      }
    }
  }
});

test('gift guide pieces exist', () => {
  for (const s of GIFT_SECTIONS) s.pieces.forEach((h) => assert.ok(handles.has(h), `${s.id}: ${h}`));
});

test('every set has search copy and questions', () => {
  for (const s of ROOM_SETS) {
    assert.ok(s.seo, s.handle);
    assert.ok(s.seo.title.length <= 60 && s.seo.description.length <= 170, s.handle);
    assert.ok(s.seo.faqs.length >= 3, s.handle);
  }
});
