import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHelpPage, HELP_PAGES } from '@/lib/content/policies';
import { ContentBody } from '@/components/editorial/ContentPage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => HELP_PAGES.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getHelpPage((await params).slug);
  return page ? { title: page.title, description: page.description, alternates: { canonical: `/help/${page.slug}` } } : {};
}

export default async function HelpTopicPage({ params }: Props) {
  const page = getHelpPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: 'Help', href: '/help' }, { label: page.title }]} />
      <h1 className="h1 help__title">{page.title}</h1>
      <p className="lead">{page.description}</p>
      <ContentBody page={page} />
    </>
  );
}
