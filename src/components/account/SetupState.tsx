import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

/** Honest placeholder shown in account pages until Supabase is configured. */
export function AccountSetupState({ feature }: { feature: string }) {
  return (
    <div className="setup-state">
      <Icon name="info" size={22} />
      <div>
        <h2 className="h3">Accounts are not connected yet</h2>
        <p>
          {feature} will appear here once customer accounts are connected. This development build does not create accounts, store personal details or show real
          orders.
        </p>
        <p className="muted">Your basket and wishlist still work on this device.</p>
        <div className="setup-state__actions">
          <Link href="/wishlist" className="button button--secondary button--small">
            View wishlist
          </Link>
          <Link href="/" className="button button--secondary button--small">
            See the room sets
          </Link>
        </div>
      </div>
    </div>
  );
}
