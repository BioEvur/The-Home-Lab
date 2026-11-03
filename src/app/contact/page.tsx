import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { ContactForm } from '@/components/forms/ContactForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with The Home Lab customer service.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  const email = siteConfig.contact.email ?? 'info@thehomelab.ie';
  return (
    <div className="container contact section--sm">
      <header className="page-head">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <h1 className="h1">Contact us</h1>
      </header>
      <div className="contact__layout">
        <div className="contact__info">
          <p className="lead">Questions about a product, an order or delivery? Send us a message and include your order number if you have one.</p>
          <dl className="contact__details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${email}`}>{email}</a>
              </dd>
            </div>
          </dl>
          <p className="muted">
            You may find a quick answer in our <Link href="/help/faqs">FAQs</Link>, or the <Link href="/help/delivery">delivery</Link> and{' '}
            <Link href="/help/returns">returns</Link> pages.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
