import { SITE_URL } from '@/lib/config/site';
import { currentBatch, formatDay } from '@/lib/content/batches';
import { REFERRAL, euros } from '@/lib/content/members';
import { C, SANS, SERIF, button, collection, esc, eyebrow, fallbackLink, h1, h2, hero, p, shell, shortNote, welcomeNote } from './design';

/**
 * Every email the site sends through Resend, each with its own design. Each
 * returns a subject, HTML and plain text. Copy is warm but factual: what
 * happened and what to do next. Run `npm run emails` to write previews to
 * emails/previews/ and the newsletter starting point to emails/.
 */
export interface Email {
  subject: string;
  html: string;
  text: string;
}

const ACCOUNT_REASON = "You're getting this because you have an account at thehomelab.ie.";
const FRIEND = euros(REFERRAL.friendCents);
const MEMBER = euros(REFERRAL.memberCents);

// ─── Small helpers ───────────────────────────────────────────────────────────

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE_URL}${href}`);
const firstOf = (name?: string | null) => (name ?? '').trim().split(/\s+/)[0] ?? '';
const withName = (name?: string | null) => (firstOf(name) ? `, ${esc(firstOf(name))}` : '');
const spacer = (h: number) => `<tr><td style="height:${h}px;line-height:${h}px;font-size:0">&nbsp;</td></tr>`;

/** Footer links under the reason line; adds Unsubscribe for newsletter emails. */
function footer(site: string, unsubscribe?: string) {
  const a = (href: string, label: string) => `<a href="${href}" style="color:${C.muted}">${label}</a>`;
  const links = [a(`${site}/account`, 'Your account'), a(`${site}/help`, 'Help'), a(`${site}/contact`, 'Contact us')];
  if (unsubscribe) links.push(a(unsubscribe, 'Unsubscribe'));
  return `<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.55;color:${C.muted}">${links.join(' &nbsp;&middot;&nbsp; ')}</p>\n`;
}

/** Plain-text version: one paragraph per part, blanks dropped. */
const plain = (...parts: (string | false | null | undefined)[]) => ['THE HOME LAB', ...parts.filter(Boolean)].join('\n\n') + `\n\n${SITE_URL}`;

