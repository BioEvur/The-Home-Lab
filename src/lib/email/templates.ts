import { SITE_URL } from '@/lib/config/site';
import { REFERRAL, euros } from '@/lib/content/members';
import { renderEmail, type EmailBlock, type EmailContent } from './layout';

/**
 * Every email the site sends, in one place. Each returns a subject, HTML and
 * plain text. Copy is plain and factual: what happened and what to do next.
 */
export interface Email {
  subject: string;
  html: string;
  text: string;
}

const build = (subject: string, content: EmailContent, siteUrl?: string): Email => ({ subject, ...renderEmail(content, { siteUrl }) });

const ACCOUNT_REASON = 'You are receiving this because you have an account at thehomelab.ie.';

// ─── Sent by the site ────────────────────────────────────────────────────────

export function welcomeEmail({ firstName, referralCode }: { firstName?: string | null; referralCode?: string | null }): Email {
  const blocks: EmailBlock[] = [
    { type: 'heading', text: firstName ? `Welcome, ${firstName}` : 'Welcome to The Home Lab' },
    { type: 'text', text: 'Your email is confirmed and your account is ready. Here is what it does:' },
    {
      type: 'list',
      items: [
        'Orders: every order placed with this email, with its status and tracking link.',
        'Addresses: save your delivery details for a faster checkout.',
        'Wishlist: pieces you save are kept on any device you sign in on.',
        'Member offers: offers we only show to signed-in members, when we run them.',
      ],
    },
    { type: 'button', label: 'Go to your account', href: `${SITE_URL}/account` },
  ];
  if (REFERRAL.enabled && referralCode) {
    blocks.push(
      { type: 'divider' },
      { type: 'text', text: `Know someone who would like a set? Share your link. They get ${euros(REFERRAL.friendCents)} off their first order, and you get ${euros(REFERRAL.memberCents)} credit once it ships.` },
      { type: 'code', label: 'Your referral link', code: `thehomelab.ie/r/${referralCode}` },
    );
  }
  return build('Your Home Lab account is ready', { preheader: 'Your orders, addresses and wishlist in one place.', blocks, reason: ACCOUNT_REASON });
}

export function newsletterConfirmEmail({ confirmUrl }: { confirmUrl: string }): Email {
  return build('Please confirm your email', {
    preheader: 'One click to start receiving emails from The Home Lab.',
    blocks: [
      { type: 'heading', text: 'Confirm your email' },
      { type: 'text', text: 'Someone, hopefully you, asked to receive emails from The Home Lab at this address. Press the button to confirm.' },
      { type: 'button', label: 'Yes, sign me up', href: confirmUrl },
      { type: 'text', text: 'We send new sets, order deadlines for each batch, and the occasional recipe for the drinks and coffee the sets are made for. Not more than a couple of emails a month.', muted: true },
      { type: 'small', text: 'If you did not ask for this, ignore this email and you will not hear from us again.' },
    ],
    reason: 'You are receiving this because this address was entered in the sign-up form at thehomelab.ie.',
  });
}

export function newsletterWelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl: string }): Email {
  return build('You are on the list', {
    preheader: 'What to expect from The Home Lab emails.',
    blocks: [
      { type: 'heading', text: 'You are on the list' },
      { type: 'text', text: 'Thank you for signing up. Here is what you will get:' },
      {
        type: 'list',
        items: [
          'New room sets, when they open for orders.',
          'Order deadlines for each pre-order batch, so you do not miss Christmas delivery.',
          'Now and then, a recipe for the coffee or drinks a set is made for.',
        ],
      },
      { type: 'button', label: 'See the room sets', href: SITE_URL },
      { type: 'small', text: 'You can unsubscribe at any time using the link at the bottom of every email.' },
    ],
    reason: 'You are receiving this because you confirmed your sign-up at thehomelab.ie.',
    unsubscribeUrl,
  });
}

export function referralInviteEmail({ fromName, link, note }: { fromName: string; link: string; note?: string | null }): Email {
  const blocks: EmailBlock[] = [
    { type: 'heading', text: `${fromName} thinks you would like The Home Lab` },
    {
      type: 'text',
      text: 'The Home Lab makes room sets: a Kyoto coffee house, a Milan drinks corner and a Marrakech reading corner. Each set arrives in one box with every piece it needs.',
    },
  ];
  if (note) blocks.push({ type: 'text', text: `${fromName} wrote: "${note}"` });
  blocks.push(
    { type: 'code', label: 'Your offer', code: `${euros(REFERRAL.friendCents)} off`, note: 'Your first order, when you create an account through this link.' },
    { type: 'button', label: 'See the sets', href: link },
    { type: 'small', text: 'You have not been added to any mailing list. This is the only email you will get unless you sign up.' },
  );
  return build(`${fromName} sent you ${euros(REFERRAL.friendCents)} off at The Home Lab`, {
    preheader: `${euros(REFERRAL.friendCents)} off your first room set.`,
    blocks,
    reason: `You are receiving this because ${fromName}, a Home Lab member, entered your email address to invite you.`,
  });
}

