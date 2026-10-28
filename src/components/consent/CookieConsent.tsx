'use client';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent, type ConsentState } from '@/lib/consent';
import { Drawer } from '@/components/ui/Drawer';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Consent banner and preferences. Nothing non-essential runs until the
 * visitor opts in; "Reject" is as prominent as "Accept". Analytics only loads
 * when both consent and a measurement ID exist.
 */
export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = readConsent();
    setConsent(current);
    setAnalytics(current?.analytics ?? false);
    setMarketing(current?.marketing ?? false);
    setReady(true);
    const open = () => setPrefsOpen(true);
    window.addEventListener('thl:open-cookie-settings', open);
    return () => window.removeEventListener('thl:open-cookie-settings', open);
  }, []);

  const save = (choice: { analytics: boolean; marketing: boolean }) => {
    setConsent(writeConsent(choice));
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setPrefsOpen(false);
  };

  return (
    <>
      {ready && !consent && !prefsOpen && (
        <section className="consent-banner" aria-label="Cookie consent">
          <p>
            We use essential cookies to run this site, such as remembering your basket. With your permission we would also use analytics cookies to understand how the site is used.{' '}
            <Link href="/policies/cookies">Cookie policy</Link>
          </p>
          <div className="consent-banner__actions">
            <button type="button" className="button button--secondary button--small" onClick={() => save({ analytics: false, marketing: false })}>
              Reject non-essential
            </button>
            <button type="button" className="button button--secondary button--small" onClick={() => setPrefsOpen(true)}>
              Choose
            </button>
            <button type="button" className="button button--primary button--small" onClick={() => save({ analytics: true, marketing: true })}>
              Accept all
            </button>
          </div>
        </section>
      )}

      <Drawer open={prefsOpen} onClose={() => setPrefsOpen(false)} title="Cookie preferences" side="bottom" className="consent-prefs">
        <div className="consent-prefs__list">
          <div className="consent-option">
            <div>
              <h3>Essential</h3>
              <p>Needed for the basket, wishlist, sign-in and security. Always on.</p>
            </div>
            <span className="consent-option__fixed">Always on</span>
          </div>
          <label className="consent-option">
            <div>
              <h3>Analytics</h3>
              <p>Helps us understand which pages and products are useful. No analytics provider is active until one is configured.</p>
            </div>
            <input type="checkbox" className="switch" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label className="consent-option">
            <div>
              <h3>Marketing</h3>
              <p>Lets advertising partners measure campaigns. None are currently in use.</p>
            </div>
            <input type="checkbox" className="switch" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
        <div className="consent-prefs__actions">
          <button type="button" className="button button--secondary" onClick={() => save({ analytics: false, marketing: false })}>
            Reject non-essential
          </button>
          <button type="button" className="button button--primary" onClick={() => save({ analytics, marketing })}>
            Save preferences
          </button>
        </div>
      </Drawer>

      {GA_ID && consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}

export function CookieSettingsLink() {
  return (
    <button type="button" className="link-button" onClick={() => window.dispatchEvent(new Event('thl:open-cookie-settings'))}>
      Cookie preferences
    </button>
  );
}