/** A row of link tiles that stack on phones. */
function linkTiles(items: { title: string; line: string; href: string }[], site = SITE_URL) {
  const w = Math.floor((600 - (items.length - 1) * 12) / items.length);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${items
    .map(
      (t, i) =>
        `${i ? '<td class="gap" width="12" style="width:12px;font-size:0">&nbsp;</td>' : ''}<td class="tile" width="${w}" valign="top" style="width:${w}px;background:${C.paper};border:1px solid #e2d6c6;border-radius:6px;padding:16px 16px 14px"><a href="${t.href.startsWith('http') ? t.href : site + t.href}" style="text-decoration:none"><span style="display:block;font-family:${SERIF};font-size:18px;color:${C.ink}">${t.title}</span><span style="display:block;margin-top:3px;font-family:${SANS};font-size:13px;line-height:1.45;color:${C.muted}">${t.line} &rarr;</span></a></td>`,
    )
    .join('')}</tr></table>`;
}

/** Order-by and ships-by dates for the open batch, or nothing once it closes. */
function batchDates() {
  const b = currentBatch();
  return b ? { name: b.name, close: formatDay(b.ordersClose), ships: formatDay(b.shipsBy) } : null;
}

// ─── Account ─────────────────────────────────────────────────────────────────

export function welcomeEmail({
  firstName,
  referralCode,
  memberNumber,
  friendOffer,
}: {
  firstName?: string | null;
  referralCode?: string | null;
  memberNumber?: number | null;
  /** True when a friend referred them, so their first-order discount is waiting. */
  friendOffer?: boolean;
}): Email {
  const site = SITE_URL;
  const name = firstOf(firstName);
  const since = new Intl.DateTimeFormat('en-IE', { month: 'long', year: 'numeric', timeZone: 'Europe/Dublin' }).format(new Date());
  const number = memberNumber ? `No. ${String(memberNumber).padStart(4, '0')}` : '';
  const share = REFERRAL.enabled && referralCode ? `${site.replace(/^https?:\/\//, '')}/r/${referralCode}` : '';

  const body = `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr>
<td class="stack pad" valign="top" style="padding:40px 32px 36px 44px">${eyebrow('WELCOME TO THE HOME LAB')}${h1(`You're a member now${withName(firstName)}.`)}${p('Your email is confirmed and your account is ready. Everything you order, save and share lives in one place from here on.', C.soft, 16)}${button('Go to my account', `${site}/account`)}</td>
<td class="stack stack-img" width="230" valign="top" style="width:230px;line-height:0;font-size:0;border-radius:0 6px 6px 0"><img src="${site}/email/account-side.jpg" width="230" alt="A wavy pine mirror above a marble console with a glass vase and a candle holder" style="display:block;width:230px;height:auto;border:0;border-radius:0 6px 6px 0;background:#c9ad8f"></td>
</tr></table></td></tr>
${spacer(16)}
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};border-radius:10px"><tr><td style="padding:10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #3c3f3b;border-radius:6px"><tr>
<td class="pad" valign="top" style="padding:24px 26px">
<p style="margin:0 0 22px;font-family:${SERIF};font-size:13px;letter-spacing:0.32em;color:${C.oat}">THE&nbsp;HOME&nbsp;LAB &nbsp;&middot;&nbsp; MEMBER</p>
<p style="margin:0 0 6px;font-family:${SERIF};font-size:30px;line-height:1.1;color:${C.paper}">${name ? esc(name) : 'Welcome in'}</p>
<p style="margin:0;font-family:${SANS};font-size:13px;letter-spacing:0.08em;color:#a39b90">${number ? `${number} &nbsp;&middot;&nbsp; ` : ''}Member since ${since}</p>
</td></tr></table></td></tr></table></td></tr>
<tr><td style="padding:40px 4px 14px">${eyebrow('YOUR ACCOUNT')}${h2('Four things it does for you')}</td></tr>
<tr><td>${linkTiles([
    { title: 'Orders', line: 'Status and tracking', href: '/account/orders' },
    { title: 'Addresses', line: 'Faster checkout', href: '/account/addresses' },
  ])}</td></tr>
${spacer(12)}
<tr><td>${linkTiles([
    { title: 'Wishlist', line: 'On any device', href: '/account/wishlist' },
    { title: 'Offers', line: 'Members only', href: '/account/offers' },
  ])}</td></tr>
${
  friendOffer
    ? `${spacer(16)}<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.clay};border-radius:6px"><tr><td class="pad" style="padding:24px 28px">
<p style="margin:0 0 6px;font-family:${SERIF};font-size:24px;color:${C.paper}">Your ${FRIEND} is waiting.</p>
<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:#f0dfd4">A friend invited you, so ${FRIEND} comes off your first order. You'll find the code in your account under <a href="${site}/account/offers" style="color:${C.paper}">Offers</a>.</p>
</td></tr></table></td></tr>`
    : ''
}
${
  share
    ? `${spacer(16)}<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.olive};border-radius:6px"><tr><td class="pad" style="padding:30px 32px">
${eyebrow(`BRING A FRIEND &nbsp;&middot;&nbsp; ${FRIEND} + ${MEMBER}`, '#e6e2c8')}
<p style="margin:0 0 10px;font-family:${SERIF};font-size:26px;line-height:1.2;color:${C.paper}">Know someone who'd love a set?</p>
<p style="margin:0 0 20px;font-family:${SANS};font-size:15px;line-height:1.6;color:#d6dacb">Share your link. They get ${FRIEND} off their first order, and you get ${MEMBER} credit once it ships.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed #a9b09c;border-radius:4px"><tr><td style="padding:14px 16px;font-family:${SERIF};font-size:19px;color:${C.paper};word-break:break-all">${esc(share)}</td></tr></table>
<div style="height:20px;line-height:20px;font-size:0">&nbsp;</div>
${button('Share my link', `${site}/account/referrals`, false)}
</td></tr></table></td></tr>`
    : ''
}
${welcomeNote('Glad you’re here,')}`;

  return {
    subject: name ? `Welcome in, ${name}. Your account is ready` : 'Welcome in. Your Home Lab account is ready',
    html: shell({ site, title: 'Your Home Lab account is ready', preheader: 'Your orders, addresses, wishlist and friend rewards, all in one place.', label: number ? `MEMBER&nbsp;${number.replace(' ', '&nbsp;')}` : 'WELCOME', body, reason: ACCOUNT_REASON, footer: footer(site) }),
    text: plain(
      `You're a member now${name ? `, ${name}` : ''}.`,
      'Your email is confirmed and your account is ready.',
      `Go to your account: ${site}/account`,
      `Orders: ${site}/account/orders\nAddresses: ${site}/account/addresses\nWishlist: ${site}/account/wishlist\nOffers: ${site}/account/offers`,
      friendOffer && `A friend invited you, so ${FRIEND} comes off your first order. The code is in your account under Offers.`,
      share && `Bring a friend: they get ${FRIEND} off their first order, and you get ${MEMBER} credit once it ships. Your link: ${share}`,
      'If you have a question, reply to this email. It comes straight to us.',
      ACCOUNT_REASON,
    ),
  };
}

