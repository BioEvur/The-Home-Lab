import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLocalProducts } from '@/lib/catalog/local';
import { findVariant, defaultVariant, optionsOf } from '@/lib/catalog/variants';
import { currentBatch, formatDay, preorderCopy } from '@/lib/content/batches';
import { ADD_ONS, addOnDiscounts } from '@/lib/content/addons';
import { boxOffer, setOffer } from '@/lib/catalog/offers';
import { GIFT_BOXES, giftBoxCopy } from '@/lib/content/boxes';
import { ROOM_SETS, itemCount, piecePhoto, piecesTotal, productHref, setForPiece } from '@/lib/content/sets';
import { formatMoney, isOnSale } from '@/lib/format';

const products = getLocalProducts();

test('the catalogue is the three room sets, every piece in them, the gift boxes and the add-ons', () => {
  const pieces = ROOM_SETS.flatMap((s) => s.pieces.map((p) => p.handle));
  assert.deepEqual(
    products.map((p) => p.handle).sort(),
    [...ROOM_SETS.map((s) => s.handle), ...pieces, ...GIFT_BOXES.map((b) => b.handle), ...ADD_ONS.map((a) => a.handle)].sort(),
  );
  for (const p of products) {
    assert.equal(p.variants.length, 1, p.handle);
    const type = ROOM_SETS.some((s) => s.handle === p.handle)
      ? 'Room set'
      : pieces.includes(p.handle)
        ? 'Piece'
        : GIFT_BOXES.some((b) => b.handle === p.handle)
          ? 'Gift box'
          : 'Add-on';
    assert.equal(p.productType, type, p.handle);
  }
});

test('piece and add-on prices match the set pages', () => {
  for (const set of ROOM_SETS)
    for (const piece of set.pieces) assert.equal(products.find((p) => p.handle === piece.handle).variants[0].price.amount, piece.price, piece.handle);
  for (const a of ADD_ONS) assert.equal(products.find((p) => p.handle === a.handle).variants[0].price.amount, a.price, a.handle);
});

test('every set costs less than its pieces bought separately', () => {
  for (const set of ROOM_SETS) {
    const offer = setOffer(set, products);
    assert.ok(offer, set.handle);
    assert.equal(offer.separately, piecesTotal(set));
    assert.ok(offer.saving > 0 && offer.setPrice + offer.saving === offer.separately, set.handle);
  }
  assert.deepEqual(
    ROOM_SETS.map((s) => setOffer(s, products).saving),
    [3900, 7500, 8900],
  );
});

test('every gift box is pieces from one live set, cheaper than those pieces on their own', () => {
  for (const box of GIFT_BOXES) {
    const set = ROOM_SETS.find((s) => s.handle === box.set);
    assert.ok(set && set.status === 'available', box.handle);
    for (const h of box.pieces) assert.ok(set.pieces.some((p) => p.handle === h), `${box.handle} → ${h}`);
    const offer = boxOffer(box, products);
    assert.ok(offer && offer.saving > 0, box.handle);
    assert.ok(offer.boxPrice < setOffer(set, products).setPrice, box.handle);
  }
  assert.deepEqual(GIFT_BOXES.map((b) => boxOffer(b, products).saving), [700]);
});

test('a gift box is pre-ordered until its stock date, then in stock, with Christmas wording only until its last order day', () => {
  const box = GIFT_BOXES[0];
  const before = giftBoxCopy(box, new Date('2026-11-27T12:00:00Z'));
  assert.equal(before.inStock, false);
  assert.equal(before.cta, 'Pre-order the box');
  assert.equal(before.line, 'Posted from 7 December. Order by 16 December for Christmas.');
  const during = giftBoxCopy(box, new Date('2026-12-10T12:00:00Z'));
  assert.equal(during.inStock, true);
  assert.equal(during.line, 'In stock. Posted within two working days. Order by 16 December for Christmas.');
  const after = giftBoxCopy(box, new Date('2027-02-01T12:00:00Z'));
  assert.equal(after.line, 'In stock. Posted within two working days.');
  assert.equal(after.basket, after.line);
});

