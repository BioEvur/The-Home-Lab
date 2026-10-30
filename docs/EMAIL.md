# Email

The site sends its own emails through [Resend](https://resend.com) from `info@thehomelab.ie`. Zoho Mail stays as the inbox: replies and contact form messages arrive there as before. Resend's free plan covers 3,000 emails a month and 1,000 newsletter contacts.

| Email | Sent when | Template |
| --- | --- | --- |
| Confirm your email, reset password, change email, magic link, invite, confirmation code | Supabase Auth actions | `emails/supabase/*.html`, pasted into Supabase |
| Welcome | A member confirms their email | `welcomeEmail` |
| Newsletter confirm, newsletter welcome | Someone signs up (double opt-in) and presses the link | `newsletterConfirmEmail`, `newsletterWelcomeEmail` |
| Referral invite | A member invites a friend by email | `referralInviteEmail` |
| Referral reward | A referred friend's first order ships | `referralRewardEmail` |
| Contact form (to you, and a copy to the customer) | The contact form is sent | `contactNotificationEmail`, `contactAcknowledgementEmail` |
| Account deleted | A member deletes their account | `accountDeletedEmail` |
| Launch alert | A coming-soon set opens (template ready, sent on request) | `launchAlertEmail` |
| Newsletter | You write one in Resend Broadcasts | `emails/newsletter-broadcast.html` |

All templates live in `src/lib/email/templates.ts` and share one layout (`src/lib/email/layout.ts`). Every email has a plain-text version. After changing a template run `npm run emails` to refresh the HTML files in `emails/` and the previews in `emails/previews/`.

## 1. Verify the domain in Resend

1. Create a Resend account and choose the EU region (Ireland) if asked.
2. Domains › Add domain › `thehomelab.ie`.
3. Resend shows three or four DNS records (an MX and TXT on a `send` subdomain, and a DKIM TXT on `resend._domainkey`). Add each one in Cloudflare › DNS › Records exactly as shown, with the proxy turned off (grey cloud).
4. Press Verify. These records sit on subdomains, so they do not touch the Zoho MX and SPF records on `thehomelab.ie` itself.
5. Optional but recommended: add a DMARC record if Zoho setup did not, `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:info@thehomelab.ie`.

## 2. API key and audience

1. API Keys › Create, with "Sending access" for `thehomelab.ie`. Copy it once.
2. Audiences: Resend creates a default audience. Copy its ID. Confirmed newsletter subscribers are added here, and unsubscribes are synced both ways through the link in each email.

## 3. Cloudflare variables

In Cloudflare › Workers & Pages › the-home-lab › Settings › Variables and Secrets, add (as **Secret** for the key, plain text for the rest):

```
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=...
EMAIL_FROM=The Home Lab <info@thehomelab.ie>
EMAIL_REPLY_TO=info@thehomelab.ie
CONTACT_INBOX=info@thehomelab.ie
```

Then redeploy (Deployments › latest › Retry, or push any commit).

## 4. Supabase sends through Resend

In Supabase › Project Settings › Authentication › SMTP Settings, turn on custom SMTP:

| Field | Value |
| --- | --- |
| Sender email | `info@thehomelab.ie` |
| Sender name | `The Home Lab` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | your Resend API key |

Then in Authentication › Emails › Templates, for each template paste the subject from `emails/supabase/SUBJECTS.txt` and the HTML from the matching file in `emails/supabase/`. Leave the `{{ .ConfirmationURL }}` style tags exactly as they are.

## 5. Sending a newsletter

In Resend › Broadcasts › New, choose the audience, paste `emails/newsletter-broadcast.html` as the HTML and replace the placeholder text. The unsubscribe link is filled in by Resend. Only confirmed subscribers are in the audience.

## Without Resend

Everything still works, with less: the newsletter records consent straight away instead of sending a confirmation email, referral invites by email are switched off (the referral link still works), and the contact form uses `CONTACT_WEBHOOK_URL` if set.