export function accountDeletedEmail({ firstName }: { firstName?: string | null }): Email {
  const site = SITE_URL;
  const name = firstOf(firstName);
  const item = (t: string) =>
    `<tr><td width="26" valign="top" style="width:26px;padding:6px 0;font-family:${SANS};font-size:15px;color:${C.olive}">&#10003;</td><td style="padding:6px 0;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.soft}">${t}</td></tr>`;
  const body = `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr><td class="pad" style="padding:40px 48px 36px">
${eyebrow('ALL DONE', C.muted)}${h1('Your account has been deleted.')}${p(`${name ? `${esc(name)}, as` : 'As'} you asked, we've closed your Home Lab account. Here's exactly what that means.`, C.soft, 16)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td class="stack" width="50%" valign="top" style="width:50%;padding:0 12px 16px 0">
<p style="margin:0 0 8px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.olive}">DELETED</p>
<table role="presentation" cellpadding="0" cellspacing="0">${item('Your account and sign-in')}${item('Saved addresses')}${item('Your wishlist')}${item('Preferences and launch alerts')}</table></td>
<td class="stack" width="50%" valign="top" style="width:50%;padding:0 0 16px 12px">
<p style="margin:0 0 8px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.clay}">KEPT FOR NOW</p>
<p style="margin:6px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}"><strong style="color:${C.ink}">Order records.</strong> The law says we keep these for a set time, for tax and consumer rights. Reply to this email if you'd like them removed when that time is up.</p></td>
</tr></table>
</td></tr></table></td></tr>
${spacer(16)}
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sandDeep};border-radius:6px"><tr><td class="pad" style="padding:26px 32px">
<p style="margin:0 0 8px;font-family:${SERIF};font-size:21px;line-height:1.35;color:${C.ink}">Thank you for being part of The Home Lab.</p>
<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}">If you ever want to come back, you're welcome any time. Just <a href="${site}/account/register" style="color:${C.clay}">make a new account</a>.</p>
</td></tr></table></td></tr>
${shortNote("Didn't ask for this? Reply to this email straight away and we'll help.")}`;
  const reason = "You're getting this because an account at thehomelab.ie was deleted.";
  return {
    subject: 'Your Home Lab account has been deleted',
    html: shell({ site, title: 'Your Home Lab account has been deleted', preheader: "Your account and saved details are gone. Here's what that means.", label: 'ACCOUNT&nbsp;CLOSED', body, reason }),
    text: plain(
      'Your account has been deleted.',
      `${name ? `${name}, as` : 'As'} you asked, we've closed your Home Lab account.`,
      'Deleted: your account and sign-in, saved addresses, your wishlist, preferences and launch alerts.',
      "Kept for now: order records. The law says we keep these for a set time, for tax and consumer rights. Reply to this email if you'd like them removed when that time is up.",
      `Thank you for being part of The Home Lab. If you ever want to come back, make a new account: ${site}/account/register`,
      "Didn't ask for this? Reply to this email straight away.",
      reason,
    ),
  };
}

// ─── Newsletter ──────────────────────────────────────────────────────────────

export function newsletterConfirmEmail({ confirmUrl }: { confirmUrl: string }): Email {
  const site = SITE_URL;
  const what = (t: string, s: string) =>
    `<td class="stack" width="33%" valign="top" style="width:33%;padding:14px 10px 4px 0"><p style="margin:0 0 4px;font-family:${SERIF};font-size:18px;color:${C.ink}">${t}</p><p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">${s}</p></td>`;
  const body = `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border:1px solid ${C.line};border-radius:6px"><tr><td style="padding:8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:3px"><tr>
<td class="stack pad" valign="top" style="padding:36px 28px 32px 36px">${eyebrow('ONE MORE STEP')}${h1('Confirm and you’re on the list.')}${p('Someone, hopefully you, asked for emails from The Home Lab at this address. Press the button and you’re in.', C.soft, 16)}${button('Yes, sign me up', esc(confirmUrl))}</td>
<td class="stack stack-img" width="150" valign="top" align="right" style="width:150px;padding:28px 28px 0 0">
<table role="presentation" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px dashed ${C.line};transform:rotate(3deg)"><tr><td style="padding:6px;line-height:0;font-size:0"><img src="${site}/email/stamp-cups.jpg" width="110" alt="Four handleless ceramic cups in a gift box" style="display:block;width:110px;height:auto;border:0"></td></tr>
<tr><td align="center" style="padding:0 6px 8px;font-family:${SANS};font-size:9px;letter-spacing:0.16em;color:${C.muted}">IRELAND</td></tr></table>
<p style="margin:14px 0 0;font-family:${SERIF};font-size:11px;letter-spacing:0.22em;line-height:1.6;color:${C.clay};text-align:center">THE&nbsp;HOME&nbsp;LAB<br>POSTED&nbsp;WITH&nbsp;CARE</p></td>
</tr>
<tr><td colspan="2" class="pad" style="padding:0 36px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed ${C.line}"><tr>
${what('New rooms', 'When a new set opens for orders.')}${what('Order dates', 'The last day to order in each batch.')}${what('Recipes', 'Now and then, for the drinks a set is made for.')}
</tr></table>
<p style="margin:16px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">Not more than a couple of emails a month.</p></td></tr>
</table></td></tr></table></td></tr>
<tr><td style="padding:6px 4px 0">${fallbackLink(C.muted, C.clay, esc(confirmUrl))}</td></tr>
${shortNote("Didn't ask for this? Ignore this email and you won't hear from us again.")}`;
  const reason = "You're getting this because this address was entered in the sign-up form at thehomelab.ie.";
  return {
    subject: 'One tap to join The Home Lab list',
    html: shell({ site, title: 'Confirm your email', preheader: 'Confirm your email to get new rooms, order dates and the odd recipe.', label: 'ONE&nbsp;MORE&nbsp;STEP', body, reason, footer: footer(site) }),
    text: plain(
      'Confirm and you’re on the list.',
      'Someone, hopefully you, asked for emails from The Home Lab at this address.',
      `Yes, sign me up: ${confirmUrl}`,
      'We send new rooms when they open, the last day to order in each batch, and now and then a recipe. Not more than a couple of emails a month.',
      "Didn't ask for this? Ignore this email and you won't hear from us again.",
      reason,
    ),
  };
}

