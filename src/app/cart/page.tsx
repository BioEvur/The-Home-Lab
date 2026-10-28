import type { Metadata } from 'next';
import { CartPageView } from '@/components/commerce/CartPageView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = { title: 'Basket', robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container section--sm">
      <header className="page-head">
        <Breadcrumbs items={[{ label: 'Basket' }]} />
        <h1 className="h1">Your basket</h1>
      </header>
      <CartPageView />
    </div>
  );
}
