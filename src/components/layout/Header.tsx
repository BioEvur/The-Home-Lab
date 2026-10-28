'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PRIMARY_NAV } from '@/lib/content/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/components/account/AuthProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { useWishlist } from '@/components/commerce/WishlistProvider';
import { Icon } from '@/components/ui/Icon';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const { count, open: openCart, hydrated } = useCart();
  const { handles, hydrated: wishHydrated } = useWishlist();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  // A sentinel avoids running work on every scroll event.
  useEffect(() => {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (hydrated && count > prevCount.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 500);
      prevCount.current = count;
      return () => window.clearTimeout(t);
    }
    prevCount.current = count;
  }, [count, hydrated]);

  const isActive = (href: string) => !href.includes('?') && (pathname === href || pathname.startsWith(`${href}/`));
  // Pages that open on a full-bleed photograph get the transparent header.
  const isHome = pathname === '/' || /^\/sets\/[^/]+$/.test(pathname);
  const transparent = isHome && !scrolled;

  return (
    <>
      <header className={`site-header ${isHome ? 'site-header--home' : ''} ${transparent ? 'is-transparent' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <button type="button" className="icon-button site-header__menu" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <Icon name="menu" />
          </button>

          <Link href="/" className="site-header__logo" aria-label="The Home Lab, home">
            <Logo />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <ul>
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`site-nav__link ${isActive(item.href) ? 'is-active' : ''}`} aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Link href={user ? '/account' : '/account/login'} className="icon-button site-header__account" aria-label={user ? 'Your account' : 'Sign in'}>
              <Icon name="user" />
            </Link>
            <Link href="/wishlist" className="icon-button site-header__wish" aria-label={`Wishlist${wishHydrated && handles.length ? `, ${handles.length} saved` : ''}`}>
              <Icon name="heart" />
              {wishHydrated && handles.length > 0 && <span className="count-dot" aria-hidden="true">{handles.length}</span>}
            </Link>
            <button type="button" className="icon-button site-header__bag" onClick={openCart} aria-label={`Basket, ${hydrated ? count : 0} ${hydrated && count === 1 ? 'item' : 'items'}`}>
              <Icon name="bag" />
              {hydrated && count > 0 && (
                <span className={`count-dot count-dot--ink ${bump ? 'is-bumping' : ''}`} aria-hidden="true">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