export function newsletterWelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl: string }): Email {
  const site = SITE_URL;
  const batch = batchDates();
  const num = (n: string, t: string, s: string) =>
    `<tr><td width="58" valign="top" style="width:58px;padding:18px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:30px;line-height:1;color:${C.clay}">${n}</td><td valign="top" style="padding:18px 0;border-bottom:1px solid ${C.line}"><p style="margin:0 0 4px;font-family:${SERIF};font-size:20px;color:${C.ink}">${t}</p><p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.55;color:${C.soft}">${s}</p></td></tr>`;
  const pic = (file: string, alt: string, title: string, line: string, href: string) =>
    `<td class="tile" width="294" valign="top" style="width:294px"><a href="${site}${href}" style="text-decoration:none"><img src="${site}/email/${file}" width="294" alt="${alt}" class="fluid" style="display:block;width:100%;max-width:294px;height:auto;border:0;border-radius:6px;background:${C.sandDeep}"><span style="display:block;margin-top:12px;font-family:${SERIF};font-size:19px;color:${C.ink}">${title}</span><span style="display:block;margin-top:2px;font-family:${SANS};font-size:13px;color:${C.muted}">${line} &rarr;</span></a></td>`;
  const body = `${`<tr><td class="pad" style="background:${C.ink};padding:44px 48px 40px;border-radius:6px 6px 0 0">${eyebrow("YOU'RE ON THE LIST", C.oat)}${h1('Good to have you with us.', C.paper)}<p style="margin:0;font-family:${SANS};font-size:17px;line-height:1.6;color:#cfc8bd">Thanks for confirming. Here's what lands in your inbox, and it's never more than a couple of emails a month.</p></td></tr>`}
<tr><td class="pad" style="background:${C.paper};padding:12px 48px 36px;border-radius:0 0 6px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${num('01', 'New rooms', 'When a new set opens for orders, with what’s in it and what it costs.')}
${num('02', 'Order dates', 'The last day to order in each pre-order batch, so a set arrives when you need it.')}
${num('03', 'Recipes', 'Now and then, a recipe for the coffee or drinks a set is made for.')}
</table></td></tr>
${
  batch
    ? `${spacer(16)}<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.clay};border-radius:6px"><tr>
<td width="150" valign="middle" align="center" style="width:150px;padding:24px 10px;border-right:1px dashed #c78f79"><p style="margin:0;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.16em;color:#f0dfd4">ORDER BY</p><p style="margin:6px 0 0;font-family:${SERIF};font-size:30px;line-height:1.05;color:${C.paper}">${batch.close}</p></td>
<td valign="middle" style="padding:24px 26px"><p style="margin:0 0 4px;font-family:${SERIF};font-size:21px;color:${C.paper}">${batch.name} orders close soon</p><p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.55;color:#f0dfd4">Every set in the ${batch.name} batch is posted by ${batch.ships}.</p></td>
</tr></table></td></tr>`
    : ''
}
<tr><td style="padding:40px 4px 14px">${eyebrow('OPEN FOR ORDERS')}${h2('A good place to start')}</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${pic('list-dripper.jpg', 'An amber glass pour-over dripper on its glass jug', 'Kyoto Kissaten', 'A Japanese coffee house', '/sets/kyoto-kissaten')}<td class="gap" width="12" style="width:12px;font-size:0">&nbsp;</td>
${pic('list-decanter.jpg', 'A cut crystal decanter of whisky with two cut glasses on a marble console', 'The Milanese', 'An evening drink in Milan', '/sets/the-milanese')}
</tr></table></td></tr>
<tr><td style="padding:28px 4px 0">${button('See all the room sets', site)}</td></tr>
${shortNote('Reply to any of our emails and it comes straight to us. We read every one.')}`;
  const reason = "You're getting this because you confirmed your sign-up at thehomelab.ie.";
  return {
    subject: "You're on the list. Welcome to The Home Lab",
    html: shell({ site, title: "You're on the list", preheader: "What's coming to your inbox, and how often.", label: 'THE&nbsp;LIST', body, reason, footer: footer(site, esc(unsubscribeUrl)) }),
    text: plain(
      'Good to have you with us.',
      "Thanks for confirming. Here's what lands in your inbox, never more than a couple of emails a month:",
      '01 New rooms: when a new set opens for orders.\n02 Order dates: the last day to order in each pre-order batch.\n03 Recipes: now and then, for the coffee or drinks a set is made for.',
      batch && `${batch.name} orders close ${batch.close}. Every set in the batch is posted by ${batch.ships}.`,
      `See the room sets: ${site}`,
      reason,
      `Unsubscribe: ${unsubscribeUrl}`,
    ),
  };
}

