import type { Product, ProductVariant } from '@/lib/catalog/types';
import { variantImage, variantLabel } from '@/lib/catalog/variants';
import type { CartLine } from './CartProvider';

/** Builds the basket payload from the selected variant: price and image always come from that variant. */
export function toCartLine(product: Product, variant: ProductVariant): Omit<CartLine, 'quantity'> {
  const img = variantImage(product, variant);
  return {
    variantId: variant.id,
    handle: product.handle,
    title: product.title,
    variantTitle: variantLabel(variant),
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    image: img ? { src: img.src, alt: img.alt } : null,
  };
}
