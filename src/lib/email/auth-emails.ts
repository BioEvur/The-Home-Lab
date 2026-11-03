/**
 * The emails Supabase Auth sends (sign-up, sign-in link, password reset and so
 * on). Each one has its own design. Run `npm run emails` to write them to
 * emails/supabase/ for pasting into Supabase › Authentication › Emails.
 *
 * Supabase fills the {{ ... }} tags: .ConfirmationURL, .Token, .Email,
 * .NewEmail and .Data (the member's sign-up details, e.g. .Data.first_name).
 * Images load from the live site, so they show once the site is deployed.
 */
import { C, SANS, SERIF, FIRST_NAME, eyebrow, h1, h2, p, button, fallbackLink, hero, card, collection, perks, welcomeNote, shortNote, shell } from './design';


export interface AuthEmail {
  subject: string;
  html: string;
}


export function supabaseTemplates(site = 'https://thehomelab.ie'): Record<string, AuthEmail> {
  const host = site.replace(/^https?:\/\//, '');

  const confirmSignup: AuthEmail = {
    subject: 'Confirm your email for The Home Lab',
    html: shell({
      site,
      title: 'Confirm your email for The Home Lab',
      preheader: "One tap and you're a member. Here's what's waiting for you.",
      label: 'YOUR&nbsp;MEMBERSHIP',
      body: `${hero(site, 'welcome-hero.jpg', 'The Milanese set on a marble counter: travertine lamp, crystal decanter, silver tumblers and candle holders', '#d9c4ad')}
${card(`${eyebrow('WELCOME TO THE HOME LAB')}${h1(`Come in${FIRST_NAME}.`)}${p("Your account is made. Confirm your email address and you're a member: your orders, wishlist and friend rewards all in one place.", C.soft)}${button('Confirm my email', '{{ .ConfirmationURL }}')}${fallbackLink()}`)}
${collection()}
${perks()}
${welcomeNote('See you inside,')}`,
      reason: `You're getting this because someone signed up at ${host} with this email address. If it wasn't you, ignore this email and no account will be made.`,
    }),
  };

  const invite: AuthEmail = {
    subject: "You're invited to The Home Lab",
    html: shell({
      site,
      title: "You're invited to The Home Lab",
      preheader: 'Accept your invitation and set a password to get started.',
      label: 'AN&nbsp;INVITATION',
      body: `${hero(site, 'invite-hero.jpg', 'The Kyoto Kissaten set: handleless cups, glass dripper, gooseneck kettle, hand grinder and acacia serving board', '#f3efe9')}
${card(`${eyebrow("YOU'RE INVITED", C.oat)}${h1('There’s a seat for you at our table.', C.paper)}${p('You’ve been invited to join The Home Lab. Accept the invitation and choose a password, and your account is ready.', '#cfc8bd')}${button('Accept the invitation', '{{ .ConfirmationURL }}', false)}${fallbackLink('#a39b90', C.oat)}`, C.ink)}
${collection()}
${welcomeNote('Glad to have you,')}`,
      reason: "You're getting this because The Home Lab invited this email address to create an account. If you weren't expecting it, you can ignore this email.",
    }),
  };

  const magicLink: AuthEmail = {
    subject: 'Your sign-in link for The Home Lab',
    html: shell({
      site,
      title: 'Your sign-in link for The Home Lab',
      preheader: 'Tap the button to sign in. The link works once.',
      label: 'SIGN&nbsp;IN',
      body: `${hero(site, 'sign-in-hero.jpg', 'Two lit ceramic candle holders on a marble counter', '#8f7b66')}
${card(`${eyebrow('ONE TAP AND YOU’RE IN', C.oat)}${h1(`Welcome back${FIRST_NAME}.`, C.paper)}${p('Here’s your link to sign in to The Home Lab. It works once and expires after a short while, so use it soon.', '#cfc8bd')}${button('Sign me in', '{{ .ConfirmationURL }}', false)}${fallbackLink('#a39b90', C.oat)}`, C.ink)}
<tr><td style="padding:28px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${[
  ['Your orders', 'Track a delivery', '/account/orders'],
  ['Your wishlist', 'Pieces you saved', '/account/wishlist'],
  ['Refer a friend', '&euro;15 each', '/account/referrals'],
]
  .map(
    ([t, s, href], i) =>
      `${i ? '<td class="gap" width="12" style="width:12px;font-size:0">&nbsp;</td>' : ''}<td class="tile" width="192" valign="top" style="width:192px;background:${C.paper};border:1px solid #e2d6c6;border-radius:6px;padding:16px 16px 14px"><a href="${site}${href}" style="text-decoration:none"><span style="display:block;font-family:${SERIF};font-size:18px;color:${C.ink}">${t}</span><span style="display:block;margin-top:2px;font-family:${SANS};font-size:13px;color:${C.muted}">${s} &rarr;</span></a></td>`,
  )
  .join('')}
</tr></table></td></tr>
${shortNote('Questions about an order? Reply to this email and a real person will get back to you.')}`,
      reason: "Someone asked to sign in to The Home Lab with this email address. If it wasn't you, ignore this email. Nobody can sign in without this link.",
    }),
  };

  const changeEmail: AuthEmail = {
    subject: 'Confirm your new email address',
    html: shell({
      site,
      title: 'Confirm your new email address',
      preheader: 'Confirm the change and your account moves to your new address.',
      label: 'ACCOUNT&nbsp;UPDATE',
      body: `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:6px"><tr>
<td class="stack stack-img" width="230" valign="middle" style="width:230px;line-height:0;font-size:0;background:#f4f1ec;border-radius:6px 0 0 6px"><img src="${site}/email/change-email.jpg" width="230" alt="Four handleless ceramic cups in a gift box" style="display:block;width:230px;height:auto;border:0;border-radius:6px 0 0 6px;background:#f3efe9"></td>
<td class="stack pad" valign="top" style="padding:36px 36px 32px">${eyebrow('NEW ADDRESS')}<h1 class="h1" style="margin:0 0 16px;font-family:${SERIF};font-weight:400;font-size:36px;line-height:1.1;letter-spacing:-0.02em;color:${C.ink}">Moving your account to a new address</h1>${p('You asked to change the email on your Home Lab account. Press the button to confirm it.', C.soft, 16)}</td>
</tr></table></td></tr>
<tr><td style="padding:16px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border:2px dashed ${C.line};border-radius:6px"><tr><td class="pad" style="padding:22px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td width="56" style="width:56px;padding:4px 0;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.muted}">FROM</td><td style="padding:4px 0;font-family:${SANS};font-size:16px;color:${C.muted};text-decoration:line-through;word-break:break-all">{{ .Email }}</td></tr>
<tr><td width="56" style="width:56px;padding:4px 0;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.clay}">TO</td><td style="padding:4px 0;font-family:${SERIF};font-size:22px;color:${C.ink};word-break:break-all">{{ .NewEmail }}</td></tr>
</table>
<div style="height:20px;line-height:20px;font-size:0">&nbsp;</div>
${button('Confirm the change', '{{ .ConfirmationURL }}')}
</td></tr></table></td></tr>
<tr><td style="padding:22px 4px 0">${p('Everything comes with you: your orders, wishlist, rewards and referral link stay on the same account.', C.soft, 15)}${fallbackLink()}</td></tr>
${shortNote('Something not right? Reply to this email and we’ll sort it out.')}`,
      reason: "If you didn't ask to change your email, ignore this email and your address stays as it is. It's also a good idea to change your password.",
    }),
  };

  const resetPassword: AuthEmail = {
    subject: 'Reset your Home Lab password',
    html: shell({
      site,
      title: 'Reset your Home Lab password',
      preheader: 'Choose a new password and you’re back in.',
      label: 'PASSWORD&nbsp;RESET',
      body: `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};border-radius:6px"><tr>
<td class="stack pad" valign="top" style="padding:40px 36px 36px 44px">${eyebrow('IT HAPPENS TO EVERYONE', C.oat)}<h1 class="h1" style="margin:0 0 16px;font-family:${SERIF};font-weight:400;font-size:34px;line-height:1.1;letter-spacing:-0.02em;color:${C.paper}">Let’s get you back in.</h1>${p('We got a request to reset the password for <span style="color:#fbf8f3;word-break:break-all">{{ .Email }}</span>. Put the kettle on and choose a new one.', '#cfc8bd', 16)}${button('Choose a new password', '{{ .ConfirmationURL }}', false)}</td>
<td class="stack stack-img" width="220" valign="middle" style="width:220px;line-height:0;font-size:0;background:#f4f1ec;border-radius:0 6px 6px 0"><img src="${site}/email/reset-hero.jpg" width="220" alt="Matt black electric gooseneck kettle" style="display:block;width:220px;height:auto;border:0;border-radius:0 6px 6px 0;background:#f3efe9"></td>
</tr></table></td></tr>
<tr><td style="padding:16px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sandDeep};border-radius:6px"><tr><td class="pad" style="padding:22px 28px">
<p style="margin:0 0 6px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;color:${C.clay}">A GOOD PASSWORD</p>
<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}">At least 10 characters, with letters and numbers. Three random words you'll remember, plus a number, work well, for example <span style="font-family:${SERIF};font-size:17px;color:${C.ink}">copper-lantern-tide-42</span>. Use one you don't use anywhere else.</p>
</td></tr></table></td></tr>
<tr><td style="padding:6px 4px 0">${fallbackLink()}<p style="margin:12px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">The link works once and expires after a short while.</p></td></tr>
${shortNote('Still stuck? Reply to this email and a real person will help you get in.')}`,
      reason: "If you didn't ask to reset your password, ignore this email. Your password won't change.",
    }),
  };

  const reauthentication: AuthEmail = {
    subject: 'Your Home Lab confirmation code',
    html: shell({
      site,
      title: 'Your Home Lab confirmation code',
      preheader: 'Enter this code to confirm it’s you.',
      label: 'SECURITY&nbsp;CHECK',
      body: `${card(`${eyebrow('JUST CHECKING IT’S YOU')}${h1('Here’s your code.')}${p('Enter this code on The Home Lab to confirm the change you’re making to your account.', C.soft)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};border-radius:6px"><tr><td style="padding:10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed #5a5c58;border-radius:4px"><tr><td align="center" style="padding:28px 12px 26px">
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.16em;color:${C.oat}">YOUR CODE</p>
<p class="code" style="margin:0;font-family:${SERIF};font-size:46px;line-height:1;letter-spacing:0.24em;color:${C.paper}">{{ .Token }}</p>
<p style="margin:12px 0 0;font-family:${SANS};font-size:13px;color:#a39b90">Expires after a short while</p>
</td></tr></table></td></tr></table>
<p style="margin:24px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}"><strong style="color:${C.ink}">Keep it to yourself.</strong> We'll never ask you for this code by phone, message or email.</p>`, C.paper, '6px')}
${shortNote('Didn’t ask for a code? Reply to this email and let us know.')}`,
      reason: "You're getting this because someone signed in to your Home Lab account asked to confirm a change. If it wasn't you, change your password.",
    }),
  };

  return {
    'confirm-signup': confirmSignup,
    'reset-password': resetPassword,
    'magic-link': magicLink,
    'change-email': changeEmail,
    invite,
    reauthentication,
  };
}