/**
 * Starting point for newsletters sent from Resend's broadcast editor. Swap the
 * words and photos for each send; Resend fills in the unsubscribe link.
 */
export function newsletterBroadcastTemplate(siteUrl = SITE_URL): Email {
  const site = siteUrl;
  const story = (file: string, alt: string, kicker: string, title: string, line: string, href: string) =>
    `<td class="tile" width="294" valign="top" style="width:294px;background:${C.paper};border-radius:6px"><img src="${site}/email/${file}" width="294" alt="${alt}" class="fluid" style="display:block;width:100%;max-width:294px;height:auto;border:0;border-radius:6px 6px 0 0;background:${C.sandDeep}"><div style="padding:20px 22px 22px"><p style="margin:0 0 8px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.14em;color:${C.clay}">${kicker}</p><p style="margin:0 0 8px;font-family:${SERIF};font-size:21px;line-height:1.25;color:${C.ink}">${title}</p><p style="margin:0 0 14px;font-family:${SANS};font-size:14px;line-height:1.55;color:${C.soft}">${line}</p><a href="${site}${href}" style="font-family:${SANS};font-size:14px;font-weight:600;color:${C.ink};text-decoration:none">Have a look &rarr;</a></div></td>`;
  const body = `${hero(site, 'letter-hero.jpg', 'Everything in the Kyoto Kissaten set: handleless cups in a gift box, an amber glass dripper on its jug, a black gooseneck kettle, a Hario hand grinder and a long acacia board', '#f3efe9')}
<tr><td class="pad" style="background:${C.paper};padding:40px 48px 36px;border-radius:0 0 6px 6px">${eyebrow('CHRISTMAS ORDERS CLOSE 17 NOVEMBER')}${h1('Order by 17 November for Christmas')}${p('Main story: what’s new, what it is, and what it costs. Two or three sentences that say what the thing actually is.', C.soft)}${button('See the room sets', site)}</td></tr>
<tr><td style="padding:40px 4px 14px">${eyebrow('ALSO THIS MONTH')}${h2('Two more things')}</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${story('letter-story-1.jpg', 'Two brown ceramic candle holders with cut-out sides, lit, on a marble console', 'THE MILANESE', 'Second story headline', 'A set, a single piece or some news. Keep it short and say what the thing is.', '/sets/the-milanese')}<td class="gap" width="12" style="width:12px;font-size:0">&nbsp;</td>
${story('letter-story-2.jpg', 'A black Hario ceramic hand grinder next to its glass jar of ground coffee', 'KYOTO KISSATEN', 'Third story headline', 'Another short piece. One photo, two sentences and a link.', '/sets/kyoto-kissaten')}
</tr></table></td></tr>
${spacer(16)}
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border:2px dashed ${C.line};border-radius:6px"><tr><td class="pad" style="padding:30px 34px">
${eyebrow('FROM THE COUNTER')}
<p style="margin:0 0 14px;font-family:${SERIF};font-size:26px;line-height:1.2;color:${C.ink}">Recipe name goes here</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td class="stack" width="40%" valign="top" style="width:40%;padding:0 18px 12px 0"><p style="margin:0 0 6px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.muted}">YOU'LL NEED</p><p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.soft}">Ingredient one<br>Ingredient two<br>Ingredient three</p></td>
<td class="stack" valign="top" style="padding:0 0 12px"><p style="margin:0 0 6px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.muted}">METHOD</p><p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}">Short steps, in plain words. Mention which piece from the set you use for each step.</p></td>
</tr></table></td></tr></table></td></tr>
${welcomeNote('Until next time,')}`;
  const reason = "You're getting this because you signed up for emails from The Home Lab.";
  return {
    subject: 'Order by 17 November for Christmas delivery',
    html: shell({ site, title: 'The Home Lab', preheader: 'The last day to order a room set for Christmas.', label: 'NEWSLETTER', body, reason, footer: footer(site, '{{{RESEND_UNSUBSCRIBE_URL}}}') }),
    text: plain('Order by 17 November for Christmas', 'Main story goes here.', `See the room sets: ${site}`, reason, 'Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}'),
  };
}

// ─── Referrals ───────────────────────────────────────────────────────────────

