/**
 * Member programme settings. Amounts are in cents. Every code a member is
 * given must also exist as a discount in Shopify before it can be used.
 */
export const REFERRAL = {
  /** Set to false to hide the referral page and links. */
  enabled: true,
  /** Money off the friend's first order. */
  friendCents: 1500,
  /** Credit for the member once the friend's first order has shipped. */
  memberCents: 1500,
  /** Days the referral link cookie lasts after a friend clicks it. */
  cookieDays: 30,
  /** Email invites a member can send in 24 hours. */
  invitesPerDay: 10,
};

export const REFERRAL_COOKIE = 'thl_ref';

export const euros = (cents: number) => `€${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;

/** Things that are true for every member today. Keep this list honest. */
export const MEMBER_BENEFITS = [
  { title: 'Orders in one place', body: 'Every order placed with your email, with its status and tracking.' },
  { title: 'Saved addresses', body: 'Your delivery details, ready for checkout.' },
  { title: 'Wishlist on any device', body: 'Pieces you save follow you between phone and laptop.' },
  { title: 'Member offers', body: 'Offers we only show to signed-in members, when we run them.' },
  { title: 'Launch alerts', body: 'An email when a coming-soon set opens for orders.' },
];

/** Communication preferences, stored on the profile. The newsletter lives in its own table. */
export const EMAIL_PREFERENCES = [
  { key: 'email_batch_reminders', label: 'Order deadlines', body: 'A reminder before a pre-order batch closes, such as the Christmas cut-off.' },
  { key: 'email_launch_alerts', label: 'New sets', body: 'An email when a new room set opens for orders.' },
  { key: 'email_product_updates', label: 'Product news', body: 'New pieces and changes to the sets.' },
] as const;

export type EmailPreferenceKey = (typeof EMAIL_PREFERENCES)[number]['key'];

/** Member number shown on the account, e.g. 0042. */
export const memberNumber = (n: number | null | undefined) => (n ? String(n).padStart(4, '0') : null);
