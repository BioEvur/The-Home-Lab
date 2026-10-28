import type { Product, ProductVariant, SelectedOption } from './types';

export function findVariant(product: Product, selected: Record<string, string>): ProductVariant | null {
  return (
    product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ??
    (product.options.length === 0 ? product.variants[0] ?? null : null)
  );
}

export function optionsOf(variant: ProductVariant): Record<string, string> {
  return Object.fromEntries(variant.selectedOptions.map((o: SelectedOption) => [o.name, o.value]));
}

/** First available variant, or the first variant if nothing is available. */
export function defaultVariant(product: Product): ProductVariant {
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0];
}

/**
 * Whether choosing `value` for `optionName`, keeping the other current
 * selections, leads to a variant that can be bought.
 */
export function isValueAvailable(product: Product, selected: Record<string, string>, optionName: string, value: string) {
  const next = { ...selected, [optionName]: value };
  const variant = findVariant(product, next);
  return Boolean(variant?.availableForSale);
}

export function variantImage(product: Product, variant: ProductVariant | null) {
  return product.images.find((img) => img.id === variant?.imageId) ?? product.images[0] ?? null;
}

export function variantLabel(variant: ProductVariant) {
  return variant.title === 'Default' ? null : variant.title;
}
