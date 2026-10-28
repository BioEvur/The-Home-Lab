'use client';
import Link from 'next/link';
import { HELP_LINKS } from '@/lib/content/navigation';
import { ROOM_SETS } from '@/lib/content/sets';
import { useAuth } from '@/components/account/AuthProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { count, open: openCart } = useCart();
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left" className="mobile-nav">
      <nav aria-label="Mobile">
        <ul className="mobile-nav__list">
          {ROOM_SETS.map((set) => (
            <li key={set.handle}>
              <Link href={`/sets/${set.handle}`} onClick={onClose} className="mobile-nav__set">
                {set.title}
                <span>{set.status === 'coming-soon' ? `${set.place}, opening soon` : set.place}</span>
              </Link>
            </li>
          ))}
          <li><Link href="/shop" onClick={onClose}>Shop every piece</Link></li>
          <li><Link href="/about" onClick={onClose}>About</Link></li>
          <li><Link href="/help" onClick={onClose}>Help</Link></li>
        </ul>
      </nav>
      <div className="mobile-nav__utility">
        <Link href={user ? '/account' : '/account/login'} onClick={onClose}><Icon name="user" size={18} /> {user ? 'Your account' : 'Sign in or create an account'}</Link>
        <Link href="/wishlist" onClick={onClose}><Icon name="heart" size={18} /> Wishlist</Link>
        <button type="button" onClick={() => { onClose(); openCart(); }}><Icon name="bag" size={18} /> Basket{count ? ` (${count})` : ''}</button>
      </div>
      <ul className="mobile-nav__help">
        {HELP_LINKS.slice(1, 5).map((l) => (
          <li key={l.href}><Link href={l.href} onClick={onClose}>{l.label}</Link></li>
        ))}
      </ul>
    </Drawer>
  );
}
