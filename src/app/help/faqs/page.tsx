import type { Metadata } from 'next';
import { FAQS } from '@/lib/content/policies';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';

export const metadata: Metadata = { title: 'FAQs', description: 'Answers to common questions about shopping with The Home Lab.', alternates: { canonical: '/help/faqs' } };

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <Breadcrumbs items={[{ label: 'Help', href: '/help' }, { label: 'FAQs' }]} />
      <h1 className="h1 help__title">Frequently asked questions</h1>
      <div className="faq">
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <Icon name="plus" size={18} />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
