/**
 * Help and policy content: structured, editable DRAFTS.
 *
 * Text inside [[double brackets]] is a business or legal detail that has not
 * been confirmed. It renders as a highlighted "To confirm" marker and must be
 * replaced before launch. Nothing here has been reviewed by a solicitor.
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
    draft: true,
    sections: [
      {
        heading: 'Where we deliver',
        body: ['We currently deliver to addresses in [[the Republic of Ireland; confirm whether Northern Ireland and offshore islands are included]].'],
      },
      {
        heading: 'Delivery charges and times',
        body: [
          'Delivery options and charges for your address are shown at checkout before you pay.',
          'Sets are sent in batches. Each set page shows the date its current batch ships by, and the same date is in your basket and order confirmation.',
          'Time in transit after posting: [[confirm with carrier, e.g. An Post or GLS]].',
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
    draft: true,
    sections: [
      {
        heading: 'Your right to cancel',
        body: [
          'If you buy online as a consumer in Ireland, you generally have the right to cancel within 14 days of receiving your goods, without giving a reason. [[Confirm wording and any exceptions with a legal adviser.]]',
        ],
      },
      {
        heading: 'How to start a return',
        body: ['To start a return, [[confirm process: email, returns portal or account page]]. Please include your order number.'],
      },
      {
        heading: 'Return costs',
        body: ['Who pays for return delivery: [[confirm, especially for large and bulky items]].'],
      },
      {
        heading: 'Refunds',
        body: ['Refunds are made to the original payment method. Timing: [[confirm, within the legal maximum]].'],
      },
      {
        heading: 'Damaged or faulty items',
        body: ['If something arrives damaged or develops a fault, please contact us with photos and your order number so we can put it right. [[Confirm reporting window and remedy process.]]'],
      },
    ],
  },
  {
    slug: 'orders',
    title: 'Orders',
    description: 'Changing, cancelling and checking on an order.',
    draft: true,
    sections: [
      {
        heading: 'Order confirmation',
        body: ['After you place an order you will receive a confirmation email from our checkout. If it has not arrived within an hour, check your spam folder and then contact us.'],
      },
      {
        heading: 'Changing or cancelling an order',
        body: ['Contact us as soon as possible with your order number. Changes can be made until [[confirm cut-off, e.g. dispatch]].'],
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
    draft: true,
    sections: [
      {
        heading: 'Secure checkout',
        body: [
          'Payment is taken on our secure checkout, provided by Shopify. We never see or store your full card details.',
          'Accepted payment methods: [[confirm once Shopify Payments or another provider is set up]].',
        ],
      },
      {
        heading: 'Currency and VAT',
        body: ['Prices are shown in euro. [[Confirm VAT registration and that displayed prices include VAT.]]'],
      },
      {
        heading: 'Discount codes',
        body: ['Discount codes are entered in the basket or at checkout and are validated by the checkout. Only one code can be used per order unless stated otherwise. [[Confirm policy.]]'],
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
    a: 'Not at the moment. The pieces are chosen to work together, so each set is sold as a whole.',
  },
  {
    q: 'Are the photos of the actual pieces?',
    a: 'Not yet. The photos on the site are samples of similar pieces, and each one is marked as a sample. They will be replaced with photographs of the sets themselves.',
  },
  { q: 'Do I need an account to order?', a: 'No. You can check out as a guest. An account lets you see your orders, save addresses and keep a wishlist across devices.' },
  { q: 'Can I change or cancel my order?', a: 'Contact us as soon as possible with your order number. See the orders help page for details.' },
];

export const POLICY_PAGES: ContentPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy policy',
    description: 'How The Home Lab collects, uses and protects personal data.',
    draft: true,
    sections: [
      { heading: 'Who we are', body: ['The data controller is [[registered company name]], [[registered address]]. Contact for privacy matters: [[privacy contact email]].'] },
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
      { heading: 'Why we use it and our legal bases', body: ['[[Confirm lawful basis for each purpose (contract, consent, legitimate interests, legal obligation).]]'] },
      {
        heading: 'Who we share it with',
        body: [
          'We use service providers to run the shop: Shopify (catalogue, checkout and orders), Supabase (customer accounts and preferences), Resend (the emails we send), Zoho (our email inbox), [[delivery carriers]], [[payment providers]].',
          'International transfers and safeguards: [[confirm for each provider]].',
        ],
      },
      { heading: 'How long we keep it', body: ['[[Confirm retention periods for accounts, orders, marketing consent and contact messages.]]'] },
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
    draft: true,
    sections: [
      {
        heading: 'Essential',
        body: [
          'Used to run the site and cannot be switched off: your cookie choices (thl_consent), sign-in session cookies when you have an account, and browser storage for your basket, wishlist and recently viewed items on this device.',
        ],
      },
      {
        heading: 'Analytics',
        body: ['Only set if you opt in. No analytics provider is currently active. [[List provider, cookie names and durations when one is chosen.]]'],
      },
      { heading: 'Marketing', body: ['Only set if you opt in. None are currently in use.'] },
      { heading: 'Changing your choices', body: ['Use “Cookie preferences” in the footer at any time. Your choice is remembered for six months.'] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms and conditions',
    description: 'The terms that apply when you use this website and buy from The Home Lab.',
    draft: true,
    sections: [
      { heading: 'About us', body: ['This site is operated by [[registered company name]], company number [[number]], VAT number [[number]], [[registered address]].'] },
      { heading: 'Orders and contract', body: ['[[Confirm when a contract is formed (e.g. on dispatch confirmation) and how errors in pricing are handled.]]'] },
      { heading: 'Prices', body: ['Prices are in euro and [[confirm VAT inclusion]]. Delivery charges are shown at checkout.'] },
      { heading: 'Delivery, returns and cancellation', body: ['See our delivery policy and returns policy.'] },
      { heading: 'Liability', body: ['[[Legal review required.]] Nothing in these terms affects your statutory rights as a consumer.'] },
      { heading: 'Governing law', body: ['[[Confirm: the laws of Ireland and the jurisdiction of the Irish courts.]]'] },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns policy',
    description: 'Our formal returns and refunds policy.',
    draft: true,
    sections: [
      { heading: 'Cancellation period', body: ['[[Confirm: at least 14 days from receipt for distance sales to consumers.]]'] },
      { heading: 'Condition of returned items', body: ['[[Confirm requirements (e.g. unused, original packaging) consistent with consumer law.]]'] },
      { heading: 'Exclusions', body: ['[[Confirm any lawful exclusions, e.g. made-to-order or sealed hygiene items.]]'] },
      { heading: 'Return delivery costs', body: ['[[Confirm who pays and any bulky-item collection charges.]]'] },
      { heading: 'Refund timing', body: ['[[Confirm: within 14 days of cancellation, may be withheld until goods are received back.]]'] },
      { heading: 'Faulty goods', body: ['Your statutory rights for faulty goods are not affected by this policy.'] },
    ],
  },
  {
    slug: 'delivery',
    title: 'Delivery policy',
    description: 'Our formal delivery terms.',
    draft: true,
    sections: [
      { heading: 'Delivery area', body: ['[[Confirm delivery area.]]'] },
      { heading: 'Charges', body: ['Delivery charges are calculated at checkout. [[Confirm rate table.]]'] },
      { heading: 'Lead times', body: ['[[Confirm per product type and supplier. Do not publish until agreed.]]'] },
      { heading: 'Failed or refused deliveries', body: ['[[Confirm redelivery and storage terms.]]'] },
      { heading: 'Damage in transit', body: ['[[Confirm reporting window and process.]]'] },
    ],
  },
];

export const getHelpPage = (slug: string) => HELP_PAGES.find((p) => p.slug === slug) ?? null;
export const getPolicyPage = (slug: string) => POLICY_PAGES.find((p) => p.slug === slug) ?? null;
