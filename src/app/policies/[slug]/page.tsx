import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POLICY_LINKS } from '@/lib/content/navigation';
import { getPolicyPage, POLICY_PAGES } from '@/lib/content/policies';
import { ContentBody } from '@/components/editorial/ContentPage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => POLICY_PAGES.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPolicyPage((await params).slug);
  return page ? { title: page.title, description: page.description, alternates: { canonical: `/policies/${page.slug}` } } : {};
}

export default async function PolicyPage({ params }: Props) {
  const page = getPolicyPage((await params).slug);
  if (!page) notFound();
  return (
    <div className="container help section--sm">
      <div className="help__layout">
        <nav className="side-nav" aria-label="Policies">
          <p className="eyebrow">Policies</p>
          <ul>
            {POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={l.href.endsWith(page.slug) ? 'is-active' : ''} aria-current={l.href.endsWith(page.slug) ? 'page' : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="help__content">
          <Breadcrumbs items={[{ label: page.title }]} />
          <h1 className="h1 help__title">{page.title}</h1>
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
}
