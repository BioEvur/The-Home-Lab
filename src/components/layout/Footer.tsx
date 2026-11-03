import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { HELP_LINKS, POLICY_LINKS } from '@/lib/content/navigation';
import { ROOM_SETS } from '@/lib/content/sets';
import { LogoMark } from '@/components/brand/Logo';
import { CookieSettingsLink } from '@/components/consent/CookieConsent';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

/**
 * Site footer: newsletter sign-up and navigation on top, then the legal line
 * with the logo set very large in the bottom right corner.
 */
export function Footer() {
  const { contact, social, legal } = siteConfig;
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <section className="site-footer__join" aria-labelledby="footer-join">
            <h2 id="footer-join" className="site-footer__title">Join the list</h2>
            <p>New rooms when they open, the last day to order in each batch, and now and then a recipe. A couple of emails a month at most.</p>
            <NewsletterForm tone="dark" source="footer" />
          </section>

          <div className="site-footer__nav">
            <nav aria-labelledby="footer-shop">
              <h2 id="footer-shop" className="site-footer__heading">Shop</h2>
              <ul>
                {ROOM_SETS.map((s) => (
                  <li key={s.handle}>
                    <Link href={`/sets/${s.handle}`}>{s.title}</Link>
                  </li>
                ))}
                <li><Link href="/shop">Shop every piece</Link></li>
              </ul>
            </nav>
            <nav aria-labelledby="footer-help">
              <h2 id="footer-help" className="site-footer__heading">Help</h2>
              <ul>
                {HELP_LINKS.filter((l) => l.href !== '/contact').map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="footer-about">
              <h2 id="footer-about" className="site-footer__heading">The Home Lab</h2>
              <ul>
                <li><Link href="/about">About us</Link></li>
                <li><Link href="/account">Your account</Link></li>
                <li><Link href="/wishlist">Wishlist</Link></li>
                <li><Link href="/cart">Basket</Link></li>
                {social.map((s) => (
                  <li key={s.label}><a href={s.href} rel="noopener noreferrer" target="_blank">{s.label}</a></li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className="site-footer__heading">Contact</h2>
              <ul>
                {contact.email && <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
                <li><Link href="/contact">Send us a message</Link></li>
              </ul>
              <p className="site-footer__market">Based in {siteConfig.market.country}. Prices in euro.</p>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__legal">
            <p className="site-footer__note">
              Pieces may differ slightly from the photos. If you are unsure about anything, please <Link href="/contact">get in touch</Link>.
            </p>
            <ul>
              {POLICY_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
              <li><CookieSettingsLink /></li>
            </ul>
            <p>
              © {new Date().getFullYear()} {legal.companyName ?? 'The Home Lab'}
              {legal.companyNumber ? ` · Company no. ${legal.companyNumber}` : ''}
              {legal.vatNumber ? ` · VAT ${legal.vatNumber}` : ''}
            </p>
          </div>
          <Link href="/" className="site-footer__lockup" aria-label="The Home Lab, home page">
            <LogoMark className="site-footer__mark" />
            <span className="site-footer__name" aria-hidden="true">The Home Lab</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