test('an add-on costs less only with a room set, once per set', () => {
  const chair = ADD_ONS[0];
  assert.ok(chair.withSetPrice < chair.price);
  assert.deepEqual(addOnDiscounts([{ handle: chair.handle, quantity: 1 }]), []);
  assert.deepEqual(addOnDiscounts([{ handle: ROOM_SETS[1].handle, quantity: 1 }]), []);
  const one = addOnDiscounts([
    { handle: 'kyoto-kissaten', quantity: 1 },
    { handle: chair.handle, quantity: 2 },
  ]);
  assert.equal(one.length, 1);
  assert.equal(one[0].quantity, 1);
  assert.equal(one[0].amount, chair.price - chair.withSetPrice);
  // A single piece is not a set.
  assert.deepEqual(addOnDiscounts([{ handle: ROOM_SETS[0].pieces[0].handle, quantity: 1 }, { handle: chair.handle, quantity: 1 }]), []);
});

test('pieces and add-ons link to product pages, sets to set pages', () => {
  assert.equal(productHref('kyoto-kissaten'), '/sets/kyoto-kissaten');
  assert.equal(productHref(ROOM_SETS[0].pieces[0].handle), `/products/${ROOM_SETS[0].pieces[0].handle}`);
  assert.equal(setForPiece(ROOM_SETS[2].pieces[0].handle).handle, ROOM_SETS[2].handle);
});

test('every product is marked as development data, and stand-in photos are marked as samples', () => {
  for (const p of products) {
    assert.equal(p.source, 'development');
    assert.ok(p.images.length > 0, p.handle);
    for (const i of p.images) assert.equal(i.sample, !i.src.startsWith('/'), i.src);
  }
});

test('every piece in every set has a photo, a quantity and a spec', () => {
  for (const set of ROOM_SETS) {
    assert.ok(set.pieces.length >= 4, set.handle);
    assert.equal(set.beats.length, 3, set.handle);
    for (const piece of set.pieces) {
      assert.ok(piecePhoto(piece), `${set.handle} → ${piece.handle}`);
      assert.ok(piece.qty >= 1 && piece.short.length > 0 && piece.details.length >= 2, piece.handle);
    }
  }
  assert.equal(itemCount(ROOM_SETS[0]), 8);
});

test('only Riad Corner, and its pieces, are unavailable while it is coming soon', () => {
  for (const set of ROOM_SETS) {
    for (const handle of [set.handle, ...set.pieces.map((p) => p.handle)]) {
      const product = products.find((p) => p.handle === handle);
      assert.equal(defaultVariant(product).availableForSale, set.status === 'available', handle);
    }
  }
});

test('pre-order copy follows the Christmas batch, then falls back after it closes', () => {
  const before = preorderCopy(new Date('2026-11-01T12:00:00Z'));
  assert.equal(before.batch?.name, 'Christmas');
  assert.equal(before.cta, 'Pre-order for Christmas');
  assert.match(before.line, /22 November.*12 December/);
  // The last day to order still counts, in Irish time.
  assert.equal(currentBatch(new Date('2026-11-22T23:30:00Z'))?.name, 'Christmas');
  const after = preorderCopy(new Date('2026-11-24T12:00:00Z'));
  assert.equal(after.batch, null);
  assert.equal(after.cta, 'Pre-order the set');
  assert.equal(formatDay('2026-12-12'), '12 December');
});

test('variant lookup matches selected options and default variant is available when possible', () => {
  for (const p of products) {
    const d = defaultVariant(p);
    assert.ok(d);
    if (p.variants.some((v) => v.availableForSale)) assert.ok(d.availableForSale, p.handle);
    for (const v of p.variants) assert.equal(findVariant(p, optionsOf(v))?.id, v.id);
  }
});

test('money formatting uses cents and drops decimals for whole euros', () => {
  assert.equal(formatMoney(129000), '€1,290');
  assert.equal(formatMoney(1950), '€19.50');
  assert.equal(isOnSale({ price: { amount: 16500, currencyCode: 'EUR' }, compareAtPrice: { amount: 19500, currencyCode: 'EUR' } }), true);
  assert.equal(isOnSale({ price: { amount: 16500, currencyCode: 'EUR' }, compareAtPrice: null }), false);
});
