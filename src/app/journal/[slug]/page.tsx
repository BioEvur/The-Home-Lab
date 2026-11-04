import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/commerce';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { ALL_POSTS, getPost, plainText, readMinutes, relatedPosts, tableOfContents } from '@/lib/content/journal';
import { photoUrl } from '@/lib/content/media';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { PostBody } from '@/components/journal/PostBody';
import { PostCard, formatPostDate } from '@/components/journal/PostCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { Media } from '@/components/ui/Media';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return ALL_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const image = photoUrl(post.hero.id, 1200);
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description, images: [image], publishedTime: post.published, modifiedTime: post.updated ?? post.published },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const products = await getProducts();
  const toc = tableOfContents(post);
  const related = relatedPosts(post);
  const faqs = post.blocks.flatMap((b) => (b.type === 'faq' ? b.items : []));

  return (
    <article className="post">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          image: [photoUrl(post.hero.id, 1600)],
          datePublished: post.published,
          dateModified: post.updated ?? post.published,
          author: { '@type': 'Organization', name: siteConfig.name, url: SITE_URL },
          publisher: { '@type': 'Organization', name: siteConfig.name, url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/journal/${post.slug}`,
          inLanguage: 'en-IE',
        }}
      />
      {faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) } })),
          }}
        />
      )}

      <header className="container post-head">
        <Breadcrumbs items={[{ label: 'Journal', href: '/journal' }, { label: post.title }]} />
        <p className="post-head__meta">
          <Link href={`/journal#${post.category.toLowerCase().replace(/\s+/g, '-')}`}>{post.category}</Link>
          <span aria-hidden="true">·</span>
          <time dateTime={post.updated ?? post.published}>{formatPostDate(post.updated ?? post.published)}</time>
          <span aria-hidden="true">·</span>
          {readMinutes(post)} min read
        </p>
        <h1 className="post-head__title">{post.title}</h1>
        <p className="post-head__excerpt">{post.excerpt}</p>
      </header>

      <figure className="post-hero">
        <Media src={photoUrl(post.hero.id, 2400)} alt={post.hero.alt} ratio="fill" priority focus={post.hero.focus} sizes="100vw" />
      </figure>

      <div className="container post-layout">
        {toc.length > 2 && (
          <nav className="post-toc" aria-labelledby="toc-title">
            <p id="toc-title" className="post-toc__title">
              In this guide
            </p>
            <ol>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <PostBody blocks={post.blocks} products={products} />
      </div>

      <section className="post-join" aria-labelledby="post-join-title">
        <div className="container post-join__inner">
          <h2 id="post-join-title" className="post-join__title">
            Get the next guide by email
          </h2>
          <NewsletterForm source="journal" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container post-related" aria-labelledby="related-title">
          <h2 id="related-title" className="journal-group__title">
            Keep reading
          </h2>
          <ul className="journal-grid">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
