// Writes the email templates to /emails:
//  - emails/supabase/*.html   paste into Supabase › Authentication › Emails
//  - emails/newsletter-broadcast.html   starting point for Resend broadcasts
//  - emails/previews/*.html   every email the site sends, with sample details
// Run with: npm run emails
import { mkdirSync, writeFileSync } from 'node:fs';
const SITE = 'https://thehomelab.ie';
// Links and the logo point at the live site.
process.env.NEXT_PUBLIC_SITE_URL ??= SITE;
const t = await import('../src/lib/email/templates.ts');
const out = (path, html) => {
  mkdirSync(new URL('.', new URL(path, import.meta.url)), { recursive: true });
  writeFileSync(new URL(path, import.meta.url), html);
};

const subjects = [];
for (const [name, email] of Object.entries(t.supabaseTemplates(SITE))) {
  out(`../emails/supabase/${name}.html`, email.html);
  subjects.push(`${name}: ${email.subject}`);
}
out('../emails/supabase/SUBJECTS.txt', subjects.join('\n') + '\n');
out('../emails/newsletter-broadcast.html', t.newsletterBroadcastTemplate(SITE).html);

const samples = {
  welcome: t.welcomeEmail({ firstName: 'Emma', referralCode: 'EMMA-7KQ2' }),
  'newsletter-confirm': t.newsletterConfirmEmail({ confirmUrl: `${SITE}/newsletter/confirm?token=sample` }),
  'newsletter-welcome': t.newsletterWelcomeEmail({ unsubscribeUrl: `${SITE}/newsletter/unsubscribe?token=sample` }),
  'referral-invite': t.referralInviteEmail({ fromName: 'Emma', link: `${SITE}/r/EMMA-7KQ2`, note: 'The Kyoto set is lovely.' }),
  'referral-reward': t.referralRewardEmail({ firstName: 'Emma', code: 'THANKS-7KQ2', expires: '31 March 2027' }),
  'launch-alert': t.launchAlertEmail({ setTitle: 'Riad Corner', href: '/sets/riad-corner' }),
  'account-deleted': t.accountDeletedEmail({ firstName: 'Emma' }),
  'contact-notification': t.contactNotificationEmail({ name: 'Emma Byrne', email: 'emma@example.com', subject: 'order', orderNumber: '#1001', message: 'Hello,\n\nCan the Kyoto set be delivered to Cork before 20 December?' }),
  'contact-acknowledgement': t.contactAcknowledgementEmail({ name: 'Emma Byrne', message: 'Can the Kyoto set be delivered to Cork before 20 December?' }),
};
for (const [name, email] of Object.entries(samples)) out(`../emails/previews/${name}.html`, email.html);
console.log(`Wrote ${subjects.length} Supabase templates, the broadcast template and ${Object.keys(samples).length} previews.`);
