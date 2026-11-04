import { formatDay, preorderCopy } from './batches';

/** Homepage questions; also published as FAQ structured data. */
export function homeFaqs(now = new Date()) {
  const { batch } = preorderCopy(now);
  return [
    {
      q: 'What is a room set?',
      a: 'A room set is every piece you need to recreate one corner of a real place, chosen to work together and packed in one box. The Kyoto Kissaten set, for example, is a complete pour-over coffee setup: dripper and jug, gooseneck kettle, hand grinder, four cups and a serving board.',
    },
    {
      q: 'Will my order arrive before Christmas?',
      a: batch
        ? `Yes, if you order by ${formatDay(batch.ordersClose)}. Every set in the Christmas batch is posted by ${formatDay(batch.shipsBy)}. Orders placed after that go in the next batch, and the new date is shown before you pay.`
        : 'Each set page shows the date its current batch ships by, and the same date is in your basket before you pay.',
    },
    {
      q: 'Where do you deliver, and how much is it?',
      a: 'We deliver anywhere in the Republic of Ireland. Delivery is charged at our standard rate, shown at checkout before you pay. Because we post from Ireland, there are no customs or import charges when it arrives.',
    },
    {
      q: 'Can I send a set straight to someone as a gift?',
      a: 'Yes. Enter their name and address as the delivery address at checkout, and the set is posted to them in its box.',
    },
    {
      q: 'Can I buy just one piece?',
      a: 'Yes. Every piece in every set is also sold on its own in the shop. Buying the whole set always costs less than buying its pieces one by one.',
    },
    {
      q: 'What if I change my mind?',
      a: 'You can change or cancel free of charge until the batch closes. After delivery you have 14 days to cancel without giving a reason, and you can return a whole set or single pieces.',
    },
  ];
}