export function referralInviteEmail({ fromName, link, note }: { fromName: string; link: string; note?: string | null }): Email {
  const site = SITE_URL;
  const from = esc(fromName);
  const body = `<tr><td style="padding:8px 4px 24px">${eyebrow(`A GIFT FROM ${from.toUpperCase()}`)}${h1(`${from} thinks you'd love The Home Lab.`)}${p('So they’ve sent you money off your first room set.', C.soft)}</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.clay};border-radius:8px"><tr><td style="padding:10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed #d9a892;border-radius:5px"><tr>
<td class="stack" width="200" valign="middle" align="center" style="width:200px;padding:28px 10px"><p style="margin:0;font-family:${SERIF};font-size:72px;line-height:1;color:${C.paper}">${FRIEND}</p></td>
<td class="stack" valign="middle" style="padding:28px 28px 28px 8px"><p style="margin:0 0 8px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.16em;color:#f0dfd4">OFF YOUR FIRST ORDER</p><p style="margin:0 0 6px;font-family:${SERIF};font-size:22px;line-height:1.25;color:${C.paper}">From ${from}, with an invite to join.</p><p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.55;color:#f0dfd4">Make an account through this link and it comes off your first order.</p></td>
</tr></table></td></tr></table></td></tr>
${
  note
    ? `${spacer(16)}<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr><td class="pad" style="padding:26px 32px">
<p style="margin:0;font-family:${SERIF};font-size:48px;line-height:0.6;color:${C.clay}">&ldquo;</p>
<p style="margin:0 0 10px;font-family:${SERIF};font-size:22px;line-height:1.4;color:${C.ink}">${esc(note)}</p>
<p style="margin:0;font-family:${SANS};font-size:13px;letter-spacing:0.08em;color:${C.muted}">${from.toUpperCase()}</p></td></tr></table></td></tr>`
    : ''
}
<tr><td style="padding:28px 4px 0">${p('The Home Lab makes room sets inspired by places around the world. Each set arrives in one box with every piece it needs.', C.soft, 16)}${button(`Claim my ${FRIEND}`, esc(link))}</td></tr>
${collection()}
${shortNote("You haven't been added to any mailing list. This is the only email you'll get from us unless you sign up.")}`;
  const reason = `You're getting this because ${from}, a Home Lab member, entered your email address to invite you.`;
  return {
    subject: `${fromName} sent you ${FRIEND} off at The Home Lab`,
    html: shell({ site, title: `${from} sent you ${FRIEND} off`, preheader: `${FRIEND} off your first room set, from ${from}.`, label: 'AN&nbsp;INVITE', body, reason, footer: footer(site) }),
    text: plain(
      `${fromName} thinks you'd love The Home Lab, so they've sent you ${FRIEND} off your first order.`,
      note && `${fromName} wrote: "${note}"`,
      'The Home Lab makes room sets inspired by places around the world. Each set arrives in one box with every piece it needs.',
      `Claim your ${FRIEND}: ${link}`,
      "You haven't been added to any mailing list.",
      `You're getting this because ${fromName}, a Home Lab member, entered your email address to invite you.`,
    ),
  };
}

export function referralRewardEmail({ firstName, code, expires }: { firstName?: string | null; code: string; expires?: string | null }): Email {
  const site = SITE_URL;
  const name = firstOf(firstName);
  const body = `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr>
<td class="stack pad" valign="top" style="padding:40px 30px 36px 44px">${eyebrow("YOUR FRIEND'S ORDER HAS SHIPPED")}${h1(`Thank you${withName(firstName)}. Here’s ${MEMBER}.`)}${p(`A friend you invited has had their first order shipped, so you've earned ${MEMBER} credit. Use the code below at checkout.`, C.soft, 16)}</td>
<td class="stack stack-img" width="210" valign="top" style="width:210px;line-height:0;font-size:0;border-radius:0 6px 6px 0"><img src="${site}/email/reward-side.jpg" width="210" alt="A crystal decanter set in an open black gift box" style="display:block;width:210px;height:auto;border:0;border-radius:0 6px 6px 0;background:#f3efe9"></td>
</tr></table></td></tr>
${spacer(16)}
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};border-radius:8px"><tr>
<td valign="middle" class="pad" style="padding:28px 32px">
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.16em;color:${C.oat}">YOUR CODE</p>
<p style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.15;letter-spacing:0.04em;color:${C.paper};word-break:break-all">${esc(code)}</p>
<p style="margin:10px 0 0;font-family:${SANS};font-size:13px;color:#a39b90">${expires ? `Use it at checkout before ${esc(expires)}.` : 'Use it at checkout.'}</p></td>
<td width="100" valign="middle" align="center" style="width:100px;padding:20px 8px;border-left:2px dashed #4a4c48"><p style="margin:0;font-family:${SERIF};font-size:36px;line-height:1;color:${C.oat}">${MEMBER}</p><p style="margin:6px 0 0;font-family:${SANS};font-size:11px;letter-spacing:0.14em;color:#a39b90">CREDIT</p></td>
</tr></table></td></tr>
<tr><td style="padding:28px 4px 0">${button('See my rewards', `${site}/account/referrals`)}</td></tr>
${spacer(28)}
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sandDeep};border-radius:6px"><tr><td class="pad" style="padding:24px 30px">
<p style="margin:0 0 6px;font-family:${SERIF};font-size:21px;color:${C.ink}">Keep sharing.</p>
<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}">Each friend whose first order ships earns you another ${MEMBER}, and they get ${FRIEND} off. Your link is on your <a href="${site}/account/referrals" style="color:${C.clay}">referrals page</a>.</p>
</td></tr></table></td></tr>
${shortNote('Thank you for telling people about us. It means a lot to a small shop.')}`;
  return {
    subject: `You've earned ${MEMBER} at The Home Lab`,
    html: shell({ site, title: `You've earned ${MEMBER}`, preheader: `A friend's first order has shipped, so here's your ${MEMBER} credit.`, label: 'A&nbsp;THANK&nbsp;YOU', body, reason: ACCOUNT_REASON, footer: footer(site) }),
    text: plain(
      `Thank you${name ? `, ${name}` : ''}. Here's ${MEMBER}.`,
      `A friend you invited has had their first order shipped, so you've earned ${MEMBER} credit.`,
      `Your code: ${code}${expires ? ` (use it before ${expires})` : ''}`,
      `See your rewards: ${site}/account/referrals`,
      ACCOUNT_REASON,
    ),
  };
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

