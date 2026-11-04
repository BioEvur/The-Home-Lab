import Link from 'next/link';
import { readMinutes, type Post } from '@/lib/content/journal';
import { photoUrl } from '@/lib/content/media';
import { Media } from '@/components/ui/Media';

export const formatPostDate = (iso: string) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00Z`));

export function PostCard({ post, size = 'normal', priority = false }: { post: Post; size?: 'normal' | 'feature'; priority?: boolean }) {
  return (
    <article className={`post-card post-card--${size}`}>
      <Link href={`/journal/${post.slug}`} className="post-card__link">
        <span className="post-card__media">
          <Media
            src={photoUrl(post.hero.id, size === 'feature' ? 1800 : 900)}
            alt={post.hero.alt}
            ratio={size === 'feature' ? '4 / 3' : '3 / 2'}
            focus={post.hero.focus}
            priority={priority}
            sizes={size === 'feature' ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'}
          />
        </span>
        <span className="post-card__body">
          <span className="post-card__meta">
            {post.category} · {readMinutes(post)} min read
          </span>
          <span className="post-card__title">{post.title}</span>
          <span className="post-card__excerpt">{post.excerpt}</span>
        </span>
      </Link>
    </article>
  );
}
