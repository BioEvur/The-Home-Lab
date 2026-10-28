import type { Metadata } from 'next';
import { WishlistView } from '@/components/commerce/WishlistView';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function AccountWishlistPage() {
  return (
    <section aria-labelledby="wishlist-title">
      <h2 id="wishlist-title" className="h2 account__title">
        Wishlist
      </h2>
      <WishlistView />
    </section>
  );
}
