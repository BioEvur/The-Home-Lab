import type { Metadata } from 'next';
import { WishlistView } from '@/components/commerce/WishlistView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container section--sm">
      <header className="page-head">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <h1 className="h1">Wishlist</h1>
      </header>
      <WishlistView />
    </div>
  );
}