/** The set's name in its own language, shown above the title in launch alerts. */
const NATIVE: Record<string, { word: string; attrs: string; font: string }> = {
  'Kyoto Kissaten': { word: '喫茶店', attrs: 'lang="ja"', font: "'Hiragino Mincho ProN','Yu Mincho',serif" },
  'The Milanese': { word: 'Milano', attrs: 'lang="it"', font: SERIF },
  'Riad Corner': { word: 'رياض', attrs: 'lang="ar" dir="rtl"', font: "'Geeza Pro','Noto Naskh Arabic',serif" },
};

export function launchAlertEmail({ setTitle, href }: { setTitle: string; href: string }): Email {
  const site = SITE_URL;
  const title = esc(setTitle);
  const url = abs(href);
  const batch = batchDates();
  const native = NATIVE[setTitle];
  const date = (label: string, value: string, border: boolean) =>
    `<td width="50%" align="center" style="width:50%;padding:16px 8px;${border ? 'border-left:1px solid #7a846c;' : ''}"><p style="margin:0 0 4px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.16em;color:#d6dacb">${label}</p><p style="margin:0;font-family:${SERIF};font-size:22px;color:${C.paper}">${value}</p></td>`;
  const body = `<tr><td align="center" class="pad" style="background:${C.olive};padding:52px 48px 46px;border-radius:6px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border:1px solid #c9cfba;border-radius:40px;padding:7px 18px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.18em;color:#e6e2c8">NOW&nbsp;OPEN</td></tr></table>
${native ? `<p ${native.attrs} style="margin:30px 0 0;font-family:${native.font};font-size:40px;line-height:1.1;color:#e6e2c8;text-align:center">${native.word}</p>` : ''}
<h1 class="h1" style="margin:${native ? 10 : 26}px 0 16px;font-family:${SERIF};font-weight:400;font-size:52px;line-height:1.05;letter-spacing:-0.02em;color:${C.paper};text-align:center">${title}</h1>
<p style="margin:0 0 28px;font-family:${SANS};font-size:17px;line-height:1.6;color:#d6dacb;text-align:center">You asked us to tell you when this set opened.<br>It's open for orders now.</p>
${
  batch
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #7a846c;border-bottom:1px solid #7a846c;margin:0 0 30px"><tr>${date('ORDER BY', batch.close, false)}${date('POSTED BY', batch.ships, true)}</tr></table>`
    : ''
}
<table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td>${button(`See ${title}`, esc(url), false)}</td></tr></table>
</td></tr>
${shortNote("This was a one-off alert. You won't get another email about this set.")}`;
  const reason = "You're getting this because you asked for a launch alert in your Home Lab account.";
  return {
    subject: `${setTitle} is open for orders`,
    html: shell({ site, title: `${title} is open for orders`, preheader: 'You asked us to tell you when it opened. It’s open now.', label: 'LAUNCH&nbsp;ALERT', body, reason, footer: footer(site) }),
    text: plain(
      `${setTitle} is open for orders.`,
      'You asked us to tell you when this set opened. It is open for orders now.',
      batch && `Order by ${batch.close}. Posted by ${batch.ships}.`,
      `See ${setTitle}: ${url}`,
      "This was a one-off alert. You won't get another email about this set.",
      reason,
    ),
  };
}

// ─── Contact form ────────────────────────────────────────────────────────────

const SUBJECT_LABELS: Record<string, string> = {
  order: 'An order',
  product: 'A product',
  delivery: 'Delivery',
  returns: 'Returns',
  trade: 'Trade enquiry',
  other: 'Something else',
};

const paras = (text: string, style: string) =>
  text
    .split(/\n{2,}/)
    .map((t) => `<p style="${style}">${esc(t).replace(/\n/g, '<br>')}</p>`)
    .join('');

/** Sent to the shop inbox. Replying goes straight to the customer. */
export function contactNotificationEmail(m: { name: string; email: string; subject: string; orderNumber?: string; message: string }): Email {
  const site = SITE_URL;
  const about = SUBJECT_LABELS[m.subject] ?? m.subject;
  const row = (label: string, value: string) =>
    `<tr><td width="120" valign="top" style="width:120px;padding:12px 12px 12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.muted}">${label}</td><td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.ink};word-break:break-all">${value}</td></tr>`;
  const mail = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${about}`)}`;
  const body = `<tr><td class="pad" style="background:${C.ink};padding:32px 40px 28px;border-radius:6px 6px 0 0">${eyebrow(`NEW MESSAGE &nbsp;&middot;&nbsp; ${esc(about).toUpperCase()}`, C.oat)}<p style="margin:0;font-family:${SERIF};font-size:32px;line-height:1.15;color:${C.paper}">From ${esc(m.name)}</p></td></tr>
<tr><td class="pad" style="background:${C.paper};padding:12px 40px 34px;border-radius:0 0 6px 6px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('EMAIL', `<a href="mailto:${esc(m.email)}" style="color:${C.clay}">${esc(m.email)}</a>`)}
${row('ABOUT', esc(about))}
${m.orderNumber ? row('ORDER', esc(m.orderNumber)) : ''}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 26px"><tr><td style="border-left:3px solid ${C.clay};padding:4px 0 4px 20px">${paras(m.message, `margin:0 0 14px;font-family:${SERIF};font-size:19px;line-height:1.5;color:${C.ink}`)}</td></tr></table>
${button(`Reply to ${esc(firstOf(m.name) || m.name)}`, mail)}
<p style="margin:16px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">Or just press reply: it goes straight to ${esc(m.email)}.</p>
</td></tr>`;
  const reason = 'Sent by the contact form at thehomelab.ie. Reply to this email to answer the customer directly.';
  return {
    subject: `Website message from ${m.name}: ${about}`,
    html: shell({ site, title: `Message from ${esc(m.name)}`, preheader: esc(m.message.slice(0, 90)), label: 'WEBSITE&nbsp;MESSAGE', body, reason }),
    text: plain(`New message from ${m.name} <${m.email}>`, `About: ${about}${m.orderNumber ? `\nOrder: ${m.orderNumber}` : ''}`, m.message, reason),
  };
}

