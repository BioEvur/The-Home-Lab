'use client';
import { useId, useState } from 'react';
import type { Product } from '@/lib/catalog/types';
import { defaultVariant, findVariant, isValueAvailable, optionsOf } from '@/lib/catalog/variants';
import { Icon } from '@/components/ui/Icon';
import { useCart } from './CartProvider';
import { toCartLine } from './toLine';

/**
 * Card-level add to basket. Single-variant products add directly; products
 * with options open a compact chooser on the card. Unavailable combinations
 * are disabled and can never be added.
 */
export function QuickAdd({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>(() => optionsOf(defaultVariant(product)));
  const panelId = useId();
  const anyAvailable = product.variants.some((v) => v.availableForSale);

  if (!anyAvailable) {
    return (
      <button type="button" className="quick-add quick-add--disabled" disabled>
        Currently unavailable
      </button>
    );
  }

  if (product.variants.length === 1) {
    return (
      <button type="button" className="quick-add" onClick={() => addLine(toCartLine(product, product.variants[0]))}>
        <Icon name="plus" size={16} /> Add to basket
      </button>
    );
  }

  const variant = findVariant(product, selected);
  const canAdd = Boolean(variant?.availableForSale);

  return (
    <div className={`quick-add-wrap ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="quick-add"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? 'close' : 'plus'} size={16} /> {open ? 'Close' : 'Quick add'}
      </button>
      <div id={panelId} className="quick-add__panel" hidden={!open}>
        {product.options.map((option) => (
          <fieldset key={option.name} className="quick-add__option">
            <legend>{option.name}</legend>
            <div className="quick-add__values">
              {option.values.map((value) => {
                const available = isValueAvailable(product, selected, option.name, value);
                const active = selected[option.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`chip ${active ? 'is-active' : ''} ${available ? '' : 'is-unavailable'}`}
                    aria-pressed={active}
                    onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  >
                    {value}
                    {!available && <span className="visually-hidden"> (unavailable)</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className="button button--primary button--small button--block"
          disabled={!canAdd}
          onClick={() => {
            if (!variant || !canAdd) return;
            addLine(toCartLine(product, variant));
            setOpen(false);
          }}
        >
          {canAdd ? 'Add to basket' : 'This combination is unavailable'}
        </button>
      </div>
    </div>
  );
}
