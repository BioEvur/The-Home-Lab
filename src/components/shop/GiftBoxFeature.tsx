import Link from 'next/link';
import type { Product } from '@/lib/catalog/types';
import { giftBoxCopy, type GiftBox } from '@/lib/content/boxes';
import type { RoomSetContent } from '@/lib/content/sets';
import { formatMoney } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

/**
 * A gift box shown large: photo, what is in it, price against the pieces, and
 * when it is posted. Used on the homepage and its set page. Outside a set page
 * it brings its set's colours with it (`themed`); on the set page its second
 * link jumps to the set's own order box.
 */
export function GiftBoxFeature({
  box,
  product,
  set,
  separately,
  themed = false,
  headingLevel = 2,
}: {
  box: GiftBox;
  product: Product;
  set: RoomSetContent;
  /** What the pieces in the box cost bought one by one, in cents. */
  separately: number;
  themed?: boolean;
  headingLevel?: 2 | 3;
}) {
  const copy = giftBoxCopy(box);
  const price = product.variants[0].price;
  const image = product.images[0];
  const Heading = `h${headingLevel}` as const;
  const saving = separately - price.amount;

  return (
    <section id={`box-${box.handle}`} className={`world-addon${themed ? ` world world--${set.theme}` : ''}`} aria-labelledby={`box-title-${box.handle}`}>
      <div className="container world-addon__inner">
        <div className="world-addon__media">
          {image && <Media src={image.src} alt={image.alt} ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" />}
        </div>
        <div className="world-addon__body">
          <p className="world-addon__kicker">Gift box from {set.title}</p>
          <Heading id={`box-title-${box.handle}`} className="display-2">
            {box.title}
          </Heading>
          <p className="world-addon__what">{box.what}</p>
          <p className="world-addon__price">
            <strong>{formatMoney(price)}</strong>
            {saving > 0 && (
              <span>
                ({formatMoney(separately)} for the pieces bought separately)
              </span>
            )}
          </p>
          <p className="world-addon__delivery">{copy.line}</p>
          <div className="world-addon__actions">
            <Link href={`/products/${box.handle}`} className="button button--accent">
              See the gift box
            </Link>
            <Link href={themed ? `/sets/${set.handle}` : '#order'} className="arrow-link">
              Or the whole {set.title} set <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
