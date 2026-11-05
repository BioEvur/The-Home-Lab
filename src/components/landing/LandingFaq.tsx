import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';

export type Faq = { q: string; a: string };

/** Questions on a landing page, also published as FAQ structured data. */
export function LandingFaq({ id, title = 'Questions', faqs, className = '' }: { id: string; title?: string; faqs: Faq[]; className?: string }) {
  return (
    <section className={`container lp-faq ${className}`} aria-labelledby={id}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <h2 id={id} className="display-2">
        {title}
      </h2>
      <div className="faq">
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <Icon name="plus" size={18} />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Answers every landing page shares, worded from the delivery and returns policies. */
export const COMMON_FAQS: Faq[] = [
  {
    q: 'Can you send it straight to the person I am buying for?',
    a: 'Yes. Put their name and address in the delivery address at checkout. Use your own email address, so the tracking comes to you and not to them.',
  },
  {
    q: 'How much is delivery, and are there customs charges?',
    a: 'Delivery is charged at our standard rate, shown at checkout before you pay. We deliver anywhere in the Republic of Ireland. Orders are posted from Ireland, so there are no customs or import charges when it arrives.',
  },
  {
    q: 'What if it is not quite right?',
    a: 'After delivery there are 14 days to cancel without giving a reason. A set can be returned whole or piece by piece.',
  },
];
