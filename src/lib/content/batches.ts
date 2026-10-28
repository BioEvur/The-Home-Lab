/**
 * Pre-order batches.
 *
 * Sets are packed and sent in batches: orders close on a date, the pieces are
 * ordered from suppliers, and every set in the batch ships by its ship-by date.
 * Change the dates here and the set pages, homepage and basket all follow.
 * Pages are rebuilt hourly, so a batch that has closed drops off on its own.
 */
export interface Batch {
  /** Shown in the button and copy, e.g. "Christmas". */
  name: string;
  /** Last day to order, inclusive (YYYY-MM-DD, Irish time). */
  ordersClose: string;
  /** Every set in the batch is posted by this day. */
  shipsBy: string;
}

export const BATCHES: Batch[] = [{ name: 'Christmas', ordersClose: '2026-11-17', shipsBy: '2026-12-12' }];

/** Shown once every batch above has closed, until a new one is added. */
export const ROLLING = {
  cta: 'Pre-order the set',
  line: 'Packed to order and posted within three weeks.',
};

export function currentBatch(now = new Date()): Batch | null {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(now);
  return BATCHES.find((b) => b.ordersClose >= today) ?? null;
}

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** The words used wherever a set can be ordered. */
export function preorderCopy(now = new Date()) {
  const batch = currentBatch(now);
  if (!batch) return { batch, cta: ROLLING.cta, line: ROLLING.line, short: ROLLING.line, basket: ROLLING.line };
  const isChristmas = batch.name === 'Christmas';
  return {
    batch,
    cta: isChristmas ? 'Pre-order for Christmas' : `Pre-order for ${batch.name}`,
    line: `Order by ${formatDay(batch.ordersClose)} and it ships by ${formatDay(batch.shipsBy)}${isChristmas ? ', in time for Christmas' : ''}.`,
    short: `${batch.name} orders close ${formatDay(batch.ordersClose)}`,
    basket: `Pre-order. Ships by ${formatDay(batch.shipsBy)}.`,
  };
}
