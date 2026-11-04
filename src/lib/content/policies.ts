/**
 * Help and policy content.
 *
 * Text inside [[double brackets]] renders as a highlighted "To confirm"
 * marker; use it only for details that are still open. Set `draft: false` on a
 * page to show the draft banner. Nothing here has been reviewed by a solicitor.
 */
export interface ContentSection {
  heading: string;
  body: (string | { list: string[] })[];
}

export interface ContentPage {
  slug: string;
  title: string;
  description: string;
  /** Legal pages carry a draft banner until reviewed. */
  draft: boolean;
  sections: ContentSection[];
}

export const HELP_PAGES: ContentPage[] = [
  {
    slug: 'delivery',
    title: 'Delivery',
    description: 'How pre-order batches work, where we deliver and when your set ships.',
    draft: false,
    sections: [
      {
        heading: 'Where we deliver',
        body: ['We currently deliver to addresses in the Republic of Ireland only.'],
      },
      {
        heading: 'Delivery charges and times',
        body: [
          'Delivery options and charges for your address are shown at checkout before you pay.',
          'Sets are sent in batches. Each set page shows the date its current batch ships by, and the same date is in your basket and order confirmation.',
          'Sets are sent by An Post or courier and usually arrive 1 to 3 working days after they are posted. Large add-on furniture is sent by courier separately and arrives by the same ship-by date.',
          'Delivery is paid by the customer at our standard rate. There is no free-delivery offer.',
        ],
      },
      {
        heading: 'One box for each set',
        body: [
          'Every piece in a set is packed together and sent as one parcel.',
          'If a batch is delayed, we email you before the ship-by date passes. You can wait for the new date or cancel for a full refund.',
        ],
      },
      {
        heading: 'Tracking your order',
        body: ['Once your order ships you will receive an email with tracking details. Signed-in customers can also see order status in their account.'],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns',
    description: 'How to return something, and what happens next.',
    draft: false,
    sections: [
      {
        heading: 'Your right to cancel',
        body: [
          'If you buy online as a consumer in Ireland, you have the right to cancel within 14 days of receiving your goods, without giving a reason.',
        ],
      },
      {
        heading: 'How to start a return',
        body: ['To start a return, email info@thehomelab.ie or use the contact form within 14 days of receiving your order. Please include your order number and which pieces you are returning. We will reply with the return address.'],
      },
      {
        heading: 'Return costs',
        body: ['You pay for return delivery, unless the item is faulty or we sent you the wrong thing. For large add-on furniture, we can arrange a courier collection and tell you the cost before you agree to it.'],
      },
      {
        heading: 'Refunds',
        body: ['Refunds are made to the original payment method within 14 days of you telling us you are cancelling. We may wait until we receive the goods back, or until you show us proof that you have sent them, whichever is sooner.'],
      },
      {
        heading: 'Damaged or faulty items',
        body: ['If something arrives damaged or develops a fault, please contact us with photos and your order number so we can put it right. Please report damage in transit within 7 days of delivery. We will replace the item or refund you, and we cover any return costs. Your rights for faulty goods under Irish consumer law are not affected.'],
      },
    ],
  },
  {
    slug: 'orders',
    title: 'Orders',
    description: 'Changing, cancelling and checking on an order.',
    draft: false,
    sections: [
      {
        heading: 'Order confirmation',
        body: ['After you place an order you will receive a confirmation email from our checkout. If it has not arrived within an hour, check your spam folder and then contact us.'],
      },
      {
        heading: 'Changing or cancelling an order',
        body: ['Contact us as soon as possible with your order number. You can change or cancel your order free of charge until the batch closes. After that, your 14-day right to cancel still applies once you receive your set.'],
      },
      {
        heading: 'Order history',
        body: ['If you have an account, you can see your orders under Your account › Orders. Orders placed as a guest are linked to the email address used at checkout.'],
      },
    ],
  },
  {
    slug: 'payments',
    title: 'Payments',
    description: 'How payment works and which methods are accepted.',
    draft: false,
    sections: [
      {
        heading: 'Secure checkout',
        body: [
          'Payment is taken on our secure checkout, provided by Shopify. We never see or store your full card details.',
          'You can pay by debit or credit card, Apple Pay or Google Pay.',
        ],
      },
      {
        heading: 'Currency and VAT',
        body: ['Prices are shown in euro and are the full price you pay for the goods. Delivery is added at checkout.'],
      },
      {
        heading: 'Discount codes',
        body: ['Discount codes are entered in the basket or at checkout and are validated by the checkout. Only one code can be used per order unless stated otherwise.'],
      },
    ],
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do pre-orders work?',
    a: 'Sets are packed in batches. You order and pay now; when the batch closes, we put together every piece for your set, pack it in one box and post it by the date shown on the set page and in your basket.',
  },
  {
    q: 'Will my set arrive before Christmas?',
    a: 'If you order before the Christmas batch closes, your set ships by the date shown on its page. Orders placed after that go in the next batch, and the new date is shown before you pay.',
  },
  {
    q: 'What happens if a batch is delayed?',
    a: 'We email you before the ship-by date passes. You can then wait for the new date or cancel for a full refund.',
  },
  {
    q: 'Can I buy one piece from a set?',
    a: 'Yes. Every piece is also sold on its own in the shop. Buying the whole set always costs less than buying its pieces one by one.',
  },
  {
    q: 'Are the photos of the actual pieces?',
    a: 'For Kyoto Kissaten and The Milanese, yes: the photos show the actual pieces. Riad Corner is not open yet, so its photos are samples of similar pieces, each marked as a sample, until we photograph the real set.',
  },
  { q: 'Do I need an account to order?', a: 'No. You can check out as a guest. An account lets you see your orders, save addresses and keep a wishlist across devices.' },
  { q: 'Can I change or cancel my order?', a: 'Contact us as soon as possible with your order number. See the orders help page for details.' },
];

export const POLICY_PAGES: ContentPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy policy',
    description: 'How The Home Lab collects, uses and protects personal data.',
    draft: false,
    sections: [
      { heading: 'Who we are', body: ['The Home Lab, based in Ireland, is responsible for your personal data. Contact for privacy matters: info@thehomelab.ie.'] },
      {
        heading: 'What we collect',
        body: [
          {
            list: [
              'Account details: name, email address, and optionally phone number and saved addresses.',
              'Order details, processed by our commerce platform (Shopify) when you check out.',
              'Wishlist items saved to your account.',
              'Newsletter sign-ups, including the wording you agreed to and when.',
              'Messages you send through the contact form.',
              'Technical data needed to run the site securely; analytics data only with your consent.',
            ],
          },
        ],
      },
      { heading: 'Why we use it and our legal bases', body: ['We use your details to process your orders and run your account (to perform our contract with you), to send marketing emails only if you have opted in (your consent, which you can withdraw at any time), to keep the site secure and prevent fraud (our legitimate interests), and to keep order records for tax purposes (a legal obligation).'] },
      {
        heading: 'Who we share it with',
        body: [
          'We use service providers to run the shop: Shopify (catalogue, checkout and orders), Supabase (customer accounts and preferences), Resend (the emails we send), Zoho (our email inbox), Shopify Payments (card payments) and our delivery carriers (An Post and courier companies).',
          'Some of these providers store data outside the European Economic Area. Where they do, it is protected by the European Commission’s Standard Contractual Clauses or the EU-US Data Privacy Framework.',
        ],
      },
      { heading: 'How long we keep it', body: ['Order records: 6 years, as required for tax purposes. Your account: until you delete it. Newsletter details and consent: until you unsubscribe. Contact form messages: up to 2 years.'] },
      {
        heading: 'Your rights',
        body: [
          'Under the GDPR you can request access to, correction or deletion of your personal data, object to or restrict processing, and request portability. You can complain to the Data Protection Commission (dataprotection.ie).',
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie policy',
    description: 'Which cookies and similar technologies the site uses, and how to control them.',
    draft: false,
    sections: [
      {
        heading: 'Essential',
        body: [
          'Used to run the site and cannot be switched off: your cookie choices (thl_consent), sign-in session cookies when you have an account, and browser storage for your basket, wishlist and recently viewed items on this device.',
        ],
      },
      {
        heading: 'Analytics',
        body: ['Only set if you opt in. No analytics provider is currently active.'],
      },
      { heading: 'Marketing', body: ['Only set if you opt in. None are currently in use.'] },
      { heading: 'Changing your choices', body: ['Use “Cookie preferences” in the footer at any time. Your choice is remembered for six months.'] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms and conditions',
    description: 'The terms that apply when you use this website and buy from The Home Lab.',
    draft: false,
    sections: [
      { heading: 'About us', body: ['This site is run by The Home Lab, based in Ireland. Contact: info@thehomelab.ie.'] },
      { heading: 'Orders and contract', body: ['When you place an order you will receive an email confirming we have received it. The contract between us is formed when we email you to say your order has shipped. If we find an obvious error in a price before then, we will contact you and you can choose to go ahead at the correct price or cancel for a full refund.'] },
      { heading: 'Prices', body: ['Prices are in euro and are the full price you pay for the goods. Delivery charges are shown at checkout.'] },
      { heading: 'Delivery, returns and cancellation', body: ['See our delivery policy and returns policy.'] },
      { heading: 'Liability', body: ['We are responsible for loss or damage you suffer that is a foreseeable result of us breaking these terms or failing to use reasonable care. Nothing in these terms limits our liability where it would be unlawful to do so, and nothing affects your statutory rights as a consumer.'] },
      { heading: 'Governing law', body: ['These terms are governed by the laws of Ireland. You can bring a claim in the Irish courts. If you live elsewhere in the EU, you can also bring a claim in the courts where you live.'] },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns policy',
    description: 'Our formal returns and refunds policy.',
    draft: false,
    sections: [
      { heading: 'Cancellation period', body: ['You can cancel your order within 14 days of the day you receive it, without giving a reason.'] },
      { heading: 'Condition of returned items', body: ['Please return items unused and, where possible, in their original packaging. You can return a whole set or individual pieces from it. If an item has been handled more than needed to check it, we may reduce your refund to reflect any loss in value.'] },
      { heading: 'Exclusions', body: ['There are currently no exclusions. If a product is ever excluded, it will say so clearly on its page.'] },
      { heading: 'Return delivery costs', body: ['You pay for return delivery, unless the item is faulty or we sent you the wrong thing. For large add-on furniture, we can arrange a courier collection and tell you the cost before you agree to it.'] },
      { heading: 'Refund timing', body: ['We refund you within 14 days of the day you tell us you are cancelling, to your original payment method. We may wait until we receive the goods back, or until you show us proof that you have sent them, whichever is sooner.'] },
      { heading: 'Faulty goods', body: ['If an item is faulty, please tell us within 30 days of delivery for a repair, replacement or refund. Your statutory rights for faulty goods are not affected by this policy.'] },
    ],
  },
  {
    slug: 'delivery',
    title: 'Delivery policy',
    description: 'Our formal delivery terms.',
    draft: false,
    sections: [
      { heading: 'Delivery area', body: ['We deliver to addresses in the Republic of Ireland only.'] },
      { heading: 'Charges', body: ['Delivery is charged at our standard rate, shown at checkout before you pay.'] },
      { heading: 'Lead times', body: ['Sets are sent in batches. Each set is posted by the ship-by date shown on its page, in your basket and in your order confirmation, then usually arrives 1 to 3 working days later. Add-on furniture is sent by courier and arrives by the same date. If a batch is delayed, we email you and you can wait or cancel for a full refund.'] },
      { heading: 'Failed or refused deliveries', body: ['If a delivery fails or is refused, the parcel is returned to us. We will contact you to arrange delivery again, which is charged at the standard delivery rate, or to refund the goods.'] },
      { heading: 'Damage in transit', body: ['Please tell us within 7 days of delivery if anything arrives damaged, with photos and your order number. We will replace the item or refund you.'] },
    ],
  },
];

export const getHelpPage = (slug: string) => HELP_PAGES.find((p) => p.slug === slug) ?? null;
export const getPolicyPage = (slug: string) => POLICY_PAGES.find((p) => p.slug === slug) ?? null;
