import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Newsreader } from 'next/font/google';
import { commerceMode } from '@/lib/commerce/config';
import { isDevelopmentStage, SITE_URL, siteConfig } from '@/lib/config/site';
import { AuthProvider } from '@/components/account/AuthProvider';
import { CartDrawer } from '@/components/commerce/CartDrawer';
import { CartProvider } from '@/components/commerce/CartProvider';
import { CommerceModeProvider } from '@/components/commerce/CommerceMode';
import { WishlistProvider } from '@/components/commerce/WishlistProvider';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AnnouncementBar, DevelopmentNotice } from '@/components/layout/SiteNotices';
import { AnnouncerProvider } from '@/components/ui/Announcer';
import '@/styles/index.css';

const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', style: ['normal'], axes: ['opsz'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${siteConfig.name} · Room sets that bring a place home`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: { type: 'website', siteName: siteConfig.name, locale: 'en_IE', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'The Home Lab' }] },
  twitter: { card: 'summary_large_image' },
  // Development builds must never be indexed.
  robots: isDevelopmentStage ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: '#F5F3EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mode = commerceMode();
  return (
    <html lang="en-IE" className={`${sans.variable} ${serif.variable}`}>
      <head>
        {/* Opt in to reveal animations only when JavaScript is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CommerceModeProvider mode={mode}>
          <AnnouncerProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <div id="scroll-sentinel" aria-hidden="true" />
                  <AnnouncementBar />
                  <Header />
                  <main id="main" tabIndex={-1}>
                    {children}
                  </main>
                  <Footer />
                  <CartDrawer />
                  <DevelopmentNotice mode={mode} />
                  <CookieConsent />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </AnnouncerProvider>
        </CommerceModeProvider>
      </body>
    </html>
  );
}
