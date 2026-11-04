import type { Photo } from '../media';

/**
 * Journal (blog) content. Inline text in any block supports **bold** and
 * [link text](/path) links; internal paths start with "/".
 */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'lead'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'image'; photo: Photo; caption?: string; wide?: boolean }
  | { type: 'pair'; photos: [Photo, Photo]; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'tip'; title: string; text: string }
  | { type: 'quote'; text: string; cite?: string }
  /** A card for one room set, with its photo, price and a link. */
  | { type: 'set'; handle: string; text: string }
  /** A row of piece cards from the catalogue. */
  | { type: 'pieces'; handles: string[]; title?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'faq'; items: { q: string; a: string }[] };

export type PostCategory = 'Coffee at home' | 'Home bar' | 'Gift guides' | 'Styling' | 'Places';

export interface Post {
  slug: string;
  title: string;
  /** Shorter title for search results, under about 60 characters. */
  metaTitle: string;
  /** Search result description, about 150 characters. */
  description: string;
  /** One or two sentences shown on cards. */
  excerpt: string;
  category: PostCategory;
  /** The search phrase the post is written to answer. */
  keyword: string;
  /** ISO date, e.g. 2026-11-04. */
  published: string;
  updated?: string;
  hero: Photo;
  /** The room set the post leads to. */
  set?: string;
  blocks: Block[];
}
