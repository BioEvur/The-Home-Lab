import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BATCHES, isChristmasBatch, preorderCopy } from '@/lib/content/batches';
import { blackFriday, preorderPage } from '@/lib/content/preorders';

const at = (iso) => new Date(`${iso}T12:00:00Z`);

test('Black Friday is the day after the fourth Thursday of November', () => {
  assert.equal(blackFriday(2024), '2024-11-29');
  assert.equal(blackFriday(2025), '2025-11-28');
  assert.equal(blackFriday(2026), '2026-11-27');
  assert.equal(blackFriday(2030), '2030-11-29');
});

test('a Christmas batch is one named for Christmas and posted by 20 December', () => {
  assert.ok(isChristmasBatch({ name: 'Christmas', ordersClose: '2026-11-17', shipsBy: '2026-12-12' }));
  assert.ok(isChristmasBatch({ name: 'Last Christmas', ordersClose: '2026-11-30', shipsBy: '2026-12-15' }));
  assert.ok(!isChristmasBatch({ name: 'Christmas', ordersClose: '2026-12-10', shipsBy: '2026-12-23' }));
  assert.ok(!isChristmasBatch({ name: 'January', ordersClose: '2027-01-10', shipsBy: '2027-01-30' }));
});

test('while the Christmas batch is open, the page leads with its dates', () => {
  const page = preorderPage(at('2026-11-04'));
  assert.equal(page.phase, 'christmas');
  assert.equal(page.title, 'Order by 17 November for Christmas.');
  assert.match(page.lede, /posted from Ireland by 12 December/);
  assert.deepEqual([page.dates.orderBy, page.dates.postedBy], ['17 November', '12 December']);
  assert.equal(page.cta, 'Pre-order for Christmas');
  assert.match(page.christmasAnswer, /^Yes, if you order by 17 November/);
  assert.ok(page.noSaleSeason);
});

test('after the batch closes, the page says so and makes no Christmas promise', () => {
  const page = preorderPage(at('2026-11-27'));
  assert.equal(page.phase, 'rolling');
  assert.equal(page.title, 'No Black Friday sale. Here is what we can promise.');
  assert.match(page.lede, /^Christmas orders closed on 17 November\./);
  // Within three weeks of today, as the rolling copy promises.
  assert.equal(page.dates.postedByIso, '2026-12-18');
  assert.equal(page.dates.orderBy, 'Today');
  assert.match(page.christmasAnswer, /cannot promise/);
  assert.equal(page.cta, preorderCopy(at('2026-11-27')).cta);
});

test('the Black Friday wording stops after Cyber Monday week', () => {
  assert.ok(preorderPage(at('2026-12-02')).noSaleSeason);
  const page = preorderPage(at('2026-12-03'));
  assert.ok(!page.noSaleSeason);
  assert.equal(page.title, 'Pre-order a room set.');
});

test('a confirmed second Christmas batch becomes the Black Friday offer', () => {
  BATCHES.push({ name: 'Last Christmas', ordersClose: '2026-11-30', shipsBy: '2026-12-15' });
  try {
    const page = preorderPage(at('2026-11-27'));
    assert.equal(page.phase, 'christmas');
    assert.equal(page.title, 'No Black Friday sale. One more Christmas batch.');
    assert.match(page.lede, /closed on 17 November\. Order by 30 November .* by 15 December\./);
    assert.equal(page.cta, 'Pre-order for Christmas');
    assert.match(preorderCopy(at('2026-11-27')).line, /in time for Christmas/);
  } finally {
    BATCHES.pop();
  }
});

test('a later, non-Christmas batch is named in the headline', () => {
  BATCHES.push({ name: 'January', ordersClose: '2027-01-10', shipsBy: '2027-01-30' });
  try {
    const page = preorderPage(at('2026-12-20'));
    assert.equal(page.phase, 'batch');
    assert.equal(page.title, 'Pre-order for January.');
    assert.match(page.lede, /^Christmas orders closed on 17 November\. Order by 10 January for the January batch/);
  } finally {
    BATCHES.pop();
  }
});