export function referralRewardEmail({ firstName, code, expires }: { firstName?: string | null; code: string; expires?: string | null }): Email {
  return build(`You have ${euros(REFERRAL.memberCents)} credit at The Home Lab`, {
    preheader: 'A friend you referred has received their order.',
    blocks: [
      { type: 'heading', text: firstName ? `Thank you, ${firstName}` : 'Thank you' },
      { type: 'text', text: `A friend you referred has received their first order, so here is your ${euros(REFERRAL.memberCents)} credit.` },
      { type: 'code', label: 'Your code', code, note: expires ? `Use it at checkout before ${expires}.` : 'Use it at checkout.' },
      { type: 'button', label: 'See your rewards', href: `${SITE_URL}/account/referrals` },
    ],
    reason: ACCOUNT_REASON,
  });
}

export function launchAlertEmail({ setTitle, href }: { setTitle: string; href: string }): Email {
  return build(`${setTitle} is open for orders`, {
    preheader: 'You asked us to tell you when it opened.',
    blocks: [
      { type: 'heading', text: `${setTitle} is open for orders` },
      { type: 'text', text: 'You asked us to let you know when this set opened. It is now available to order.' },
      { type: 'button', label: `See ${setTitle}`, href: href.startsWith('http') ? href : `${SITE_URL}${href}` },
      { type: 'small', text: 'This was a one-off alert. You will not get another email about this set.' },
    ],
    reason: 'You are receiving this because you asked for a launch alert in your Home Lab account.',
  });
}

export function accountDeletedEmail({ firstName }: { firstName?: string | null }): Email {
  return build('Your Home Lab account has been deleted', {
    preheader: 'Your account and saved details have been removed.',
    blocks: [
      { type: 'heading', text: 'Your account has been deleted' },
      { type: 'text', text: `${firstName ? `${firstName}, as` : 'As'} requested, we have deleted your Home Lab account, along with your saved addresses, wishlist and preferences.` },
      {
        type: 'text',
        text: 'Records of orders you placed are kept for as long as the law requires for tax and consumer rights. If you want those removed when that period ends, reply to this email.',
      },
      { type: 'small', text: 'If you did not ask for this, contact us straight away by replying to this email.' },
    ],
    reason: 'You are receiving this because an account at thehomelab.ie was deleted.',
  });
}

const SUBJECT_LABELS: Record<string, string> = {
  order: 'An order',
  product: 'A product',
  delivery: 'Delivery',
  returns: 'Returns',
  trade: 'Trade enquiry',
  other: 'Something else',
};

export function contactNotificationEmail(m: { name: string; email: string; subject: string; orderNumber?: string; message: string }): Email {
  const rows = [
    { label: 'From', value: `${m.name} <${m.email}>` },
    { label: 'About', value: SUBJECT_LABELS[m.subject] ?? m.subject },
  ];
  if (m.orderNumber) rows.push({ label: 'Order number', value: m.orderNumber });
  return build(`Website message from ${m.name}: ${SUBJECT_LABELS[m.subject] ?? m.subject}`, {
    preheader: m.message.slice(0, 90),
    blocks: [{ type: 'heading', text: 'New message from the website' }, { type: 'rows', rows }, ...m.message.split(/\n{2,}/).map((p): EmailBlock => ({ type: 'text', text: p }))],
    reason: 'Sent by the contact form at thehomelab.ie. Reply to this email to answer the customer directly.',
  });
}

export function contactAcknowledgementEmail({ name, message }: { name: string; message: string }): Email {
  return build('We have your message', {
    preheader: 'Thank you for getting in touch with The Home Lab.',
    blocks: [
      { type: 'heading', text: `Thank you, ${name.split(' ')[0]}` },
      { type: 'text', text: 'We have your message and will reply to this email address. Here is a copy of what you sent:' },
      { type: 'small', text: message.length > 600 ? `${message.slice(0, 600)}…` : message },
      { type: 'text', text: 'If you need to add anything, reply to this email.', muted: true },
    ],
    reason: 'You are receiving this because you sent a message using the contact form at thehomelab.ie.',
  });
}

// ─── Supabase Auth templates ─────────────────────────────────────────────────
// Pasted into Supabase › Authentication › Emails. The {{ .ConfirmationURL }}
// style tags are filled in by Supabase. Exported with `npm run emails`.

