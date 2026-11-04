import type { Metadata } from 'next';
import { SITE_URL, siteConfig } from '@/lib/config/site';
import { ALL_POSTS, CATEGORIES } from '@/lib/content/journal';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { PostCard } from '@/components/journal/PostCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';

export const metadata: Metadata = {
  title: 'Journal: coffee at home, home bars, gift guides and styling',
  description:
    'Guides from The Home Lab: how to make pour-over coffee, set up a home bar, style a console table, and Irish gift guides for coffee lovers, cocktail fans and new homes.',
  alternates: { canonical: '/journal' },
};

export default function JournalPage() {
  const [feature, ...rest] = ALL_POSTS;
  const groups = CATEGORIES.map((c) => ({ category: c, posts: rest.filter((p) => p.category === c) })).filter((g) => g.posts.length);

  return (
    <div className="journal">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${siteConfig.name} Journal`,
          url: `${SITE_URL}/journal`,
          blogPost: ALL_POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}/journal/${p.slug}`, datePublished: p.published })),
        }}
      />
      <header className="container journal-head">
        <Breadcrumbs items={[{ label: 'Journal' }]} />
        <h1 className="display-2 journal-head__title">The Journal</h1>
        <p className="journal-head__lede">
          Practical guides for the rooms in our sets: brewing coffee by hand, mixing drinks at home, styling a corner, and finding gifts that arrive in time
          for Christmas in Ireland.
        </p>
        <nav className="journal-head__topics" aria-label="Journal topics">
          {groups.map((g) => (
            <a key={g.category} href={`#${g.category.toLowerCase().replace(/\s+/g, '-')}`}>
              {g.category}
            </a>
          ))}
        </nav>
      </header>

      {feature && (
        <section className="container journal-feature" aria-label="Latest guide">
          <PostCard post={feature} size="feature" priority />
        </section>
      )}

      {groups.map((g) => (
        <section key={g.category} id={g.category.toLowerCase().replace(/\s+/g, '-')} className="container journal-group" aria-labelledby={`jg-${g.category}`}>
          <h2 id={`jg-${g.category}`} className="journal-group__title">
            {g.category}
          </h2>
          <ul className="journal-grid">
            {g.posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="journal-join" aria-labelledby="journal-join-title">
        <div className="container journal-join__inner">
          <div>
            <h2 id="journal-join-title" className="display-2">
              New guides by email
            </h2>
            <p>New rooms when they open, the last day to order in each batch, and new guides from the Journal. A couple of emails a month at most.</p>
          </div>
          <NewsletterForm source="journal" />
        </div>
      </section>
    </div>
  );
}
