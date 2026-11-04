/**
 * The pre-order landing page at /preorders.
 *
 * Every line on the page that depends on the date comes from here, worked
 * out from the batches in `batches.ts`. The page is rebuilt hourly, so it
 * moves through its states by itself:
 *
 * - `christmas`: a Christmas batch is open ("Order by 17 November for Christmas").
 * - `batch`: a later, non-Christmas batch is open (for example "January").
 * - `rolling`: no batch is open; sets are posted within three weeks of ordering.
 *
 * From 1 November to 2 December the page also says plainly that there is no
 * Black Friday sale. Nothing here invents a discount, a countdown or a date
 * that is not in `batches.ts`.
 */
import { BATCHES, ROLLING, dublinToday, formatDay, isChristmasBatch, preorderCopy, type Batch } from './batches';

export type PreorderPhase = 'christmas' | 'batch' | 'rolling';

/** How long a rolling order takes to post, matching ROLLING.line ("within three weeks"). */
export const ROLLING_DAYS = 21;

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Black Friday is the day after the fourth Thursday of November (US Thanksgiving). */
export function blackFriday(year: number) {
  const first = new Date(Date.UTC(year, 10, 1, 12));
  const firstThursday = 1 + ((4 - first.getUTCDay() + 7) % 7);
  return `${year}-11-${String(firstThursday + 22).padStart(2, '0')}`;
}

export function preorderPage(now = new Date()) {
  const today = dublinToday(now);
  const year = today.slice(0, 4);
  const copy = preorderCopy(now);
  const batch = copy.batch;
  const phase: PreorderPhase = !batch ? 'rolling' : isChristmasBatch(batch) ? 'christmas' : 'batch';

  // The most recent Christmas batch this year that has already closed.
  const closedChristmas: Batch | null =
    [...BATCHES].reverse().find((b) => isChristmasBatch(b) && b.ordersClose < today && b.ordersClose.startsWith(year)) ?? null;

  // The "no Black Friday sale" wording runs through November and until Cyber Monday week ends.
  const noSaleSeason = today >= `${year}-11-01` && today <= addDays(blackFriday(Number(year)), 5);

  const orderBy = batch ? formatDay(batch.ordersClose) : 'Today';
  const postedByIso = batch ? batch.shipsBy : addDays(today, ROLLING_DAYS);
  const postedBy = formatDay(postedByIso);

  let title: string;
  let lede: string;
  if (phase === 'christmas' && !closedChristmas) {
    title = `Order by ${orderBy} for Christmas.`;
    lede = `Every set in the ${batch!.name} batch is packed in one box and posted from Ireland by ${postedBy}.`;
  } else if (phase === 'christmas') {
    title = noSaleSeason ? 'No Black Friday sale. One more Christmas batch.' : 'One more Christmas batch.';
    lede = `Our first Christmas batch closed on ${formatDay(closedChristmas!.ordersClose)}. Order by ${orderBy} and your set is posted from Ireland by ${postedBy}.`;
  } else {
    title = noSaleSeason ? 'No Black Friday sale. Here is what we can promise.' : phase === 'batch' ? `Pre-order for ${batch!.name}.` : 'Pre-order a room set.';
    const closed = closedChristmas ? `Christmas orders closed on ${formatDay(closedChristmas.ordersClose)}. ` : '';
    lede =
      phase === 'batch'
        ? `${closed}Order by ${orderBy} for the ${batch!.name} batch and your set is posted from Ireland by ${postedBy}.`
        : `${closed}Sets ordered today are packed to order and posted from Ireland by ${postedBy}. The date is in your basket before you pay.`;
  }

  /** Answers that change with the batch. The rest of the FAQ is in the page. */
  const christmasAnswer =
    phase === 'christmas'
      ? `Yes, if you order by ${orderBy}. Every set in the ${batch!.name} batch is posted by ${postedBy}, and An Post or courier delivery usually takes 1 to 3 working days after that.`
      : closedChristmas
        ? `Christmas orders closed on ${formatDay(closedChristmas.ordersClose)}, so we cannot promise a new order will arrive before Christmas. Sets ordered today are posted by ${postedBy}${phase === 'batch' ? ` with the ${batch!.name} batch` : ''}, and the date is in your basket before you pay.`
        : null;

  const cancelAnswer = batch
    ? `You pay in full when you order. You can change or cancel free of charge until the batch closes on ${orderBy}. After delivery you have 14 days to cancel without giving a reason.`
    : 'You pay in full when you order. You can cancel for a full refund before your set is posted. After delivery you have 14 days to cancel without giving a reason.';

  return {
    phase,
    today,
    batch,
    closedChristmas,
    noSaleSeason,
    cta: copy.cta,
    line: batch ? copy.line : `Order today and it is posted by ${postedBy}.`,
    rollingLine: ROLLING.line,
    title,
    lede,
    dates: { orderBy, postedBy, postedByIso },
    christmasAnswer,
    cancelAnswer,
  };
}

export type PreorderPageCopy = ReturnType<typeof preorderPage>;