/** Sent to the customer as a receipt for their message. */
export function contactAcknowledgementEmail({ name, message }: { name: string; message: string }): Email {
  const site = SITE_URL;
  const first = firstOf(name);
  const copy = message.length > 600 ? `${message.slice(0, 600)}…` : message;
  const body = `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr><td class="pad" style="padding:40px 48px 36px">
${eyebrow('MESSAGE RECEIVED')}${h1(`Thanks${first ? `, ${esc(first)}` : ''}. We've got your message.`)}${p("A real person here reads every message and replies to this email address. Here's a copy of what you sent.", C.soft, 16)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};border:1px dashed ${C.line};border-radius:6px"><tr><td style="padding:22px 26px">
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.muted}">YOU WROTE</p>
${paras(copy, `margin:0 0 10px;font-family:${SERIF};font-size:18px;line-height:1.5;font-style:italic;color:${C.soft}`)}
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:36px 4px 14px">${eyebrow('IN THE MEANTIME')}${h2('Answers to common questions')}</td></tr>
<tr><td>${linkTiles([
    { title: 'Delivery', line: 'Dates and costs', href: '/help/delivery' },
    { title: 'Returns', line: 'How they work', href: '/help/returns' },
    { title: 'FAQs', line: 'Everything else', href: '/help/faqs' },
  ])}</td></tr>
${shortNote('Want to add something? Reply to this email and it joins the same conversation.')}`;
  const reason = "You're getting this because you sent a message using the contact form at thehomelab.ie.";
  return {
    subject: "We've got your message",
    html: shell({ site, title: "We've got your message", preheader: 'Thanks for getting in touch. A real person will reply to this address.', label: 'MESSAGE&nbsp;RECEIVED', body, reason, footer: footer(site) }),
    text: plain(`Thanks${first ? `, ${first}` : ''}. We've got your message.`, "A real person reads every message and replies to this email address. Here's a copy of what you sent:", copy, `Delivery: ${site}/help/delivery\nReturns: ${site}/help/returns\nFAQs: ${site}/help/faqs`, reason),
  };
}
