import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { HELP_PAGES } from '@/lib/content/policies';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DevPlaceholder } from '@/components/ui/DevNote';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Help centre', description: 'Delivery, returns, orders, payments and answers to common questions.', alternates: { canonical: '/help' } };

export default function HelpPage() {
  const topics = [...HELP_PAGES.map((p) => ({ href: `/help/${p.slug}`, title: p.title, body: p.description })), { href: '/help/faqs', title: 'FAQs', body: 'Quick answers to common questions.' }];
  return (
    <>
      <Breadcrumbs items={[{ label: 'Help' }]} />
      <h1 className="h1 help__title">How can we help?</h1>
      <ul className="help-topics">
        {topics.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="help-topic">
              <span className="help-topic__title">{t.title}</span>
              <span className="muted">{t.body}</span>
              <Icon name="arrow-right" />
            </Link>
          </li>
        ))}
      </ul>
      <section className="help-contact">
        <h2 className="h3">Contact customer service</h2>
        <p>
          Send us a message using the <Link href="/contact">contact form</Link>.
          {siteConfig.contact.email && (
            <>
              {' '}
              Or email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </>
          )}
        </p>
        {siteConfig.contact.hours ? <p className="muted">{siteConfig.contact.hours}</p> : <DevPlaceholder>opening hours</DevPlaceholder>}
      </section>
    </>
  );
}