export function supabaseTemplates(siteUrl = SITE_URL): Record<string, Email> {
  const AUTH_REASON = 'You are receiving this because this address was used at thehomelab.ie. If that was not you, you can ignore this email.';
  const b = (subject: string, content: EmailContent) => build(subject, content, siteUrl);
  return {
    'confirm-signup': b('Confirm your email for The Home Lab', {
      preheader: 'One click to finish creating your account.',
      blocks: [
        { type: 'heading', text: 'Confirm your email' },
        { type: 'text', text: 'Thank you for creating an account. Press the button to confirm this is your email address.' },
        { type: 'button', label: 'Confirm my email', href: '{{ .ConfirmationURL }}' },
        { type: 'text', text: 'Once confirmed, you can see your orders, save addresses and keep a wishlist on any device.', muted: true },
        { type: 'small', text: 'The link works once and expires after 24 hours.' },
      ],
      reason: AUTH_REASON,
    }),
    'reset-password': b('Reset your Home Lab password', {
      preheader: 'Use this link to choose a new password.',
      blocks: [
        { type: 'heading', text: 'Reset your password' },
        { type: 'text', text: 'We received a request to reset the password for {{ .Email }}. Press the button to choose a new one.' },
        { type: 'button', label: 'Choose a new password', href: '{{ .ConfirmationURL }}' },
        { type: 'small', text: 'The link works once and expires after one hour. If you did not ask to reset your password, ignore this email: your password will not change.' },
      ],
      reason: AUTH_REASON,
    }),
    'magic-link': b('Your sign-in link for The Home Lab', {
      preheader: 'Sign in without a password.',
      blocks: [
        { type: 'heading', text: 'Sign in to The Home Lab' },
        { type: 'text', text: 'Press the button to sign in. No password needed.' },
        { type: 'button', label: 'Sign in', href: '{{ .ConfirmationURL }}' },
        { type: 'small', text: 'The link works once and expires after one hour.' },
      ],
      reason: AUTH_REASON,
    }),
    'change-email': b('Confirm your new email address', {
      preheader: 'Confirm the change to your Home Lab account email.',
      blocks: [
        { type: 'heading', text: 'Confirm your new email' },
        { type: 'text', text: 'You asked to change the email on your Home Lab account from {{ .Email }} to {{ .NewEmail }}. Press the button to confirm.' },
        { type: 'button', label: 'Confirm new email', href: '{{ .ConfirmationURL }}' },
        { type: 'small', text: 'If you did not ask for this, ignore this email and contact us. Your email will not change.' },
      ],
      reason: AUTH_REASON,
    }),
    invite: b('You have been invited to The Home Lab', {
      preheader: 'Create your account.',
      blocks: [
        { type: 'heading', text: 'You are invited' },
        { type: 'text', text: 'An account has been set up for you at The Home Lab. Press the button to accept and choose a password.' },
        { type: 'button', label: 'Accept invitation', href: '{{ .ConfirmationURL }}' },
      ],
      reason: AUTH_REASON,
    }),
    reauthentication: b('Your Home Lab confirmation code', {
      preheader: 'Enter this code to confirm it is you.',
      blocks: [
        { type: 'heading', text: 'Confirm it is you' },
        { type: 'text', text: 'Enter this code on the website to continue.' },
        { type: 'code', label: 'Your code', code: '{{ .Token }}', note: 'It expires after a few minutes.' },
      ],
      reason: AUTH_REASON,
    }),
  };
}

/**
 * Starting point for newsletters sent from Resend's broadcast editor.
 * Replace the placeholder text; Resend fills in the unsubscribe link.
 */
export function newsletterBroadcastTemplate(siteUrl = SITE_URL): Email {
  return build('Order by 17 November for Christmas delivery', {
    preheader: 'The last day to order a room set for Christmas.',
    blocks: [
      { type: 'heading', text: 'Order by 17 November for Christmas' },
      { type: 'text', text: 'Replace this with the main news: what is new, what it is, and what it costs.' },
      { type: 'button', label: 'See the room sets', href: siteUrl },
      { type: 'divider' },
      { type: 'text', text: 'Second story: a set, a piece, or a recipe. Keep it short and say what the thing actually is.' },
      { type: 'small', text: 'Pre-order batches ship once supplier orders arrive. Order dates and delivery dates are on each set page.' },
    ],
    reason: 'You are receiving this because you signed up for emails from The Home Lab.',
    unsubscribeUrl: '{{{RESEND_UNSUBSCRIBE_URL}}}',
  }, siteUrl);
}
