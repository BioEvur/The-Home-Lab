import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { HELP_LINKS, POLICY_LINKS } from '@/lib/content/navigation';
import { ROOM_SETS } from '@/lib/content/sets';
import { LogoMark, Wordmark } from '@/components/brand/Logo';
import { CookieSettingsLink } from '@/components/consent/CookieConsent';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

export function Footer() {
  const { contact, social, legal } = siteConfig;
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <LogoMark className="site-footer__mark" />
          <Wordmark className="site-footer__wordmark" />
          <p className="site-footer__statement">
            Room sets from three places: a Kyoto coffee house, a Milan drinks corner and a Marrakech reading corner. Each one arrives in a single box.
          </p>
        </div>
        <div className="site-footer__newsletter">
          <h2 className="site-footer__heading">The Home Lab by email</h2>
          <p>New sets, batch dates and the odd recipe for the ritual.</p>
          <NewsletterForm tone="dark" source="footer" />
        </div>
      </div>

      <div className="site-footer__grid">
        <nav aria-labelledby="footer-shop">
          <h2 id="footer-shop" className="site-footer__heading">Shop</h2>
          <ul>
            {ROOM_SETS.map((s) => (
              <li key={s.handle}><Link href={`/sets/${s.handle}`}>{s.title}</Link></li>
            ))}
            <li><Link href="/shop">Every piece</Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-help">
          <h2 id="footer-help" className="site-footer__heading">Customer service</h2>
          <ul>
            {HELP_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-about">
          <h2 id="footer-about" className="site-footer__heading">The Home Lab</h2>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/account">Your account</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            {social.map((s) => (
              <li key={s.label}><a href={s.href} rel="noopener noreferrer" target="_blank">{s.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__heading">Contact</h2>
          <ul className="site-footer__contact">
            {contact.email && <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
            {contact.phone && <li><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>}
            {contact.hours && <li>{contact.hours}</li>}
            <li><Link href="/contact">Send us a message</Link></li>
          </ul>
          <p className="site-footer__market">Based in {siteConfig.market.country} · Prices in euro (€)</p>
        </div>
      </div>

      <p className="site-footer__note">
        Pieces may differ slightly from the photos. If you are unsure about anything, please <Link href="/contact">get in touch</Link>.
      </p>

      <div className="site-footer__legal">
        <p>
          © {new Date().getFullYear()} {legal.companyName ?? 'The Home Lab'}
          {legal.companyNumber ? ` · Company no. ${legal.companyNumber}` : ''}
          {legal.vatNumber ? ` · VAT ${legal.vatNumber}` : ''}
        </p>
        <ul>
          {POLICY_LINKS.map((l) => (
            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
          ))}
          <li><CookieSettingsLink /></li>
        </ul>
      </div>
    </footer>
  );
}
