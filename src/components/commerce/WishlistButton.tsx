'use client';
import { Icon } from '@/components/ui/Icon';
import { useWishlist } from './WishlistProvider';

export function WishlistButton({ handle, title, variant = 'icon' }: { handle: string; title: string; variant?: 'icon' | 'full' }) {
  const { has, toggle, hydrated } = useWishlist();
  const saved = hydrated && has(handle);
  const label = saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`;
  return (
    <button
      type="button"
      className={variant === 'icon' ? `wish-toggle ${saved ? 'is-saved' : ''}` : `button button--secondary wish-full ${saved ? 'is-saved' : ''}`}
      aria-pressed={saved}
      aria-label={variant === 'icon' ? label : undefined}
      onClick={(e) => {
        e.preventDefault();
        toggle(handle, title);
      }}
    >
      <Icon name="heart" size={variant === 'icon' ? 20 : 18} />
      {variant === 'full' && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
