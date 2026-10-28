import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { ContactForm } from '@/components/forms/ContactForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DevPlaceholder } from '@/components/ui/DevNote';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with The Home Lab customer service.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  const { contact } = siteConfig;
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
              <dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <DevPlaceholder>customer service email</DevPlaceholder>}</dd>
            </div>
            {(contact.phone || !contact.email) && (
              <div>
                <dt>Phone</dt>
                <dd>{contact.phone ? <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a> : <DevPlaceholder>phone number</DevPlaceholder>}</dd>
              </div>
            )}
            <div>
              <dt>Hours</dt>
              <dd>{contact.hours ?? <DevPlaceholder>opening hours</DevPlaceholder>}</dd>
            </div>
            {contact.responseTime && (
              <div>
                <dt>Response time</dt>
                <dd>{contact.responseTime}</dd>
              </div>
            )}
            {contact.address && (
              <div>
                <dt>Registered address</dt>
                <dd>{contact.address}</dd>
              </div>
            )}
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
