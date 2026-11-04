import type { Block, Post, PostCategory } from './types';
import { POSTS } from './posts';

export type { Block, Post, PostCategory } from './types';

const plain = (s: string) => s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

function blockText(b: Block): string {
  switch (b.type) {
    case 'p':
    case 'lead':
    case 'h2':
    case 'h3':
    case 'quote':
      return b.text;
    case 'tip':
      return `${b.title} ${b.text}`;
    case 'list':
      return b.items.join(' ');
    case 'table':
      return [...b.head, ...b.rows.flat()].join(' ');
    case 'faq':
      return b.items.map((i) => `${i.q} ${i.a}`).join(' ');
    case 'set':
      return b.text;
    default:
      return '';
  }
}

/** Reading time at about 220 words a minute. */
export function readMinutes(post: Post) {
  const words = post.blocks.map((b) => plain(blockText(b))).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

/** Newest first. */
export const ALL_POSTS: Post[] = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));

export const getPost = (slug: string) => ALL_POSTS.find((p) => p.slug === slug) ?? null;

export const CATEGORIES: PostCategory[] = ['Gift guides', 'Coffee at home', 'Home bar', 'Styling', 'Places'];

export function relatedPosts(post: Post, n = 3) {
  const score = (p: Post) => (p.set && p.set === post.set ? 2 : 0) + (p.category === post.category ? 1 : 0);
  return ALL_POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.p);
}

export const postsForSet = (handle: string) => ALL_POSTS.filter((p) => p.set === handle);

export const tableOfContents = (post: Post) =>
  post.blocks.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2').map((b) => ({ id: b.id, text: plain(b.text) }));

export const plainText = plain;
